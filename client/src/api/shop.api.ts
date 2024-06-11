import axios from "axios";

export async function fetchShopAPI() {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/shop`);
  return response.data;
}