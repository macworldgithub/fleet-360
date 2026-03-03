"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import { officeService, Office } from "@/src/api/office";
import { vehicleService, Vehicle, VehiclePayload } from "@/src/api/vehicle";
import { Button, Tag, Space, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Building } from "lucide-react";

export default function VehiclesTab() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<VehiclePayload>>({});

  // Load offices (assuming you have current agencyId from auth/context)
  useEffect(() => {
    const loadOffices = async () => {
      try {
        // Replace with your actual agency ID source (context, localStorage, etc.)
        const agencyId = "69942fa3c94c1a92c87d5e53"; // ← temporary – get from auth
        const data = await officeService.getOfficesByAgency(agencyId);
        setOffices(data);
        if (data.length > 0) {
          setSelectedOfficeId(data[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load offices");
      }
    };
    loadOffices();
  }, []);

  // Load vehicles when office changes
  useEffect(() => {
    if (!selectedOfficeId) {
      setVehicles([]);
      return;
    }

    const loadVehicles = async () => {
      setLoading(true);
      try {
        const data = await vehicleService.getVehiclesByOffice(selectedOfficeId);
        setVehicles(data);
      } catch (err) {
        toast.error("Failed to load vehicles for this office");
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, [selectedOfficeId]);

  const resetForm = () => {
    setFormData({});
    setEditingVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOfficeId) {
      toast.warn("Please select an office first");
      return;
    }

    try {
      const payload: VehiclePayload = {
        ...formData,
        officeId: selectedOfficeId,
      } as VehiclePayload;

      let updatedList: Vehicle[];

      if (editingVehicle) {
        const updated = await vehicleService.updateVehicle(
          editingVehicle._id,
          payload,
        );
        updatedList = vehicles.map((v) =>
          v._id === updated._id ? updated : v,
        );
        toast.success("Vehicle updated successfully!");
      } else {
        const created = await vehicleService.createVehicle(payload);
        updatedList = [created, ...vehicles];
        toast.success("Vehicle added successfully!");
      }

      setVehicles(updatedList);
      setModalVisible(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save vehicle");
    }
  };

  const handleDelete = async (vehicleId: string) => {
    try {
      await vehicleService.deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((v) => v._id !== vehicleId));
      toast.success("Vehicle deleted successfully");
    } catch (err) {
      toast.error("Failed to delete vehicle");
    }
  };

  const openEdit = (record: Vehicle) => {
    setEditingVehicle(record);
    setFormData(record);
    setModalVisible(true);
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: "VIN",
      dataIndex: "vin",
      key: "vin",
      fixed: "left",
      render: (text) => <span className="font-mono">{text}</span>,
    },
    {
      title: "Reg. Number",
      dataIndex: "registrationNumber",
      key: "registrationNumber",
    },
    {
      title: "Vehicle",
      key: "vehicle",
      render: (_, r) => (
        <div>
          <div className="font-medium">
            {r.make} {r.model}
          </div>
          <div className="text-xs text-gray-500">
            {r.year} • {r.color}
          </div>
        </div>
      ),
    },
    {
      title: "Fuel / Status",
      key: "fuelStatus",
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Tag color={r.fuelType === "PETROL" ? "green" : "blue"}>
            {r.fuelType}
          </Tag>
          <Tag color={r.vehicleStatus === "ACTIVATE" ? "success" : "error"}>
            {r.vehicleStatus}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Odometer",
      dataIndex: "odometerInKms",
      key: "odometerInKms",
      render: (val) => (val ? `${val.toLocaleString()} km` : "—"),
    },
    {
      title: "Purchase",
      key: "purchase",
      render: (_, r) => (
        <div className="text-sm">
          <div>${r.purchaseCost?.toLocaleString() || "—"}</div>
          <div className="text-xs text-gray-500">
            {r.purchaseDate
              ? new Date(r.purchaseDate).toLocaleDateString()
              : "—"}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Vehicle"
            description="Are you sure? This cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header + Office Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Vehicles Management
          </h2>
          <p className="text-gray-600">
            Add, view and manage vehicles per office
          </p>
        </div>

        <div className="min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Office
          </label>
          <Select
            showSearch
            placeholder="Choose an office..."
            value={selectedOfficeId || undefined}
            onChange={setSelectedOfficeId}
            className="w-full"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={offices.map((o) => ({
              value: o._id,
              label: `${o.officeName} (${o.city}, ${o.state})`,
            }))}
          />
        </div>
      </div>

      {selectedOfficeId ? (
        <DataTable<Vehicle>
          title="Vehicles in this Office"
          description="All vehicles assigned to the selected office"
          dataSource={vehicles}
          columns={columns}
          loading={loading}
          onAddClick={() => {
            resetForm();
            setModalVisible(true);
          }}
          addButtonText="Add New Vehicle"
        />
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-10 text-center">
          <Building className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-800 mb-2">
            Select an office to manage vehicles
          </h3>
          <p className="text-amber-700">
            Choose an office from the dropdown above to view or add vehicles.
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <FormModal
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        submitText={editingVehicle ? "Update Vehicle" : "Create Vehicle"}
        submitLoading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* VIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              VIN <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.vin || ""}
              onChange={(e) =>
                setFormData({ ...formData, vin: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. 1HGCM82633A004399"
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Registration Number
            </label>
            <input
              value={formData.registrationNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. ABC-1234"
            />
          </div>

          {/* Make */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Make <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.make || ""}
              onChange={(e) =>
                setFormData({ ...formData, make: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. Toyota"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.model || ""}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. Camry"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              value={formData.year || ""}
              onChange={(e) =>
                setFormData({ ...formData, year: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. 2024"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Color
            </label>
            <input
              value={formData.color || ""}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. White"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.fuelType || ""}
              onChange={(e) =>
                setFormData({ ...formData, fuelType: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="">Select fuel type</option>
              <option value="PETROL">Petrol</option>
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>

          {/* Odometer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Odometer (km)
            </label>
            <input
              type="number"
              value={formData.odometerInKms || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  odometerInKms: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. 15000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ownership / Financing Type <span className="text-red-500">*</span>
            </label>
            <select
              name="leaseType"
              required
              value={formData.leaseType || ""}
              onChange={(e) =>
                setFormData({ ...formData, leaseType: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white text-gray-900"
            >
              <option value="">Please select</option>
              <option value="OWNED">Owned outright</option>
              <option value="LOAN">Under loan / financed</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vehicle Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.vehicleStatus || ""}
              onChange={(e) =>
                setFormData({ ...formData, vehicleStatus: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="">Select status</option>
              <option value="ACTIVATE">Active</option>
              <option value="DEACTIVATE">Inactive</option>
              <option value="MAINTENANCE">Under Maintenance</option>
            </select>
          </div>

          {/* Add more fields like purchaseDate, cost, leaseType, loan details etc. as needed */}
        </div>
      </FormModal>
    </div>
  );
}
