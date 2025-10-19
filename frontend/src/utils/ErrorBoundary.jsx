import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle catches errors in child components
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // You can also log to an external service here
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-red-600 text-2xl">
            Something went wrong.
          </h1>
        </div>
      );
    }

    return this.props.children; // render children if no error
  }
}

export default ErrorBoundary;


