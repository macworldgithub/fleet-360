"use client";

import React, { useEffect, useState } from "react";

import {
  User,
  Phone,
  Car,
  Mail,
  Calendar,
  Trash2,
  AlertTriangle,
  MapPin,
  X,
  Building,
} from "lucide-react";

import { DataTable } from "@/src/components/dashboard/DataTable";

import {
  fetchDrivers,
  fetchAllDrivers,
  deleteDriver,
  assignVehicleToDriver,
  unassignVehicleFromDriver,
  type Driver,
} from "@/src/api/drivers";

import { officeService, type Office } from "@/src/api/office";

import { vehicleService, type Vehicle } from "@/src/api/vehicle";

import { fetchAgencies } from "@/src/api/agencies";

import type { ColumnsType } from "antd/es/table";

import toast from "react-hot-toast";

const PrincipalDriversTab: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // Assignment states
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");

  const [offices, setOffices] = useState<Office[]>([]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedOfficeId, setSelectedOfficeId] = useState("");

  const [selectedVehicleId, setSelectedVehicleId] = useState("");

  const [officesLoading, setOfficesLoading] = useState(false);

  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  const [assignLoading, setAssignLoading] = useState(false);

  // Unassign states
  const [unassignModalOpen, setUnassignModalOpen] = useState(false);
  const [driverToUnassign, setDriverToUnassign] = useState<Driver | null>(null);
  const [unassignLoading, setUnassignLoading] = useState(false);

  // Load all drivers and agencies on mount
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAllDrivers(); // Use fetchAllDrivers for principals
        setDrivers(data);
      } catch (err) {
        console.error("Failed to load drivers", err);
        setError("Unable to load drivers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const loadAgencies = async () => {
      try {
        const data = await fetchAgencies();
        setAgencies(data);
        if (data.length > 0) setSelectedAgencyId(data[0]._id);
      } catch (err) {
        console.error("Failed to load agencies", err);
        toast.error("Failed to load agencies");
      }
    };

    loadDrivers();
    loadAgencies();
  }, []);

  // Load offices when agency changes
  useEffect(() => {
    const loadOffices = async () => {
      if (!selectedAgencyId) {
        setOffices([]);
        return;
      }

      try {
        setOfficesLoading(true);
        const data = await officeService.getOfficesByAgency(selectedAgencyId);
        setOffices(data);
      } catch (err) {
        console.error("Failed to load offices", err);
        toast.error("Failed to load offices");
      } finally {
        setOfficesLoading(false);
      }
    };

    loadOffices();
  }, [selectedAgencyId]);

  // Load vehicles when office changes
  useEffect(() => {
    const loadVehicles = async () => {
      if (!selectedOfficeId) {
        setVehicles([]);
        return;
      }

      try {
        setVehiclesLoading(true);
        const data = await vehicleService.getVehiclesByOffice(selectedOfficeId);
        setVehicles(data);
      } catch (err) {
        console.error("Failed to load vehicles", err);
        toast.error("Failed to load vehicles");
      } finally {
        setVehiclesLoading(false);
      }
    };

    loadVehicles();
  }, [selectedOfficeId]);

  const handleDeleteDriver = async () => {
    if (!driverToDelete) return;

    try {
      setDeleteLoading(true);

      await deleteDriver(driverToDelete._id);

      setDrivers((prev) =>
        prev.filter((driver) => driver._id !== driverToDelete._id),
      );

      setDeleteModalOpen(false);
      setDriverToDelete(null);

      toast.success("Driver deleted successfully!");
    } catch (err) {
      console.error("Failed to delete driver", err);
      toast.error("Failed to delete driver. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteModal = (driver: Driver) => {
    setDriverToDelete(driver);
    setDeleteModalOpen(true);
  };

  const openAssignModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setSelectedAgencyId("");
    setSelectedOfficeId("");
    setSelectedVehicleId("");
    setVehicles([]);
    setAssignModalOpen(true);
    
    // Load agencies for assignment
    fetchAgencies().then(data => {
      setAgencies(data);
      if (data.length > 0) setSelectedAgencyId(data[0]._id);
    }).catch(err => {
      console.error("Failed to load agencies", err);
      toast.error("Failed to load agencies");
    });
  };

  const openUnassignModal = (driver: Driver) => {
    setDriverToUnassign(driver);
    setUnassignModalOpen(true);
  };

  const handleAssignVehicle = async () => {
    if (!selectedDriver || !selectedVehicleId) return;

    try {
      setAssignLoading(true);

      const updatedDriver = await assignVehicleToDriver(
        selectedDriver._id,
        selectedVehicleId,
      );

      // Update drivers list with assigned vehicle
      setDrivers((prev) =>
        prev.map((driver) =>
          driver._id === updatedDriver._id ? updatedDriver : driver,
        ),
      );

      setAssignModalOpen(false);
      setSelectedDriver(null);
      setSelectedAgencyId("");
      setSelectedOfficeId("");
      setSelectedVehicleId("");
      setVehicles([]);

      toast.success("Vehicle assigned successfully!");
    } catch (err) {
      console.error("Failed to assign vehicle", err);
      toast.error("Failed to assign vehicle. Please try again.");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnassignVehicle = async () => {
    if (!driverToUnassign || !driverToUnassign.assignedVehicle) return;

    try {
      setUnassignLoading(true);

      // Extract vehicle ID from assignedVehicle (it could be string or object)
      const vehicleId = typeof driverToUnassign.assignedVehicle === 'string' 
        ? driverToUnassign.assignedVehicle 
        : (driverToUnassign.assignedVehicle as any)._id;

      const updatedDriver = await unassignVehicleFromDriver(
        driverToUnassign._id,
        vehicleId,
      );

      // Update drivers list with unassigned vehicle
      setDrivers((prev) =>
        prev.map((driver) =>
          driver._id === updatedDriver._id ? updatedDriver : driver,
        ),
      );

      setUnassignModalOpen(false);
      setDriverToUnassign(null);

      toast.success("Vehicle unassigned successfully!");
    } catch (err) {
      console.error("Failed to unassign vehicle", err);
      toast.error("Failed to unassign vehicle. Please try again.");
    } finally {
      setUnassignLoading(false);
    }
  };

  const columns: ColumnsType<Driver> = [
    {
      title: "Driver Information",
      key: "driverInfo",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <User className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },

    {
      title: "Agency",
      key: "agency",
      render: (_, record) => {
        const agency = agencies.find(a => a._id === record.agencyId);
        return (
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <Building className="w-4 h-4 text-gray-400" />
            <span>{agency?.agencyName || 'Unknown Agency'}</span>
          </div>
        );
      },
    },

    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{record.phoneNumber}</span>
        </div>
      ),
    },

    {
      title: "License Number",
      dataIndex: "driverLicenseNumber",
      key: "driverLicenseNumber",
      render: (license: string) => (
        <span className="text-sm font-mono text-gray-700">{license}</span>
      ),
    },

    {
      title: "Assigned Vehicle",
      key: "assignedVehicle",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-gray-400" />
          {record.assignedVehicle ? (
            <span className="text-sm text-gray-700">
              {(record.assignedVehicle as any).make &&
              (record.assignedVehicle as any).model
                ? `${(record.assignedVehicle as any).make} ${(record.assignedVehicle as any).model} - ${(record.assignedVehicle as any).registrationNumber}`
                : typeof record.assignedVehicle === "string"
                  ? record.assignedVehicle
                  : "Assigned Vehicle"}
            </span>
          ) : (
            <span className="text-sm text-gray-400 italic">Not assigned</span>
          )}
        </div>
      ),
    },

    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {record.assignedVehicle ? (
            <button
              onClick={() => openUnassignModal(record)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Unassign</span>
            </button>
          ) : (
            <button
              onClick={() => openAssignModal(record)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
            >
              <Car className="w-4 h-4" />
              <span>Assign</span>
            </button>
          )}

          <button
            onClick={() => openDeleteModal(record)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      driver.driverLicenseNumber
        .toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      driver.phoneNumber.includes(searchValue),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Drivers</h2>
          <p className="text-gray-600 mt-1">
            View and manage all drivers across all agencies.
          </p>
        </div>
      </div>

      {/* Drivers Table */}
      <DataTable<Driver>
        title="All Drivers"
        description="List of all drivers registered in the system across all agencies."
        dataSource={filteredDrivers}
        columns={columns}
        loading={loading}
        emptyText={error || "No drivers found"}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && driverToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Driver
              </h3>
            </div>

            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{driverToDelete.name}</span>?
              </p>

              <p className="text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDriverToDelete(null);
                }}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleDeleteDriver}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Vehicle Modal */}
      {assignModalOpen && selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <Car className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Assign Vehicle to {selectedDriver.name}
              </h3>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Agency
                </label>

                <select
                  value={selectedAgencyId}
                  onChange={(e) => setSelectedAgencyId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                  disabled={officesLoading}
                >
                  <option value="">Select an agency</option>

                  {agencies.map((agency) => (
                    <option key={agency._id} value={agency._id}>
                      {agency.agencyName}
                    </option>
                  ))}
                </select>

                {officesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading agencies...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Office
                </label>

                <select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                  disabled={officesLoading}
                >
                  <option value="">Select an office</option>

                  {offices.map((office) => (
                    <option key={office._id} value={office._id}>
                      {office.officeName}
                    </option>
                  ))}
                </select>

                {officesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading offices...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Vehicle
                </label>

                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                  disabled={!selectedOfficeId || vehiclesLoading}
                >
                  <option value="">
                    {selectedOfficeId
                      ? "Select a vehicle"
                      : "Select an office first"}
                  </option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.make} {vehicle.model} -{" "}
                      {vehicle.registrationNumber}
                    </option>
                  ))}
                </select>

                {vehiclesLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Loading vehicles...
                  </p>
                )}
              </div>

              {selectedDriver.assignedVehicle && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  Currently assigned: {selectedDriver.assignedVehicle}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedDriver(null);
                  setSelectedAgencyId("");
                  setSelectedOfficeId("");
                  setSelectedVehicleId("");
                  setVehicles([]);
                }}
                disabled={assignLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold rounded-md bg-[#C46A0A] text-white hover:bg-[#a85908] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleAssignVehicle}
                disabled={!selectedVehicleId || assignLoading}
              >
                {assignLoading ? "Assigning..." : "Assign Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unassign Vehicle Modal */}
      {unassignModalOpen && driverToUnassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <X className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Unassign Vehicle
              </h3>
            </div>

            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">
                Are you sure you want to unassign the vehicle from{" "}
                <span className="font-semibold">{driverToUnassign.name}</span>?
              </p>

              <p className="text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                onClick={() => {
                  setUnassignModalOpen(false);
                  setDriverToUnassign(null);
                }}
                disabled={unassignLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleUnassignVehicle}
                disabled={unassignLoading}
              >
                {unassignLoading ? "Unassigning..." : "Unassign Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrincipalDriversTab;
