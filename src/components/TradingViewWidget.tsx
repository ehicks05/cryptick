// adapted from https://www.tradingview.com/widget/advanced-chart/
import React, { useEffect, useRef } from 'react';

const container_id = 'tradingview_84dfe';
let tvScriptLoadingPromise: Promise<any>;

interface Props {
	symbol: string;
	theme: 'dark' | 'light';
}

export default function TradingViewWidget({ symbol, theme }: Props) {
	const onLoadScriptRef = useRef<(() => void) | null>();

	useEffect(() => {
		onLoadScriptRef.current = createWidget;

		if (!tvScriptLoadingPromise) {
			tvScriptLoadingPromise = new Promise((resolve) => {
				const script = document.createElement('script');
				script.id = 'tradingview-widget-loading-script';
				script.src = 'https://s3.tradingview.com/tv.js';
				script.type = 'text/javascript';
				script.onload = resolve;

				document.head.appendChild(script);
			});
		}

		tvScriptLoadingPromise.then(() => onLoadScriptRef.current?.());

		return () => {
			onLoadScriptRef.current = null;
			return undefined;
		};

		function createWidget() {
			if (document.getElementById(container_id) && 'TradingView' in window) {
				new (window.TradingView as any).widget({
					autosize: true,
					symbol,
					interval: 'D',
					timezone: 'Etc/UTC',
					theme,
					style: '1',
					locale: 'en',
					toolbar_bg: '#f1f3f6',
					enable_publishing: false,
					allow_symbol_change: true,
					container_id,
				});
			}
		}
	}, []);

	return <div className="w-full h-full" id={container_id} />;
}
