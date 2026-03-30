import axios from "axios";
import { API_BASE_URL } from "@/src/api/config";
import { getAccessToken } from "@/src/api/auth";

// Create a separate instance for dashboard stats that doesn't use the /api prefix
const statsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Add auth interceptor to statsClient as well
statsClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface DashStats {
  summary: StatsData;
  agencyStats: AgencyStats[];
}

export interface StatsData {
  vehicles: {
    total: number;
    active: number;
    assigned: number;
    underAgreement: number;
    inMaintenance: number;
    deactivated: number;
  };
  fuelDistribution: {
    petrol: number;
    diesel: number;
    hybrid: number;
    ev: number;
  };
  leaseDistribution: {
    owned: number;
    loan: number;
  };
  maintenance: {
    submitted: number;
    approved: number;
    rejected: number;
    completed: number;
  };
  logbookSessions: {
    draft: number;
    locked: number;
  };
  drivers: {
    total: number;
  };
}

export interface AgencyStats {
  agencyId: string;
  agencyName: string;
  stats: StatsData;
}

export const statsService = {
  getDashboardStats: async (): Promise<DashStats> => {
    const res = await statsClient.get<DashStats>("/dashboard/stats");
    return res.data;
  },
};
