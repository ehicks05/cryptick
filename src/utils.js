const getPrettyPrice = (price) => {
  const maximumSignificantDigits = 7;
  const minimumSignificantDigits = 7;
  return Intl.NumberFormat("en-US", {
    minimumSignificantDigits,
    maximumSignificantDigits,
  }).format(price);
};

export { getPrettyPrice };
