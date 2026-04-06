"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import { VehicleLogbookModal } from "@/src/components/dashboard/VehicleLogbookModal";
import { CostIntelligenceModal } from "@/src/components/dashboard/CostIntelligenceModal";
import { officeService, Office, AgencyOption } from "@/src/api/office";
import { vehicleService, Vehicle, VehiclePayload } from "@/src/api/vehicle";
import { fetchAgencies } from "@/src/api/agencies";
import { Button, Tag, Space, Select, Popconfirm, Dropdown } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Building, Briefcase } from "lucide-react";

export default function VehiclesTab() {
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<VehiclePayload>>({});
  const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);
  const [logbookModalVisible, setLogbookModalVisible] = useState(false);
  const [selectedLogbookVehicle, setSelectedLogbookVehicle] = useState<Vehicle | null>(null);
  const [costModalVisible, setCostModalVisible] = useState(false);
  const [selectedCostVehicle, setSelectedCostVehicle] = useState<Vehicle | null>(null);


  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const data = await fetchAgencies();
        setAgencies(
          data.map((a) => ({ _id: a._id, agencyName: a.agencyName })),
        );
        if (data.length > 0) setSelectedAgencyId(data[0]._id);
      } catch (err) {
        toast.error("Failed to load agencies");
      }
    };
    loadAgencies();
  }, []);


  useEffect(() => {
    if (!selectedAgencyId) {
      setOffices([]);
      setSelectedOfficeId("");
      return;
    }

    const loadOffices = async () => {
      setOfficesLoading(true);
      try {
        const data = await officeService.getOfficesByAgency(selectedAgencyId);
        setOffices(data);
        if (data.length > 0) {
          setSelectedOfficeId(data[0]._id);
        } else {
          setSelectedOfficeId("");
        }
      } catch (err) {
        toast.error("Failed to load offices");
      } finally {
        setOfficesLoading(false);
      }
    };
    loadOffices();
  }, [selectedAgencyId]);


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

  const handleToggleStatus = async (
    vehicle: Vehicle,
    target: "ACTIVATE" | "DEACTIVATE",
  ) => {
    if (vehicle.vehicleStatus === target) {
      return;
    }
    try {
      setStatusLoadingId(vehicle._id);
      const updated = await vehicleService.toggleStatus(vehicle._id);
      setVehicles((prev) =>
        prev.map((v) => (v._id === updated._id ? updated : v)),
      );
      toast.success(
        `Vehicle ${updated.vehicleStatus === "ACTIVATE" ? "activated" : "deactivated"} successfully`,
      );
    } catch (err) {
      toast.error("Failed to update vehicle status");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const columns: ColumnsType<Vehicle> = [
    {
      title: "VIN",
      dataIndex: "vin",
      key: "vin",
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
      width: 160,
      render: (_, record) => {
        const menuItems = [
          {
            key: "logbooks",
            label: "ATO Logbooks",
            onClick: () => {
              setSelectedLogbookVehicle(record);
              setLogbookModalVisible(true);
            },
          },
          {
            key: "cost-intelligence",
            label: "Cost Intelligence",
            onClick: () => {
              setSelectedCostVehicle(record);
              setCostModalVisible(true);
            },
          },
          {
            key: "activate",
            label: "Active",
            disabled:
              statusLoadingId === record._id ||
              record.vehicleStatus === "ACTIVATE",
            onClick: () => handleToggleStatus(record, "ACTIVATE"),
          },
          {
            key: "deactivate",
            label: "Inactive",
            disabled:
              statusLoadingId === record._id ||
              record.vehicleStatus === "DEACTIVATE",
            onClick: () => handleToggleStatus(record, "DEACTIVATE"),
          },
        ];

        return (
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
            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                loading={statusLoadingId === record._id}
              />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Vehicles Management
        </h2>
        <p className="text-gray-600">
          Add, view and manage vehicles per office
        </p>
      </div>


      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <Briefcase size={18} className="text-amber-600" />
              Select Agency
            </label>
            <Select
              showSearch
              placeholder="Choose an agency..."
              value={selectedAgencyId || undefined}
              onChange={setSelectedAgencyId}
              className="w-full"
              filterOption={(input, option) =>
                ((option as any)?.agencyName || "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              optionLabelProp="label"
              options={agencies.map((a) => ({
                value: a._id,
                agencyName: a.agencyName,
                label: (
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-amber-600" />
                    {a.agencyName}
                  </div>
                ),
              }))}
              size="large"
              status={selectedAgencyId ? "success" : undefined}
              style={{
                borderRadius: "0.875rem",
              }}
            />
          </div>


          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <Building size={18} className="text-blue-600" />
              Select Office
            </label>
            <Select
              showSearch
              placeholder={
                !selectedAgencyId
                  ? "Select an agency first..."
                  : officesLoading
                    ? "Loading offices..."
                    : "Choose an office..."
              }
              value={selectedOfficeId || undefined}
              onChange={setSelectedOfficeId}
              disabled={!selectedAgencyId || officesLoading}
              loading={officesLoading}
              className="w-full"
              filterOption={(input, option) => {
                const searchStr = `${(option as any)?.officeName || ""} ${(option as any)?.city || ""}`.toLowerCase();
                return searchStr.includes(input.toLowerCase());
              }}
              optionLabelProp="label"
              options={offices.map((o) => ({
                value: o._id,
                officeName: o.officeName,
                city: o.city,
                label: (
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-blue-600" />
                    <div>
                      <div className="font-medium">{o.officeName}</div>
                      <div className="text-xs text-gray-500">
                        {o.city}, {o.state}
                      </div>
                    </div>
                  </div>
                ),
              }))}
              size="large"
              status={selectedOfficeId ? "success" : undefined}
              style={{
                borderRadius: "0.875rem",
              }}
            />
          </div>
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
      ) : selectedAgencyId ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Select an Office
          </h3>
          <p className="text-blue-700">
            Choose an office from the dropdown to view and manage vehicles
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Briefcase className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-amber-900 mb-2">
            Select an Agency First
          </h3>
          <p className="text-amber-700">
            Choose an agency to view its offices and manage vehicles
          </p>
        </div>
      )}


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


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.fuelType || ""}
              onChange={(e) =>
                setFormData({ ...formData, fuelType: e.target.value as VehiclePayload["fuelType"] })
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


        </div>
      </FormModal>

      <VehicleLogbookModal
        isOpen={logbookModalVisible}
        onClose={() => {
          setLogbookModalVisible(false);
          setSelectedLogbookVehicle(null);
        }}
        vehicleId={selectedLogbookVehicle?._id || null}
        agencyId={selectedAgencyId || null}
        vehicleName={selectedLogbookVehicle ? `${selectedLogbookVehicle.make} ${selectedLogbookVehicle.model} (${selectedLogbookVehicle.registrationNumber})` : "Vehicle"}
      />

      <CostIntelligenceModal
        isOpen={costModalVisible}
        onClose={() => {
          setCostModalVisible(false);
          setSelectedCostVehicle(null);
        }}
        vehicleId={selectedCostVehicle?._id || null}
        vehicleName={selectedCostVehicle ? `${selectedCostVehicle.make} ${selectedCostVehicle.model} (${selectedCostVehicle.registrationNumber})` : "Vehicle"}
      />
    </div>
  );
}