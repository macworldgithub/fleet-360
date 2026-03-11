"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import { vehicleService, Vehicle } from "@/src/api/vehicle";
import {
  incidentService,
  Incident,
  IncidentCreatePayload,
} from "@/src/api/incident";
import { Button, Tag, Space, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Building } from "lucide-react";
import { useAuth } from "@/src/api/auth"; // added to access logged in agency info

export default function IncidentsTab() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [formData, setFormData] = useState<Partial<IncidentCreatePayload>>({});

  // delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Incident | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const { agency } = useAuth();

  // Load all vehicles once (filtered by agency when available)
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const allVehicles = await vehicleService.getVehiclesByOffice(""); 
        // if we have agency info, filter vehicles by that agency's id
        const filtered = agency
          ? allVehicles.filter((v) => v.agencyId === agency.id)
          : allVehicles;
        setVehicles(filtered);
        if (filtered.length > 0) {
          setSelectedVehicleId(filtered[0]._id);
        } else {
          setSelectedVehicleId("");
        }
      } catch (err) {
        toast.error("Failed to load vehicles");
      }
    };
    loadVehicles();
  }, [agency]);

  useEffect(() => {
    if (!selectedVehicleId) {
      setIncidents([]);
      return;
    }

    const loadIncidents = async () => {
      setLoading(true);
      try {
        const data =
          await incidentService.getIncidentsByVehicle(selectedVehicleId);
        setIncidents(data);
      } catch (err) {
        toast.error("Failed to load incidents for this vehicle");
      } finally {
        setLoading(false);
      }
    };
    loadIncidents();
  }, [selectedVehicleId]);

  const resetForm = () => {
    setFormData({});
    setEditingIncident(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedVehicleId) {
      toast.error("Please select a vehicle first");
      return;
    }

    try {
      const payload: IncidentCreatePayload = {
        ...formData,
        vehicleId: selectedVehicleId,
      } as IncidentCreatePayload;

      let updatedList: Incident[];

      if (editingIncident) {
        const updated = await incidentService.updateIncident(
          editingIncident._id,
          payload,
        );
        updatedList = incidents.map((i) =>
          i._id === updated._id ? updated : i,
        );
        toast.success("Incident updated successfully!");
      } else {
        const created = await incidentService.createIncident(payload);
        updatedList = [created, ...incidents];
        toast.success("Incident reported successfully!");
      }

      setIncidents(updatedList);
      setModalVisible(false);
      resetForm();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save incident");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await incidentService.deleteIncident(deleteTarget._id);
      setIncidents((prev) => prev.filter((i) => i._id !== deleteTarget._id));
      toast.success("Incident deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete incident");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const openEdit = (record: Incident) => {
    setEditingIncident(record);
    setFormData(record);
    setModalVisible(true);
  };

  const openDeleteModal = (record: Incident) => {
    setDeleteTarget(record);
    setIsDeleteModalOpen(true);
  };

  const columns: ColumnsType<Incident> = [
    {
      title: "Type",
      dataIndex: "incidentType",
      key: "incidentType",
      render: (type) => <Tag color="orange">{type}</Tag>,
    },
    {
      title: "Date",
      dataIndex: "incidentDate",
      key: "incidentDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Severity",
      dataIndex: "damageSeverity",
      key: "damageSeverity",
      render: (sev) => (
        <Tag
          color={sev === "HIGH" ? "red" : sev === "MEDIUM" ? "orange" : "green"}
        >
          {sev}
        </Tag>
      ),
    },
    {
      title: "Repair Cost",
      key: "cost",
      render: (_, r) =>
        r.estimatedRepairCost
          ? `$${r.estimatedRepairCost.toLocaleString()}`
          : "—",
    },
    {
      title: "Insurance",
      key: "insurance",
      render: (_, r) => (
        <Tag color={r.insuranceClaimFiled ? "blue" : "default"}>
          {r.insuranceClaimFiled ? "Claim Filed" : "No Claim"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (st) => <Tag color="purple">{st}</Tag>,
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
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Header + Vehicle Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Incidents Management
          </h2>
          <p className="text-gray-600">
            Report and manage incidents per vehicle
          </p>
        </div>

        <div className="min-w-[300px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Vehicle
          </label>
          <Select
            showSearch
            placeholder="Choose a vehicle..."
            value={selectedVehicleId || undefined}
            onChange={setSelectedVehicleId}
            className="w-full"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={vehicles.map((v) => ({
              value: v._id,
              label: `${v.make} ${v.model} (${v.registrationNumber})`,
            }))}
          />
        </div>
      </div>

      {selectedVehicleId ? (
        <DataTable<Incident>
          title="Incidents for this Vehicle"
          description="All reported incidents related to the selected vehicle"
          dataSource={incidents}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content" }}
        />
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-10 text-center">
          <Building className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-amber-800 mb-2">
            Select a vehicle to manage incidents
          </h3>
          <p className="text-amber-700">
            Choose a vehicle from the dropdown above to view or report
            incidents.
          </p>
        </div>
      )}

      {/* Add/Edit Incident Modal */}
      <FormModal
        title={editingIncident ? "Edit Incident" : "Report New Incident"}
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
        submitText={editingIncident ? "Update Incident" : "Report Incident"}
        submitLoading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Incident Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Incident Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.incidentType || ""}
              onChange={(e) =>
                setFormData({ ...formData, incidentType: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="">Select type</option>
              <option value="ACCIDENT">Accident</option>
              <option value="BREAKDOWN">Breakdown</option>
              <option value="THEFT">Theft</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Incident Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.incidentDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, incidentDate: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={formData.location || ""}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. Melbourne CBD"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
              placeholder="Describe what happened..."
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Damage Severity <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.damageSeverity || ""}
              onChange={(e) =>
                setFormData({ ...formData, damageSeverity: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="">Select severity</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Estimated Repair Cost ($)
            </label>
            <input
              type="number"
              value={formData.estimatedRepairCost || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimatedRepairCost: Number(e.target.value),
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. 3500"
            />
          </div>

          {/* Insurance Claim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Insurance Claim Filed?
            </label>
            <select
              value={formData.insuranceClaimFiled ? "true" : "false"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  insuranceClaimFiled: e.target.value === "true",
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Police Report */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Police Report Number
            </label>
            <input
              value={formData.policeReportNumber || ""}
              onChange={(e) =>
                setFormData({ ...formData, policeReportNumber: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              placeholder="e.g. PR-12345"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status || ""}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="">Select status</option>
              <option value="REPORTED">Reported</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <Tag color="red">
                <DeleteOutlined />
              </Tag>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Incident
              </h3>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete this incident?
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
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                disabled={deleteSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleDelete}
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
