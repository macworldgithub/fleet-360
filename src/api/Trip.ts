import apiClient from "@/src/api/http";

export interface KmLog {
  _id: string;
  vehicleId: string;
  agencyId: string;
  officeId: string;
  tripDate: string;
  startOdometerInKms: number;
  endOdometerInKms: number;
  distanceInKms: number;
  tripType: "BUSINESS" | "PRIVATE" | "COMMUTE";
  notes?: string;
  businessPurpose?: string;
  logbookSessionId?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface KmLogFilters {
  vehicleId?: string;
  officeId?: string;
  tripType?: "BUSINESS" | "PRIVATE" | "COMMUTE";
  fromDate?: string;
  toDate?: string;
}

export interface KmLogPayload {
  vehicleId: string;
  agencyId?: string;
  officeId: string;
  tripDate: string;
  startOdometerInKms: number;
  endOdometerInKms: number;
  tripType: "BUSINESS" | "PRIVATE" | "COMMUTE";
  notes?: string;
  businessPurpose?: string;
}

export const tripService = {
  getKmLogs: async (filters?: KmLogFilters): Promise<KmLog[]> => {
    const params = new URLSearchParams();
    if (filters?.vehicleId) params.append("vehicleId", filters.vehicleId);
    if (filters?.officeId) params.append("officeId", filters.officeId);
    if (filters?.tripType) params.append("tripType", filters.tripType);
    if (filters?.fromDate) params.append("fromDate", filters.fromDate);
    if (filters?.toDate) params.append("toDate", filters.toDate);

    const res = await apiClient.get(`/km-logs?${params.toString()}`);
    return res.data;
  },

  getKmLogById: async (id: string): Promise<KmLog> => {
    const res = await apiClient.get(`/km-logs/${id}`);
    return res.data;
  },

  updateKmLog: async (id: string, data: KmLogPayload): Promise<KmLog> => {
    const res = await apiClient.patch(`/km-logs/${id}`, data);
    return res.data;
  },

  deleteKmLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/km-logs/${id}`);
  },
};
