import axios from "axios";
import { BACKEND_URL } from "astro:env/client";

const backendUrl = BACKEND_URL;

export const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
