import { client } from "./client";

const response = await client.restAPI.exchangeInfo();

console.log(response);
