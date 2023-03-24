import _ from "lodash";
import { REST_URL } from "../constants";
import { Currency } from "api/currency/types";

const URL = `${REST_URL}/currencies`;

const getCurrencies = async () => {
  const data: Currency[] = await (await fetch(URL)).json();
  return _.chain(data).sortBy(["sort_order"]).keyBy("id").value();
};

export { getCurrencies };
