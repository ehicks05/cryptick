import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';

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
				<Card className="w-fit mx-auto my-auto">
					<CardHeader>
						<CardTitle>Sorry...</CardTitle>
						<CardDescription>Something went wrong</CardDescription>
					</CardHeader>
					<CardContent className="overflow-auto grid gap-4">
						<div>
							Error: {this.state.error?.message}
							<pre>
								<code className="text-xs whitespace-pre-wrap">
									{this.state.errorInfo?.componentStack?.trim()}
								</code>
							</pre>
						</div>
					</CardContent>
					<CardFooter className="gap-2">
						<Button variant="outline" onClick={() => location.reload()}>
							Reload Page
						</Button>
						<Button
							variant="destructive"
							onClick={() => {
								localStorage.clear();
								location.reload();
							}}
						>
							Clear Local Storage
						</Button>
					</CardFooter>
				</Card>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
