import apiClient from "@/src/api/http";

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
  const res = await apiClient.get<Agency[]>("/agencies");
  return res.data;
}

export interface CreateAgencyPayload {
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
  role: "PRINCIPAL" | "FLEET_MANAGER";
  password: string;
}

export async function createAgency(
  payload: CreateAgencyPayload,
): Promise<Agency> {
  const res = await apiClient.post<Agency>("/agencies", payload);
  return res.data;
}

export type UpdateAgencyPayload = CreateAgencyPayload;

export async function updateAgency(
  agencyId: string,
  payload: UpdateAgencyPayload,
): Promise<Agency> {
  const res = await apiClient.patch<Agency>(`/agencies/${agencyId}`, payload);
  return res.data;
}

export async function deleteAgency(agencyId: string): Promise<void> {
  await apiClient.delete(`/agencies/${agencyId}`);
}
