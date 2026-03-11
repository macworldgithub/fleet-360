// import apiClient from "@/src/api/http";

// export interface FuelTracking {
//   _id: string;
//   agencyId: string;
//   vehicleId: string;
//   fuelCardNumber: string;
//   fuelDate: string;
//   liters: number;
//   pricePerLiter: number;
//   totalCost: number;
//   stationName: string;
//   odometer: number;
//   driverName: string;
//   provider: string;
//   transactionReference: string | null;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export async function fetchFuelTracking(
//   vehicleId: string,
//   agencyId: string,
// ): Promise<FuelTracking[]> {
//   const res = await apiClient.get<FuelTracking[]>(
//     // `/agencies/${agencyId}/vehicles/${vehicleId}/fueltracking`,
//     // `/fueltracking?vehicleId=${vehicleId}&agencyId=${agencyId}`,
//     "/fuel-transactions",
//   );
//   return res.data;
// }

// import apiClient from "@/src/api/http";

// export interface FuelTracking {
//   _id: string;
//   agencyId: string;
//   vehicleId: string;
//   fuelCardNumber: string;
//   fuelDate: string;
//   liters: number;
//   pricePerLiter: number;
//   totalCost: number;
//   stationName: string;
//   odometer: number;
//   driverName: string;
//   provider: string;
//   transactionReference: string | null;
//   isDeleted: boolean;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export async function fetchFuelTracking(
//   vehicleId: string,
//   agencyId: string
// ): Promise<FuelTracking[]> {
//   const res = await apiClient.get<FuelTracking[]>("/fuel-transactions", {
//     params: {
//       vehicleId,
//       agencyId,
//     },
//   });

//   return res.data;
// }

import apiClient from "@/src/api/http";

export interface FuelTracking {
  _id: string;
  agencyId: string;
  vehicleId: string;
  fuelCardNumber: string;
  fuelDate: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  stationName: string;
  odometer: number;
  driverName: string;
  provider: string;
  transactionReference: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function fetchFuelTracking(): Promise<FuelTracking[]> {
  const res = await apiClient.get<FuelTracking[]>("/fuel-transactions", {
    params: {
      agencyId: "69a7d4f33e49bcaca457c86e",
      vehicleId: "699557978f1313b30f29cf9f",
    },
  });

  return res.data;
}
