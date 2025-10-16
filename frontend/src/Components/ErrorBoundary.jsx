import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Movie card error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="movie-card error-card">
          <div className="movie-poster-container">
            <div style={{ 
              padding: '2rem', 
              textAlign: 'center', 
              color: '#666',
              fontSize: '0.9rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
              <div>Error loading movie</div>
            </div>
          </div>
          <div style={{ padding: '1rem' }}>
            <h3>Movie Error</h3>
            <p>Unable to display this movie</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;