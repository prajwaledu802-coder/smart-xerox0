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
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 text-center bg-red-50 text-red-600 rounded-xl m-10 border border-red-200">
                    <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
                    <p className="font-mono text-sm">{this.state.error?.toString()}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-bold">
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
