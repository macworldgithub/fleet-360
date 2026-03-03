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
} from "lucide-react";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { fetchDrivers, deleteDriver, type Driver } from "@/src/api/drivers";
import type { ColumnsType } from "antd/es/table";
import toast from "react-hot-toast";

const DriversTab: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (err) {
        console.error("Failed to load drivers", err);
        setError("Unable to load drivers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDrivers();
  }, []);

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
              {record.assignedVehicle}
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
        <button
          onClick={() => openDeleteModal(record)}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
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
          <h2 className="text-2xl font-bold text-gray-900">Drivers</h2>
          <p className="text-gray-600 mt-1">
            View your fleet drivers and their assignment details.
          </p>
        </div>
      </div>

      {/* Drivers Table */}
      <DataTable<Driver>
        title="All Drivers"
        description="List of all drivers registered in system."
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
    </div>
  );
};

export default DriversTab;
