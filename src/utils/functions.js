import { CURRENCY } from './constants';

export const getFormattedPrice = (price = 0, precision = 2) =>
  `${CURRENCY} ${price.toFixed(precision)}`;

export const getQueryStringValue = (url, search) => {
  const params = new URLSearchParams(url);
  return params.get(search);
};

export const getFormattedToppings = (toppings) => {
  return toppings.map((topping) => topping.split('_').join(' '));
};