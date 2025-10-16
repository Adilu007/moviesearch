import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Movie year is required']
  },
  poster: {
    type: String,
    required: [true, 'Movie poster URL is required']
  },
  imdbID: {
    type: String,
    required: [true, 'IMDb ID is required'],
    unique: true
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Ensure each user can only save a movie once
movieSchema.index({ imdbID: 1, 'savedBy': 1 }, { unique: true });

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;