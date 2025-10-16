import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser, authAPI, moviesAPI } from "./services/api";
import "./App.css";
import Loginpage from "./Components/Loginpage";
import Register from "./Components/Register";
import Moviepage from "./Components/Moviepage";
import Savedmovie from "./Components/Savedmovie";
import Navbar from "./Components/Navbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [savedMovies, setSavedMovies] = useState([]);

  // Check for saved login state on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getCurrentUser();
      setUser(user);
      setIsLoggedIn(true);
      loadSavedMovies(); // Load movies from backend
    }
  }, []);

  // Load saved movies from backend
  const loadSavedMovies = async () => {
    try {
      const result = await moviesAPI.getSaved();
      if (result.success) {
        setSavedMovies(result.data.movies || []);
      }
    } catch (error) {
      console.error('Failed to load saved movies:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    loadSavedMovies(); // Load user's saved movies after login
  };

  const handleLogout = () => {
    authAPI.logout(); // Clear tokens and user data
    setUser(null);
    setIsLoggedIn(false);
    setSavedMovies([]); // Clear saved movies
  };

  const handleSaveMovie = (movie) => {
    // Movie is already saved via backend API in Moviepage component
    // Just add to local state to update UI immediately
    setSavedMovies(prevMovies => {
      const isAlreadySaved = prevMovies.some(m => m.imdbID === movie.imdbID);
      if (!isAlreadySaved) {
        return [...prevMovies, movie];
      }
      return prevMovies;
    });
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      // Call backend API to remove movie
      const result = await moviesAPI.remove(movieId);
      
      if (result.success) {
        // Update local state
        setSavedMovies(prevMovies => 
          prevMovies.filter(movie => movie.imdbID !== movieId)
        );
      } else {
        console.error('Failed to delete movie:', result.message);
      }
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              !isLoggedIn ? 
                <Loginpage onLogin={handleLogin} /> : 
                <Navigate to="/movies" />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isLoggedIn ? 
                <Register /> : 
                <Navigate to="/movies" />
            } 
          />
          <Route 
            path="/movies" 
            element={
              isLoggedIn ? 
                <Moviepage 
                  onSaveMovie={handleSaveMovie}
                  savedMovies={savedMovies}
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/saved" 
            element={
              isLoggedIn ? 
                <Savedmovie 
                  savedMovies={savedMovies}
                  onDeleteMovie={handleDeleteMovie}
                /> : 
                <Navigate to="/login" />
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
