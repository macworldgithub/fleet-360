import apiClient from "@/src/api/http";

export interface Driver {
  _id: string;
  agencyId: string;
  name: string;
  email: string;
  phoneNumber: string;
  driverLicenseNumber: string;
  assignedVehicle: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await apiClient.get<Driver[]>("/drivers");
  return res.data;
}

// New function for principals to fetch all drivers across agencies
export async function fetchAllDrivers(): Promise<Driver[]> {
  const res = await apiClient.get<Driver[]>("/drivers");
  return res.data;
}

export async function deleteDriver(driverId: string): Promise<void> {
  await apiClient.delete(`/drivers/${driverId}`);
}

export async function assignVehicleToDriver(
  driverId: string,
  vehicleId: string,
): Promise<Driver> {
  const res = await apiClient.post(
    `/drivers/${driverId}/assign-vehicle/${vehicleId}`,
  );
  return res.data;
}

export async function unassignVehicleFromDriver(
  driverId: string,
  vehicleId: string,
): Promise<Driver> {
  const res = await apiClient.post(
    `/drivers/${driverId}/unassign-vehicle/${vehicleId}`,
  );
  return res.data;
}
