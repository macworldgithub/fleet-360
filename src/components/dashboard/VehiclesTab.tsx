"use client";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import {
  vehicleService,
  Vehicle,
  VehiclePayload,
  VehicleCreatePayload,
  VehicleUpdatePayload,
} from "@/src/api/vehicle";
import { fetchAgencies } from "@/src/api/agencies";
import { approveVehicleRequest, rejectVehicleRequest } from "@/src/api/drivers";
import {
  Button,
  Tag,
  Space,
  Select,
  Popconfirm,
  Dropdown,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Building, Briefcase } from "lucide-react";
import { officeService, Office, AgencyOption } from "@/src/api/office";
import { VehicleLogbookModal } from "./VehicleLogbookModal";
import { CostIntelligenceModal } from "./CostIntelligenceModal";
import { useAuth } from "@/src/api/auth";

export default function VehiclesTab() {
  const { agency } = useAuth();
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
  const [selectedLogbookVehicle, setSelectedLogbookVehicle] =
    useState<Vehicle | null>(null);
  const [costModalVisible, setCostModalVisible] = useState(false);
  const [selectedCostVehicle, setSelectedCostVehicle] =
    useState<Vehicle | null>(null);

  // File states
  const [displayPhoto, setDisplayPhoto] = useState<File | null>(null);
  const [vehiclePhotos, setVehiclePhotos] = useState<File[]>([]);

  // Previews
  const [displayPhotoPreview, setDisplayPhotoPreview] = useState<string | null>(
    null,
  );
  const [vehiclePhotosPreviews, setVehiclePhotosPreviews] = useState<string[]>(
    [],
  );

  // Hidden input ref for "Add more photos"
  const addPhotosInputRef = useRef<HTMLInputElement | null>(null);

  // Load data based on user role
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get agency data directly from localStorage to ensure correct ID
        let agencyData = agency;
        if (typeof window !== "undefined") {
          const localStorageAgency = localStorage.getItem("agency");
          if (localStorageAgency) {
            try {
              agencyData = JSON.parse(localStorageAgency);
              console.log("Using agency from localStorage:", agencyData);
            } catch (e) {
              console.error("Failed to parse localStorage agency:", e);
            }
          }
        }

        if (agencyData?.role === "FLEET_MANAGER") {
          // Fleet Manager: Use their own agency
          console.log("Fleet Manager detected, agency ID:", agencyData.id);
          setSelectedAgencyId(agencyData.id);
          setAgencies([
            { _id: agencyData.id, agencyName: agencyData.agencyName },
          ]);
        } else {
          // Principal: Load all agencies
          const data = await fetchAgencies();
          setAgencies(
            data.map((a) => ({ _id: a._id, agencyName: a.agencyName })),
          );
          if (data.length > 0) setSelectedAgencyId(data[0]._id);
        }
      } catch (err) {
        toast.error("Failed to load agencies");
      }
    };
    loadData();
  }, [agency]);

  // Load offices when agency changes
  useEffect(() => {
    if (!selectedAgencyId) {
      setOffices([]);
      setSelectedOfficeId("");
      return;
    }
    const loadOffices = async () => {
      setOfficesLoading(true);
      try {
        console.log("Loading offices for agency ID:", selectedAgencyId);
        console.log(
          "API call will be: /agencies/" + selectedAgencyId + "/offices",
        );
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

  // Helper to load vehicles for selected office
  const loadVehiclesForSelectedOffice = async (officeId?: string) => {
    const id = officeId ?? selectedOfficeId;
    if (!id) {
      setVehicles([]);
      return;
    }
    setLoading(true);
    try {
      const data = await vehicleService.getVehiclesByOffice(id);
      setVehicles(data);
    } catch (err) {
      toast.error("Failed to load vehicles for this office");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiclesForSelectedOffice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOfficeId]);

  // Create object URL previews when files change; revoke old URLs on cleanup
  useEffect(() => {
    if (displayPhoto) {
      const url = URL.createObjectURL(displayPhoto);
      setDisplayPhotoPreview(url);
      return () => {
        URL.revokeObjectURL(url);
        setDisplayPhotoPreview(null);
      };
    } else {
      setDisplayPhotoPreview(null);
    }
  }, [displayPhoto]);

  useEffect(() => {
    // when vehiclePhotos changes, create previews for the current files
    // First revoke previous previews
    vehiclePhotosPreviews.forEach((u) => URL.revokeObjectURL(u));
    if (vehiclePhotos.length > 0) {
      const urls = vehiclePhotos.map((f) => URL.createObjectURL(f));
      setVehiclePhotosPreviews(urls);
      return () => {
        urls.forEach((u) => URL.revokeObjectURL(u));
        setVehiclePhotosPreviews([]);
      };
    } else {
      setVehiclePhotosPreviews([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiclePhotos]);

  const resetForm = () => {
    setFormData({ vehicleStatus: "ACTIVATE" });
    setEditingVehicle(null);
    setDisplayPhoto(null);
    setVehiclePhotos([]);
    setDisplayPhotoPreview(null);
    setVehiclePhotosPreviews([]);
    // clear hidden file input if present
    if (addPhotosInputRef.current) addPhotosInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfficeId) {
      toast.warn("Please select an office first");
      return;
    }

    try {
      let updatedList: Vehicle[];

      if (editingVehicle) {
        // Update (JSON)
        const payload: VehicleUpdatePayload = {
          ...(formData as VehicleUpdatePayload),
          officeId: selectedOfficeId,
        };
        const updated = await vehicleService.updateVehicle(
          editingVehicle._id,
          payload,
        );
        updatedList = vehicles.map((v) =>
          v._id === updated._id ? updated : v,
        );
        toast.success("Vehicle updated successfully!");
      } else {
        // CREATE with files (multipart)
        if (!displayPhoto) {
          toast.error("Display photo is required");
          return;
        }

        const createPayload: VehicleCreatePayload = {
          ...(formData as VehicleCreatePayload),
          officeId: selectedOfficeId,
        } as VehicleCreatePayload;

        const created = await vehicleService.createVehicle(
          createPayload,
          displayPhoto,
          vehiclePhotos,
        );
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
    setFormData(record as Partial<VehiclePayload>);
    // Clear file inputs for editing (we're not auto-uploading replacements)
    setDisplayPhoto(null);
    setVehiclePhotos([]);
    setDisplayPhotoPreview(null);
    setVehiclePhotosPreviews([]);
    if (addPhotosInputRef.current) addPhotosInputRef.current.value = "";
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

  // Approve / Reject (use driver API functions)
  const handleApproveRequest = async (vehicle: Vehicle) => {
    try {
      setStatusLoadingId(vehicle._id);
      await approveVehicleRequest(vehicle._id);
      toast.success("Vehicle request approved");
      await loadVehiclesForSelectedOffice();
    } catch (err) {
      toast.error("Failed to approve vehicle request");
    } finally {
      setStatusLoadingId(null);
    }
  };

  const handleRejectRequest = async (vehicle: Vehicle) => {
    try {
      setStatusLoadingId(vehicle._id);
      await rejectVehicleRequest(vehicle._id);
      toast.success("Vehicle request rejected");
      await loadVehiclesForSelectedOffice();
    } catch (err) {
      toast.error("Failed to reject vehicle request");
    } finally {
      setStatusLoadingId(null);
    }
  };

  // Append new vehicle photos (called from hidden input)
  const handleAppendPhotos = (files: File[]) => {
    if (!files || files.length === 0) return;
    // append (no dedupe) — keep order
    setVehiclePhotos((prev) => [...prev, ...files]);
    // clear the hidden input value so the same file can be chosen again if needed
    if (addPhotosInputRef.current) addPhotosInputRef.current.value = "";
  };

  const onAddPhotosInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleAppendPhotos(files);
  };

  // Remove a selected vehicle photo (before upload)
  const removeVehiclePhotoAt = (index: number) => {
    setVehiclePhotos((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    // previews will be recalculated by the effect watching vehiclePhotos
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
      width: 220,
      fixed: "right",
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
            label: "Activate",
            disabled:
              statusLoadingId === record._id ||
              record.vehicleStatus === "ACTIVATE",
            onClick: () => handleToggleStatus(record, "ACTIVATE"),
          },
          {
            key: "deactivate",
            label: "Deactivate",
            disabled:
              statusLoadingId === record._id ||
              record.vehicleStatus === "DEACTIVATE",
            onClick: () => handleToggleStatus(record, "DEACTIVATE"),
          },
        ];

        return (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              size="small"
            />
            <Popconfirm
              title="Delete Vehicle"
              description="Are you sure? This cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Yes, Delete"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="link"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Popconfirm>

            {/* Compact Approve / Disapprove icon buttons (only for UNDER_AGREEMENT) */}
            {record.vehicleStatus === "UNDER_AGREEMENT" && (
              <Space size="small">
                <Tooltip title="Approve">
                  <Popconfirm
                    title="Approve vehicle request?"
                    description="This will approve the vehicle request."
                    onConfirm={() => handleApproveRequest(record)}
                    okText="Approve"
                    cancelText="Cancel"
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CheckOutlined />}
                      size="small"
                      loading={statusLoadingId === record._id}
                      aria-label="Approve"
                    />
                  </Popconfirm>
                </Tooltip>

                <Tooltip title="Disapprove">
                  <Popconfirm
                    title="Reject vehicle request?"
                    description="This will reject the vehicle request."
                    onConfirm={() => handleRejectRequest(record)}
                    okText="Reject"
                    cancelText="Cancel"
                  >
                    <Button
                      danger
                      shape="circle"
                      icon={<CloseOutlined />}
                      size="small"
                      loading={statusLoadingId === record._id}
                      aria-label="Disapprove"
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            )}

            <Dropdown
              menu={{ items: menuItems }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                loading={statusLoadingId === record._id}
              />
            </Dropdown>
          </div>
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
          {/* Agency Selector - Only for Principals */}
          {agency?.role !== "FLEET_MANAGER" && (
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
          )}

          {/* Office Selector - Always visible */}
          <div
            className={agency?.role === "FLEET_MANAGER" ? "md:col-span-2" : ""}
          >
            <label className="block text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <Building size={18} className="text-blue-600" />
              Select Office
            </label>
            <Select
              showSearch
              placeholder={
                !selectedAgencyId
                  ? agency?.role === "FLEET_MANAGER"
                    ? "Loading offices..."
                    : "Select an agency first..."
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
                const searchStr =
                  `${(option as any)?.officeName || ""} ${(option as any)?.city || ""}`.toLowerCase();
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

          {/* Registration */}
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
                setFormData({
                  ...formData,
                  fuelType: e.target.value as VehiclePayload["fuelType"],
                })
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

          {/* Lease Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ownership / Financing Type <span className="text-red-500">*</span>
            </label>
            <select
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

          {/* Vehicle Status */}
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
              <option value="IN_MAINTENANCE">Under Maintenance</option>
              <option value="UNDER_AGREEMENT">Under Agreement</option>
              <option value="ASSIGNED">Assigned</option>
            </select>
          </div>

          {/* Display Photo (single, required) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Display Photo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDisplayPhoto(e.target.files?.[0] || null)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {displayPhotoPreview && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={displayPhotoPreview}
                  alt="display preview"
                  className="w-28 h-20 object-cover rounded-md border"
                />
                <div className="text-xs text-gray-600">
                  <div className="font-medium">{displayPhoto?.name}</div>
                  <div className="text-gray-500">
                    New selection — will replace current display photo on submit
                  </div>
                </div>
              </div>
            )}

            {/* If editing and no newly selected file, show existing image if available */}
            {!displayPhotoPreview &&
              editingVehicle &&
              (editingVehicle as any).displayPhotoUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={(editingVehicle as any).displayPhotoUrl}
                    alt="current display"
                    className="w-28 h-20 object-cover rounded-md border"
                  />
                  <div className="text-xs text-gray-600">
                    <div className="font-medium">Current display photo</div>
                  </div>
                </div>
              )}
          </div>

          {/* Additional photos (multiple) — append mode with + Add button */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Additional Vehicle Photos (optional)
            </label>

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <input
                ref={addPhotosInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={onAddPhotosInputChange}
                className="hidden"
              />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => addPhotosInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                Add photos
              </Button>

              {vehiclePhotos.length > 0 && (
                <div className="text-sm text-gray-600">
                  {vehiclePhotos.length} selected
                </div>
              )}

              {/* If editing and no new photos selected, optionally indicate existing */}
              {vehiclePhotos.length === 0 &&
                editingVehicle &&
                (editingVehicle as any).vehiclePhotosUrls?.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {(editingVehicle as any).vehiclePhotosUrls.length} existing
                    photo(s)
                  </div>
                )}
            </div>

            {/* Previews grid */}
            <div className="flex gap-2 flex-wrap">
              {vehiclePhotosPreviews.map((p, i) => (
                <div
                  key={i}
                  className="relative w-28 h-20 rounded-md overflow-hidden border"
                >
                  <img
                    src={p}
                    alt={`photo-${i}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeVehiclePhotoAt(i)}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* Show existing photos (if editing and no new photos chosen) */}
              {vehiclePhotosPreviews.length === 0 &&
                editingVehicle &&
                (editingVehicle as any).vehiclePhotosUrls?.length > 0 &&
                (editingVehicle as any).vehiclePhotosUrls.map(
                  (url: string, idx: number) => (
                    <div
                      key={`existing-${idx}`}
                      className="relative w-28 h-20 rounded-md overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={`existing-${idx}`}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-1 right-1 text-xs bg-white/80 px-1 rounded">
                        current
                      </div>
                    </div>
                  ),
                )}
            </div>
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
        vehicleName={
          selectedLogbookVehicle
            ? `${selectedLogbookVehicle.make} ${selectedLogbookVehicle.model} (${selectedLogbookVehicle.registrationNumber})`
            : "Vehicle"
        }
      />

      <CostIntelligenceModal
        isOpen={costModalVisible}
        onClose={() => {
          setCostModalVisible(false);
          setSelectedCostVehicle(null);
        }}
        vehicleId={selectedCostVehicle?._id || null}
        vehicleName={
          selectedCostVehicle
            ? `${selectedCostVehicle.make} ${selectedCostVehicle.model} (${selectedCostVehicle.registrationNumber})`
            : "Vehicle"
        }
      />
    </div>
  );
}
