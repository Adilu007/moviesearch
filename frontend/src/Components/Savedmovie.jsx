import React from "react";
import "./Savedmovie.css";

const SavedMovies = ({ savedMovies = [], onDeleteMovie }) => {
  return (
    <div className="saved-movies-container">
      <h2 className="saved-movies-title">My Saved Movies</h2>
      {savedMovies.length === 0 ? (
        <div className="no-movies">
          <p>No movies saved yet.</p>
          <p>Go to the search page to find and save your favorite movies!</p>
        </div>
      ) : (
        <div className="movies-grid">
          {savedMovies.map((movie) => (
            <div key={movie.imdbID} className="movie-card">
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
              <div className="movie-info">
                <h3>{movie.title || movie.Title}</h3>
                <p>{movie.year || movie.Year}</p>
                <div className="movie-actions">
                  <button className="saved-btn">Saved ✓</button>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteMovie(movie.imdbID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMovies;