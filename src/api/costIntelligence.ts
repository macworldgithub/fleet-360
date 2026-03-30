import apiClient from "./http";

export interface CostSummary {
  vehicleId: string;
  purchaseCost: number;
  fuelCost: number;
  maintenanceCost: number;
  incidentCost: number;
  totalRunningCost: number;
  totalCost: number;
  totalDistance: number;
  costPerKm: number;
}

export const fetchVehicleCostSummary = async (vehicleId: string): Promise<CostSummary> => {
  const response = await apiClient.get(`/cost-intelligence/vehicles/${vehicleId}/cost-summary`);
  return response.data;
};

export interface CostBreakdown {
  purchaseCost: number;
  fuelCost: number;
  maintenanceCost: number;
  incidentRepairCost: number;
  totalCost: number;
}

export const fetchVehicleCostBreakdown = async (vehicleId: string): Promise<CostBreakdown> => {
  const response = await apiClient.get(`/cost-intelligence/vehicles/${vehicleId}/cost-breakdown`);
  return response.data;
};
