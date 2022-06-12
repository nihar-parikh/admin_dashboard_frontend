import axios from "axios";

const BASE_URL = "http://localhost:8000/api/";

const TOKEN = localStorage.getItem("token");
const publicRequest = axios.create({
  baseURL: BASE_URL,
});

const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: TOKEN },
});

export { publicRequest, userRequest };
