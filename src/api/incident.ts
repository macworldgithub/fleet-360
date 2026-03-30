import apiClient from "@/src/api/http";

export interface Incident {
  _id: string;
  vehicleId: string;
  incidentType: "ACCIDENT" | "BREAKDOWN" | "THEFT" | "OTHER" | string;
  incidentDate: string; // ISO date
  location: string;
  description: string;
  damageSeverity: "LOW" | "MEDIUM" | "HIGH" | string;
  estimatedRepairCost?: number;
  insuranceClaimFiled: boolean;
  policeReportNumber?: string;
  status: "REPORTED" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED" | string;
  createdAt: string;
  updatedAt: string;
}

export type IncidentCreatePayload = Omit<
  Incident,
  "_id" | "createdAt" | "updatedAt"
>;

export type IncidentUpdatePayload = Partial<IncidentCreatePayload>;

export const incidentService = {
  getIncidentsByVehicle: async (vehicleId: string): Promise<Incident[]> => {
    const res = await apiClient.get(`/incidents`, {
      params: { vehicleId },
    });
    return res.data;
  },

  // Create new incident
  createIncident: async (payload: IncidentCreatePayload): Promise<Incident> => {
    const res = await apiClient.post(`/incidents`, payload);
    return res.data;
  },

  // Update incident
  updateIncident: async (
    incidentId: string,
    payload: IncidentUpdatePayload,
  ): Promise<Incident> => {
    const res = await apiClient.patch(`/incidents/${incidentId}`, payload);
    return res.data;
  },

  // Delete incident
  deleteIncident: async (incidentId: string): Promise<void> => {
    await apiClient.delete(`/incidents/${incidentId}`);
  },
};
