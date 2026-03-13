"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import { useAuth } from "@/src/api/auth";
import { officeService, Office, AgencyOption } from "@/src/api/office";
import { vehicleService, Vehicle } from "@/src/api/vehicle";
import { kmLogsService, KMLog, KMLogUpdatePayload } from "@/src/api/kmLogs";
import { fetchAgencies } from "@/src/api/agencies";
import { Button, Tag, Space, Select, Popconfirm, Input, DatePicker } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Building, Briefcase, Car, FileText } from "lucide-react";
import dayjs from "dayjs";

const { Option } = Select;

export default function KMLogsTab() {
  const { agency } = useAuth();
  const isPrincipal = agency?.role === "PRINCIPAL";
  const isFleetManager = agency?.role === "FLEET_MANAGER";

  // Meta state
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");

  // Filters state
  const [tripTypeFilter, setTripTypeFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  // Data state
  const [kmLogs, setKmLogs] = useState<KMLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [officesLoading, setOfficesLoading] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLog, setEditingLog] = useState<KMLog | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form payload
  const [formData, setFormData] = useState<Partial<KMLogUpdatePayload>>({});
  const [startPhotoFile, setStartPhotoFile] = useState<File | null>(null);
  const [endPhotoFile, setEndPhotoFile] = useState<File | null>(null);

  // Load agencies if Principal
  useEffect(() => {
    if (!isPrincipal) return;
    const loadAgencies = async () => {
      try {
        const data = await fetchAgencies();
        setAgencies(data.map((a) => ({ _id: a._id, agencyName: a.agencyName })));
        if (data.length > 0) setSelectedAgencyId(data[0]._id);
      } catch (err) {
        toast.error("Failed to load agencies");
      }
    };
    loadAgencies();
  }, [isPrincipal]);

  // Auto-set agency for Fleet Manager
  useEffect(() => {
    if (!isFleetManager || !agency?.id) return;
    setSelectedAgencyId(agency.id);
  }, [isFleetManager, agency]);

  // Load offices based on Agency
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
        if (data.length > 0) setSelectedOfficeId(data[0]._id);
        else setSelectedOfficeId("");
      } catch (err) {
        toast.error("Failed to load offices");
      } finally {
        setOfficesLoading(false);
      }
    };
    loadOffices();
  }, [selectedAgencyId]);

  // Load vehicles based on Office
  useEffect(() => {
    if (!selectedOfficeId) {
      setVehicles([]);
      setSelectedVehicleId("");
      return;
    }
    const loadVehicles = async () => {
      setVehiclesLoading(true);
      try {
        const data = await vehicleService.getVehiclesByOffice(selectedOfficeId);
        setVehicles(data);
        if (data.length > 0) setSelectedVehicleId(data[0]._id);
        else setSelectedVehicleId("");
      } catch (err) {
        toast.error("Failed to load vehicles");
      } finally {
        setVehiclesLoading(false);
      }
    };
    loadVehicles();
  }, [selectedOfficeId]);

  // Fetch KM Logs when user clicks search or optionally auto-fetch when vehicle changes
  const handleFetchKmLogs = async () => {
    if (!selectedOfficeId || !selectedVehicleId) {
      toast.error("Please select an Office and a Vehicle to fetch logs.");
      return;
    }
    setLoadingLogs(true);
    try {
      const fromDateStr = dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : undefined;
      const toDateStr = dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined;

      const logs = await kmLogsService.getKMLogs({
        officeId: selectedOfficeId,
        vehicleId: selectedVehicleId,
        tripType: tripTypeFilter || undefined,
        fromDate: fromDateStr,
        toDate: toDateStr,
      });
      setKmLogs(logs);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load KM Logs");
      setKmLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (selectedOfficeId && selectedVehicleId) {
      handleFetchKmLogs();
    }
  }, [selectedOfficeId, selectedVehicleId]); // Auto load when vehicle/office is initially loaded

  const handleEditClick = (record: KMLog) => {
    setEditingLog(record);
    setFormData({
      vehicleId: record.vehicleId,
      agencyId: record.agencyId,
      officeId: record.officeId,
      tripDate: record.tripDate ? dayjs(record.tripDate).format("YYYY-MM-DD") : "",
      startOdometerInKms: record.startOdometerInKms,
      endOdometerInKms: record.endOdometerInKms,
      tripType: record.tripType,
      notes: record.notes,
      businessPurpose: record.businessPurpose,
    });
    setStartPhotoFile(null);
    setEndPhotoFile(null);
    setModalVisible(true);
  };

  const handleDelete = async (logId: string) => {
    try {
      await kmLogsService.deleteKMLog(logId);
      setKmLogs((prev) => prev.filter((l) => l._id !== logId));
      toast.success("KM Log deleted successfully");
    } catch (err) {
      toast.error("Failed to delete KM Log");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    setFormLoading(true);

    try {
      const payload: KMLogUpdatePayload = { ...formData };
      if (startPhotoFile) payload.startOdometerPhoto = startPhotoFile;
      if (endPhotoFile) payload.endOdometerPhoto = endPhotoFile;

      // Make sure agency and office and vehicle IDs are attached if missing
      payload.agencyId = payload.agencyId || selectedAgencyId;
      payload.officeId = payload.officeId || selectedOfficeId;
      payload.vehicleId = payload.vehicleId || selectedVehicleId;

      const updated = await kmLogsService.updateKMLog(editingLog._id, payload);
      setKmLogs((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
      toast.success("KM Log updated successfully!");
      setModalVisible(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update KM Log");
    } finally {
      setFormLoading(false);
    }
  };

  const columns: ColumnsType<KMLog> = [
    {
      title: "Trip Date",
      dataIndex: "tripDate",
      key: "tripDate",
      render: (text) => text ? dayjs(text).format("MMM DD, YYYY") : "—",
    },
    {
      title: "Trip Type",
      dataIndex: "tripType",
      key: "tripType",
      render: (type) => (
        <Tag color={type && type.toLowerCase() === "business" ? "blue" : "green"}>
          {type || "Unknown"}
        </Tag>
      ),
    },
    {
      title: "Odometer",
      key: "odometer",
      render: (_, r) => (
        <span className="text-sm">
          {r.startOdometerInKms?.toLocaleString() || "—"} km
          <span className="text-gray-400 mx-1">→</span>
          {r.endOdometerInKms?.toLocaleString() || "—"} km
        </span>
      ),
    },
    {
      title: "Business Purpose",
      dataIndex: "businessPurpose",
      key: "businessPurpose",
      render: (text) => text || "—",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text) => text || "—",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete KM Log"
            description="Are you sure you want to delete this log?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="Cancel"
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900">KM Logs Management</h2>
        <p className="text-gray-600">View and manage KM logs.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isPrincipal && (
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
                options={agencies.map((a) => ({
                  value: a._id,
                  label: a.agencyName,
                }))}
                size="large"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <Building size={18} className="text-blue-600" />
              Select Office
            </label>
            <Select
              showSearch
              placeholder={
                !selectedAgencyId ? "Select an agency first..." : officesLoading ? "Loading offices..." : "Choose an office..."
              }
              value={selectedOfficeId || undefined}
              onChange={setSelectedOfficeId}
              disabled={!selectedAgencyId || officesLoading}
              loading={officesLoading}
              className="w-full"
              options={offices.map((o) => ({
                value: o._id,
                label: `${o.officeName} (${o.city}, ${o.state})`,
              }))}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2.5 flex items-center gap-2">
              <Car size={18} className="text-green-600" />
              Select Vehicle
            </label>
            <Select
              showSearch
              placeholder={
                !selectedOfficeId ? "Select an office first..." : vehiclesLoading ? "Loading vehicles..." : "Choose a vehicle..."
              }
              value={selectedVehicleId || undefined}
              onChange={setSelectedVehicleId}
              disabled={!selectedOfficeId || vehiclesLoading}
              loading={vehiclesLoading}
              className="w-full"
              options={vehicles.map((v) => ({
                value: v._id,
                label: `${v.make} ${v.model} (${v.registrationNumber})`,
              }))}
              size="large"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
              <FileText size={14} /> Trip Type
            </label>
            <Select
              className="w-full"
              placeholder="All Types"
              allowClear
              value={tripTypeFilter || undefined}
              onChange={setTripTypeFilter}
              size="middle"
            >
              <Option value="business">Business</Option>
              <Option value="personal">Personal</Option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1">
              <FileText size={14} /> Date Range
            </label>
            <DatePicker.RangePicker
              className="w-full"
              value={dateRange}
              onChange={(dates) => setDateRange(dates as any)}
            />
          </div>
          <div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleFetchKmLogs}
              disabled={!selectedOfficeId || !selectedVehicleId || loadingLogs}
              loading={loadingLogs}
              className="w-full bg-[#C46A0A] hover:bg-[#a35808] border-none font-medium h-9"
            >
              Filter Logs
            </Button>
          </div>
        </div>
      </div>

      {selectedOfficeId && selectedVehicleId ? (
        <DataTable<KMLog>
          title="Vehicle KM Logs"
          description="Trip history for the selected vehicle"
          dataSource={kmLogs}
          columns={columns}
          loading={loadingLogs}
        />
      ) : (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
            <Car className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Select Office & Vehicle</h3>
          <p className="text-gray-500">Please choose an office and a vehicle to view its KM logs.</p>
        </div>
      )}

      {/* Edit Form Modal */}
      <FormModal
        title="Edit KM Log"
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleUpdateSubmit}
        submitText="Save Changes"
        submitLoading={formLoading}
        width="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Date</label>
            <Input
              type="date"
              value={formData.tripDate || ""}
              onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
            <Select
              className="w-full h-10"
              value={formData.tripType || ""}
              onChange={(val) => setFormData({ ...formData, tripType: val })}
            >
              <Option value="BUSINESS">Business</Option>
              <Option value="PERSONAL">Personal</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Odometer (KM)</label>
            <Input
              type="number"
              value={formData.startOdometerInKms || ""}
              onChange={(e) => setFormData({ ...formData, startOdometerInKms: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Odometer (KM)</label>
            <Input
              type="number"
              value={formData.endOdometerInKms || ""}
              onChange={(e) => setFormData({ ...formData, endOdometerInKms: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Purpose</label>
            <Input
              value={formData.businessPurpose || ""}
              onChange={(e) => setFormData({ ...formData, businessPurpose: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <Input.TextArea
              rows={3}
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">Start Odometer Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setStartPhotoFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-xs">End Odometer Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setEndPhotoFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs"
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
