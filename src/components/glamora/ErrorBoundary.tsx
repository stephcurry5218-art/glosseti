import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", padding: 32,
          fontFamily: "'Jost', sans-serif", textAlign: "center",
          background: "#faf9f6",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: "#2c2c2c", marginBottom: 8 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: "#888", marginBottom: 24, maxWidth: 300 }}>
            An unexpected error occurred. Please restart the app.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "12px 32px", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #c49b5a, #d4a853)",
              color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            Restart App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
