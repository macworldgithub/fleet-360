const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
}

export interface AgencyInfo {
  id: string;
  agencyName: string;
  contactEmail: string;
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

  return res.json();
}

/* ──────────────── Token helpers (cookie-based) ──────────────── */

export function setAuthTokens(data: LoginResponse) {
  // Store tokens + agency info in cookies (accessible by middleware)
  document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900; SameSite=Lax`;
  document.cookie = `refreshToken=${data.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `agency=${encodeURIComponent(JSON.stringify(data.agency))}; path=/; max-age=604800; SameSite=Lax`;
}

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? match[1] : null;
}

export function getAgencyInfo(): AgencyInfo | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)agency=([^;]*)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function clearAuthTokens() {
  document.cookie = "accessToken=; path=/; max-age=0";
  document.cookie = "refreshToken=; path=/; max-age=0";
  document.cookie = "agency=; path=/; max-age=0";
}
