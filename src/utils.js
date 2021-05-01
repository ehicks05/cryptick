const getPrettyPrice = (price) => {
  const maximumSignificantDigits = 7;
  const minimumSignificantDigits = 7;
  return Intl.NumberFormat("en-US", {
    minimumSignificantDigits,
    maximumSignificantDigits,
  }).format(price);
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

export { getPrettyPrice, buildSubscribeMessage, flashPriceColorChange };
