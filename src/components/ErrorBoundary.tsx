import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
	children?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
	errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
		this.setState((state) => ({ ...state, errorInfo }));
	}

	public render() {
		if (this.state.hasError) {
			return (
				<>
					<h1>Sorry.. there was an error</h1>
					<code className="text-sm whitespace-pre-wrap">
						{this.state.errorInfo?.componentStack}
					</code>
				</>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
