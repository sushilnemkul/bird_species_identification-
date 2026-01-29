import React from 'react';
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, you'd send this to an error reporting service)
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-light flex items-center justify-center p-8">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-6 text-red-500">
                            <FaExclamationTriangle />
                        </div>
                        <h1 className="text-3xl font-bold text-dark mb-4">Oops! Something went wrong</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            We're sorry, but something unexpected happened. This error has been logged and we'll look into it.
                        </p>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <p className="text-sm font-mono text-red-800 break-all">
                                    <strong>Error:</strong> {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-red-700 font-semibold">
                                            Stack Trace
                                        </summary>
                                        <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-md"
                            >
                                <FaRedo /> Try Again
                            </button>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-secondary hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:-translate-y-0.5 shadow-md"
                            >
                                <FaHome /> Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
