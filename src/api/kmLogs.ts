import apiClient from "@/src/api/http";

export interface KMLog {
  _id: string;
  vehicleId?: string;
  agencyId?: string;
  officeId?: string;
  tripDate?: string;
  startOdometerInKms?: number;
  endOdometerInKms?: number;
  tripType?: string;
  notes?: string;
  businessPurpose?: string;
  startOdometerPhotoUrl?: string;
  endOdometerPhotoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KMLogQueryParams {
  vehicleId?: string;
  officeId?: string;
  tripType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface KMLogUpdatePayload {
  vehicleId?: string;
  agencyId?: string;
  officeId?: string;
  tripDate?: string;
  startOdometerInKms?: number;
  endOdometerInKms?: number;
  tripType?: string;
  notes?: string;
  businessPurpose?: string;
  startOdometerPhoto?: File | null;
  endOdometerPhoto?: File | null;
}

export const kmLogsService = {
  getKMLogs: async (params: KMLogQueryParams): Promise<KMLog[]> => {
    // Some parameters might be empty strings, filter them out to avoid sending empty query params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null && v !== "")
    );
    const res = await apiClient.get<KMLog[]>("/km-logs", { params: filteredParams });
    return res.data;
  },

  updateKMLog: async (logId: string, data: KMLogUpdatePayload): Promise<KMLog> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    const res = await apiClient.patch<KMLog>(`/km-logs/${logId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  deleteKMLog: async (logId: string): Promise<void> => {
    await apiClient.delete(`/km-logs/${logId}`);
  },
};
