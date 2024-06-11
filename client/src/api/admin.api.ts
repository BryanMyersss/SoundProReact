import axios from 'axios';

export const postCreateProduct = async (formData: FormData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/products`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
  );

  return response
}