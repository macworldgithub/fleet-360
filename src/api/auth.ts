export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface RegisterAgencyPayload {
  agencyName: string;
  contactEmail: string;
  contactPhone: string;
  password: string;
  abn: string;
  address: string;
  country: string;
  state: string;
  city: string;
  role: "PRINCIPAL" | "FLEET_MANAGER";
}

export interface RegisterAgencyResponse {
  message: string;
  agencyId: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export async function registerAgency(
  payload: RegisterAgencyPayload,
): Promise<RegisterAgencyResponse> {
  const res = await fetch(`${API_BASE_URL}/api/agency-auth/register`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      message: "Registration failed. Please try again.",
    }));
    throw errorData;
  }

  return res.json();
}

/* ─────────────────────────── LOGIN ─────────────────────────── */

export interface LoginPayload {
  contactEmail: string;
  password: string;
  role: "PRINCIPAL" | "FLEET_MANAGER";
}

export interface AgencyInfo {
  id: string;
  agencyName: string;
  contactEmail: string;
  role: "PRINCIPAL" | "FLEET_MANAGER";
  subscriptionTier: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  agency: AgencyInfo;
}

export async function loginAgency(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/api/agency-auth/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json().catch(() => ({
      message: "Invalid email or password.",
    }));
    throw errorData;
  }

  const data: LoginResponse = await res.json();
  
  // Validate that login role matches the agency's registered role
  if (data.agency.role !== payload.role) {
    throw {
      message: `Invalid role. This agency is registered as ${data.agency.role}. You cannot login as ${payload.role}.`,
    } as ApiError;
  }

  return data;
}

/* ──────────────── Token helpers (localStorage-based) ──────────────── */

import React from "react";

export function setAuthTokens(data: LoginResponse) {
  // Store tokens + agency info in localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("agency", JSON.stringify(data.agency));
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("auth:updated"));
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return localStorage.getItem("accessToken");
}

export function getAgencyInfo(): AgencyInfo | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const agencyStr = localStorage.getItem("agency");
  if (!agencyStr) return null;
  try {
    return JSON.parse(agencyStr);
  } catch {
    return null;
  }
}

export function clearAuthTokens() {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("agency");
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("auth:updated"));
  }
}

/* ──────────────── useAuth React Hook ──────────────── */

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [agency, setAgency] = React.useState<AgencyInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check initial auth state
    const checkAuth = () => {
      const token = getAccessToken();
      const agencyInfo = getAgencyInfo();
      setIsAuthenticated(!!token && !!agencyInfo);
      setAgency(agencyInfo);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthUpdate = () => {
      checkAuth();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("auth:updated", handleAuthUpdate);
      window.addEventListener("storage", handleAuthUpdate);

      return () => {
        window.removeEventListener("auth:updated", handleAuthUpdate);
        window.removeEventListener("storage", handleAuthUpdate);
      };
    }
  }, []);

  const logout = () => {
    clearAuthTokens();
    setIsAuthenticated(false);
    setAgency(null);
  };

  return {
    isAuthenticated,
    agency,
    isLoading,
    logout,
  };
}
