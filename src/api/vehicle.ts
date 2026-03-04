// src/api/vehicle.ts
import apiClient from "@/src/api/http";

export interface Vehicle {
  _id: string;
  agencyId: string;
  officeId: string;
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  odometerInKms: number;
  vehicleStatus: "ACTIVATE" | "DEACTIVATE" | "MAINTENANCE" | string;
  purchaseDate: string; // ISO date
  purchaseCost: number;
  leaseType: "OWNED" | "LEASED" | string;
  residualValue?: number;
  loanProvider?: string;
  loanAmount?: number;
  interestRate?: number;
  loanTermMonths?: number;
  monthlyLoanRepayment?: number;
  balloonPayment?: number;
  loanStartDate?: string;
  loanEndDate?: string;
  lenderReferenceNumber?: string;
  loanType?: string;
  insuranceRequired: boolean;
  fbtValue?: number;
  depreciationRate?: number;
  requestedBy: string;
  createdBy: string;
  requestedAt: string;
  currentDriverId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type VehicleCreatePayload = Omit<
  Vehicle,
  | "_id"
  | "agencyId"
  | "requestedBy"
  | "createdBy"
  | "requestedAt"
  | "createdAt"
  | "updatedAt"
  | "currentDriverId"
>;

export type VehicleUpdatePayload = Partial<VehicleCreatePayload>;


export type VehiclePayload = VehicleCreatePayload;

export const vehicleService = {
  // Get vehicles by officeId
  getVehiclesByOffice: async (officeId: string): Promise<Vehicle[]> => {
    const res = await apiClient.get(`/vehicles`, {
      params: { officeId },
    });
    return res.data;
  },

 
  createVehicle: async (payload: VehicleCreatePayload): Promise<Vehicle> => {
    const res = await apiClient.post(`/vehicles`, payload);
    return res.data;
  },

  // Update vehicle
  updateVehicle: async (
    vehicleId: string,
    payload: VehicleUpdatePayload,
  ): Promise<Vehicle> => {
    const res = await apiClient.patch(`/vehicles/${vehicleId}`, payload);
    return res.data;
  },


  toggleStatus: async (vehicleId: string): Promise<Vehicle> => {
    const res = await apiClient.patch(
      `/vehicles/${vehicleId}/toggle-status`,
      {},
    );
    return res.data;
  },

 
  deleteVehicle: async (vehicleId: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${vehicleId}`);
  },
};
