import React, { useState } from "react";
import { moviesAPI } from "../services/api";
import ErrorBoundary from "./ErrorBoundary";
import "./Moviepage.css";

// props: onSaveMovie(movie), savedMovies (array)
const MovieSearchPage = ({ onSaveMovie = () => {}, savedMovies = [] }) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    
    try {
      // Call backend API for movie search (backend handles OMDb API)
      const result = await moviesAPI.search(query);
      
      if (result.success) {
        setMovies(result.data.movies || []);
      } else {
        setMovies([]);
        setError(result.message || "No results found");
      }
    } catch (err) {
      setError("Search failed. Please check your connection and try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (movie) => {
    try {
      // Call backend API to save movie
      const result = await moviesAPI.save(movie);
      
      if (result.success) {
        // Normalize movie object for the parent component
        const normalized = {
          imdbID: movie.imdbID,
          Title: movie.title || movie.Title,
          Year: movie.year || movie.Year,
          Poster: movie.poster || movie.Poster || "",
        };
        onSaveMovie(normalized);
      } else {
        setError(result.message || "Failed to save movie");
      }
    } catch (err) {
      setError("Failed to save movie. Please try again.");
    }
  };

  const isSaved = (imdbID) => savedMovies.some((m) => m.imdbID === imdbID);

  return (
    <div className="movie-page">
      <h1 className="movie-title">🎬 Movie Search</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <ErrorBoundary key={movie.imdbID || movie.id}>
            <div className="movie-card">
            <div className="movie-poster-container">
              <img
                src={
                  (movie.poster || movie.Poster) && (movie.poster || movie.Poster) !== "N/A" 
                    ? (movie.poster || movie.Poster)
                    : "https://via.placeholder.com/300x450/cccccc/666666?text=No+Image"
                }
                alt={movie.title || movie.Title}
                className="movie-poster"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x450/cccccc/666666?text=No+Image";
                }}
                onLoad={(e) => {
                  e.target.style.opacity = '1';
                }}
                style={{ opacity: '0', transition: 'opacity 0.3s ease' }}
              />
            </div>
            <h3>{movie.title || movie.Title}</h3>
            <p>{movie.year || movie.Year}</p>
            <button
              className="save-btn"
              onClick={() => handleSave(movie)}
              disabled={isSaved(movie.imdbID)}
            >
              {isSaved(movie.imdbID) ? "Saved" : "Save"}
            </button>
            </div>
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
};

export default MovieSearchPage;