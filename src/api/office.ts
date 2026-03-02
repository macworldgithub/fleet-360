import apiClient from "@/src/api/http";
export interface Office {
  _id: string;
  officeName: string;
  officeType: string;
  officeHours?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

export interface AgencyOption {
  _id: string;
  agencyName: string;
}

export interface OfficePayload {
  officeName: string;
  officeType: string;
  officeHours: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export const officeService = {
  getOfficesByAgency: async (agencyId: string): Promise<Office[]> => {
    const res = await apiClient.get(`/agencies/${agencyId}/offices`);
    return res.data;
  },

  getOfficeById: async (officeId: string): Promise<Office> => {
    const res = await apiClient.get(`/offices/${officeId}`);
    return res.data;
  },

  createOffice: async (
    agencyId: string,
    data: OfficePayload,
  ): Promise<Office> => {
    const res = await apiClient.post(`/agencies/${agencyId}/offices`, data);
    return res.data;
  },

  updateOffice: async (
    officeId: string,
    data: OfficePayload,
  ): Promise<Office> => {
    const res = await apiClient.patch(`/offices/${officeId}`, data);
    return res.data;
  },

  deleteOffice: async (officeId: string): Promise<void> => {
    await apiClient.delete(`/offices/${officeId}`);
  },
};
