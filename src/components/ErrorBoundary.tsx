import { useQueryClient } from '@tanstack/react-query';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';

const Foo = () => {
	const { clear } = useQueryClient();

	return (
		<div>
			<Button type="button" onClick={clear}>
				Clear Query Cache
			</Button>
		</div>
	);
};

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
					<h1>Sorry.. there was an error</h1>

					<code className="text-xs whitespace-pre-wrap">
						{this.state.errorInfo?.componentStack?.trim()}
					</code>
					<Foo />
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
