const formatPrice = (price, minimumFractionDigits) => {
  return Intl.NumberFormat("en-US", {
    minimumFractionDigits,
  }).format(price);
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "medium",
    hour12: false,
  }).format(date);
};

const formatPercent = (percent) => {
  return Intl.NumberFormat("en-US", {
    style: "percent",
    signDisplay: "always",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent);
};

const buildSubscribeMessage = (type, product_ids) => {
  return { type, product_ids, channels: ["ticker"] };
};

const flashPriceColorChange = (newPrice, prevPrice, priceElement) => {
  if (newPrice === prevPrice) return;
  priceElement.classList.remove("green", "red");

  // force animation restart (https://css-tricks.com/restart-css-animation/)
  void priceElement.offsetWidth;

  const color = newPrice > prevPrice ? "green" : "red";
  priceElement.classList.add(color);
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export {
  formatPrice,
  formatTime,
  formatPercent,
  buildSubscribeMessage,
  flashPriceColorChange,
  clamp,
};
