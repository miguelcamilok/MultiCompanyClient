import axios from "axios";

const api = axios.create({
  baseURL: "http://api.multiempresa/api", // tu endpoint Laravel
  // withCredentials: true, // si usas Sanctum o cookies
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;