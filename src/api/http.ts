import axios from "axios";
import { API_BASE_URL } from "@/src/api/config";
import { getAccessToken } from "@/src/api/auth";

// Base URL that already includes the /api prefix
export const API_BASE_API_URL = `${API_BASE_URL}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_API_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Attach access token to every request if available
apiClient.interceptors.request.use((config: any) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
