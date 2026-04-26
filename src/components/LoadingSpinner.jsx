function LoadingSpinner() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true"></span>
      <p>Loading weather data...</p>
    </div>
  );
}

export default LoadingSpinner;
