const priceFormats = [...Array(10)].map(
  (_i, i) => new Intl.NumberFormat("en-US", { minimumFractionDigits: i })
);
const defaultPriceFormat = new Intl.NumberFormat("en-US");

const formatPrice = (price: number, minimumFractionDigits: number) => {
  return (priceFormats[minimumFractionDigits] || defaultPriceFormat).format(
    price
  );
};

const defaultTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeStyle: "medium",
  hour12: false,
});

const formatTime = (date: Date) => {
  return defaultTimeFormat.format(date);
};

const defaultPercentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "always",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPercent = (percent: number) => {
  return defaultPercentFormat.format(percent);
};

const buildSubscribeMessage = (type: string, product_ids: string[]) => {
  return { type, product_ids, channels: ["ticker"] };
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getPercentChange = (from: number, to: number) => {
  const delta = to - from;
  return delta / from;
};

export {
  formatPrice,
  formatTime,
  formatPercent,
  buildSubscribeMessage,
  clamp,
  getPercentChange,
};
