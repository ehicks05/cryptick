const priceFormats = [...Array(10)].map((_i, i) => new Intl.NumberFormat("en-US", { minimumFractionDigits: i }));
const defaultPriceFormat = new Intl.NumberFormat("en-US");

const formatPrice = (price, minimumFractionDigits) => {
  return (priceFormats[minimumFractionDigits] || defaultPriceFormat).format(price);
};

const defaultTimeFormat = new Intl.DateTimeFormat("en-US", {
  timeStyle: "medium",
  hour12: false,
});

const formatTime = (date) => {
  return defaultTimeFormat.format(date);
};

const defaultPercentFormat = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "always",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPercent = (percent) => {
  return defaultPercentFormat.format(percent);
};

const buildSubscribeMessage = (type, product_ids) => {
  return { type, product_ids, channels: ["ticker"] };
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getPercentChange = (from, to) => {
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
