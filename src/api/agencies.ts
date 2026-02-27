import { API_BASE_URL } from "@/src/api/config";
import { getAccessToken } from "@/src/api/auth";

export interface Agency {
  _id: string;
  agencyName: string;
  businessType: string;
  abn: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  country: string;
  state: string;
  city: string;
  subscriptionTier: string;
  role?: "PRINCIPAL" | "FLEET_MANAGER";
  isActive: boolean;
  createdAt: string;
}

export async function fetchAgencies(): Promise<Agency[]> {
  const token = getAccessToken();

  const res = await fetch(`${API_BASE_URL}/api/agencies`, {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch agencies");
  }

  return res.json();
}
