import axios from "axios";

console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL);

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});

console.log("Axios Base URL:", api.defaults.baseURL);

export default api;