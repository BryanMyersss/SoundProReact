import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

export const fetchShopConfigAPI = async () => {
  const response = await axios.get(`${apiUrl}/config/public`, { withCredentials: true });
  return response.data;
}