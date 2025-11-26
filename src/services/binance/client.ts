import { type ConfigurationSpot, Spot } from "@binance/spot";

const configuration: ConfigurationSpot = {};

export const client = new Spot(configuration);
