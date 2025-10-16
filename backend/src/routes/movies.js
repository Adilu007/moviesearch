import express from 'express';
import axios from 'axios';
import Movie from '../models/Movie.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all movie routes
router.use(authMiddleware);

// @route   GET /api/movies/search
// @desc    Search movies from OMDb API
// @access  Private
router.get('/search', async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Movie title is required'
      });
    }

    // Call OMDb API
    const omdbResponse = await axios.get(`http://www.omdbapi.com/`, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: title,
        type: 'movie'
      }
    });

    if (omdbResponse.data.Response === 'False') {
      return res.status(404).json({
        success: false,
        message: omdbResponse.data.Error || 'No movies found'
      });
    }

    // Filter and format the response
    const movies = omdbResponse.data.Search.map(movie => ({
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster !== 'N/A' ? movie.Poster : null,
      imdbID: movie.imdbID
    }));

    res.json({
      success: true,
      message: 'Movies retrieved successfully',
      data: {
        movies,
        totalResults: omdbResponse.data.totalResults
      }
    });

  } catch (error) {
    console.error('Movie search error:', error);

    if (error.response && error.response.status === 401) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OMDb API key'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during movie search'
    });
  }
});

// @route   POST /api/movies/save
// @desc    Save a movie to user's list
// @access  Private
router.post('/save', async (req, res) => {
  try {
    const { title, year, poster, imdbID } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !year || !imdbID) {
      return res.status(400).json({
        success: false,
        message: 'Title, year, and imdbID are required'
      });
    }

    // Check if movie already exists in database
    let movie = await Movie.findOne({ imdbID });

    if (movie) {
      // Check if user has already saved this movie
      if (movie.savedBy.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Movie already saved to your list'
        });
      }

      // Add user to savedBy array
      movie.savedBy.push(userId);
      await movie.save();
    } else {
      // Create new movie
      movie = new Movie({
        title,
        year,
        poster: poster || null,
        imdbID,
        savedBy: [userId]
      });
      await movie.save();
    }

    // Add movie to user's savedMovies array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedMovies: movie._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Movie saved successfully',
      data: {
        movie: {
          id: movie._id,
          title: movie.title,
          year: movie.year,
          poster: movie.poster,
          imdbID: movie.imdbID
        }
      }
    });

  } catch (error) {
    console.error('Save movie error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while saving movie'
    });
  }
});

// @route   GET /api/movies/list
// @desc    Get all movies saved by the authenticated user
// @access  Private
router.get('/list', async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user with populated saved movies
    const user = await User.findById(userId).populate({
      path: 'savedMovies',
      select: 'title year poster imdbID createdAt'
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Saved movies retrieved successfully',
      data: {
        movies: user.savedMovies,
        count: user.savedMovies.length
      }
    });

  } catch (error) {
    console.error('Get saved movies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving saved movies'
    });
  }
});

// @route   DELETE /api/movies/remove/:imdbID
// @desc    Remove a movie from user's saved list (Bonus Feature)
// @access  Private
router.delete('/remove/:imdbID', async (req, res) => {
  try {
    const { imdbID } = req.params;
    const userId = req.user._id;

    // Find the movie
    const movie = await Movie.findOne({ imdbID });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Check if user has saved this movie
    if (!movie.savedBy.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Movie not in your saved list'
      });
    }

    // Remove user from movie's savedBy array
    movie.savedBy.pull(userId);

    // If no users have saved this movie, delete it
    if (movie.savedBy.length === 0) {
      await Movie.findByIdAndDelete(movie._id);
    } else {
      await movie.save();
    }

    // Remove movie from user's savedMovies array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { savedMovies: movie._id } },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Movie removed from your saved list successfully'
    });

  } catch (error) {
    console.error('Remove movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing movie'
    });
  }
});

export default router;