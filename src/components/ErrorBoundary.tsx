import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ClearQueryCacheButton } from './ClearQueryCacheButton';

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
				<div className="flex flex-col gap-2 p-2">
					<h1 className='text-2xl'>Sorry.. there was an error</h1>
					<p>Possible Fixes:</p>
					<ol className="list-inside list-decimal">
						<li>Refresh the page</li>
						<li>Clear local storage</li>
					</ol>
					<ClearQueryCacheButton />

					<div className='h-24'/>
					Error Details:
					<code className="text-xs whitespace-pre-wrap">
						{this.state.errorInfo?.componentStack?.trim()}
					</code>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
