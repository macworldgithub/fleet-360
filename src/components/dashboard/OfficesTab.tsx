"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { Table, Button, Tag, Input, Space, Typography } from "antd";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";
import {
  officeService,
  AgencyOption,
  Office,
  OfficePayload,
} from "@/src/api/office";
import { fetchAgencies } from "@/src/api/agencies";

const { Text, Title } = Typography;

type OfficeFormModalProps = {
  title: string;
  form: any;
  setForm: (f: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText: string;
  loading: boolean;
};

export default function OfficesTab() {
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Office | null>(null);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [form, setForm] = useState<OfficePayload>({
    officeName: "",
    officeType: "",
    officeHours: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        const data = await fetchAgencies();
        setAgencies(
          data.map((a) => ({ _id: a._id, agencyName: a.agencyName })),
        ); // map to minimal shape if needed
        if (data.length > 0) setSelectedAgencyId(data[0]._id);
      } catch (err: any) {
        console.error("Failed to load agencies:", err);
        setError("Failed to load agencies");
      }
    };
    loadAgencies();
  }, []);

  useEffect(() => {
    if (!selectedAgencyId) {
      setOffices([]);
      return;
    }

    const loadOffices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await officeService.getOfficesByAgency(selectedAgencyId);
        setOffices(data);
      } catch (err: any) {
        setError(err.message || "Failed to load offices");
      } finally {
        setLoading(false);
      }
    };
    loadOffices();
  }, [selectedAgencyId]);

  const handleAddOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgencyId) return;

    setLoadingAction("add");

    try {
      const newOffice = await officeService.createOffice(
        selectedAgencyId,
        form,
      );

      setOffices((prev) => [...prev, newOffice]);
      setShowAddForm(false);
      resetForm();
      toast.success("Office created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create office");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEditOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;

    setLoadingAction(editingOffice._id);

    try {
      const updated = await officeService.updateOffice(editingOffice._id, form);

      setOffices((prev) =>
        prev.map((o) => (o._id === updated._id ? updated : o)),
      );

      setShowEditForm(false);
      setEditingOffice(null);
      resetForm();
      toast.success("Office updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update office");
    } finally {
      setLoadingAction(null);
    }
  };
  const handleDeleteOffice = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await officeService.deleteOffice(deleteTarget._id);
      setOffices((prev) => prev.filter((o) => o._id !== deleteTarget._id));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      toast.success("Office deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete office");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const openDeleteModal = (officeToDelete: Office) => {
    setDeleteTarget(officeToDelete);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = async (office: Office) => {
    try {
      const fullOffice = await officeService.getOfficeById(office._id);
      setEditingOffice(fullOffice);
      setForm({
        officeName: fullOffice.officeName || "",
        officeType: fullOffice.officeType || "Real Estate Branch",
        officeHours: fullOffice.officeHours || "9:00 AM - 5:00 PM",
        address: fullOffice.address || "",
        city: fullOffice.city || "",
        state: fullOffice.state || "",
        country: fullOffice.country || "Australia",
      });
      setShowEditForm(true);
    } catch {
      alert("Could not load office details");
    }
  };

  const resetForm = () => {
    setForm({
      officeName: "",
      officeType: "",
      officeHours: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
  };

  const filteredOffices = offices.filter(
    (o) =>
      o.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns: ColumnsType<Office> = [
    {
      title: "Office Name",
      dataIndex: "officeName",
      key: "officeName",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Type",
      dataIndex: "officeType",
      key: "officeType",
      render: (type) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <Text>
          {record.city}, {record.state} • {record.country}
        </Text>
      ),
    },
    {
      title: "Hours",
      dataIndex: "officeHours",
      key: "officeHours",
      render: (hours) => hours || "—",
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      width: 140,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<Edit size={16} />}
            onClick={() => openEditModal(record)}
            disabled={loadingAction === record._id}
            style={{ padding: 0 }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<Trash2 size={16} />}
            onClick={() => openDeleteModal(record)}
            disabled={loadingAction === record._id}
            style={{ padding: 0 }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const OfficeFormFields = (
    <>
      {/* Office Name */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Office Name *
        </label>
        <input
          required
          value={form.officeName}
          onChange={(e) => setForm({ ...form, officeName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-600"
        />
      </div>

      {/* Office Type */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Office Type
        </label>
        <input
          value={form.officeType}
          onChange={(e) => setForm({ ...form, officeType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-600"
        />
      </div>

      {/* Office Hours */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Office Hours
        </label>
        <input
          value={form.officeHours}
          onChange={(e) => setForm({ ...form, officeHours: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-600"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Address *
        </label>
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-600"
        />
      </div>

      {/* City / State / Country */}
      <div className="grid grid-cols-3 gap-4">
        <input
          placeholder="City"
          required
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />

        <input
          placeholder="State"
          required
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />

        <input
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2}>Branch Offices</Title>
          <Text type="secondary">Manage offices for each agency</Text>
        </div>

        <div className="min-w-[240px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Agency
          </label>
          <div className="relative">
            <select
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 appearance-none text-gray-900"
            >
              <option value="">-- Select Agency --</option>
              {agencies.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.agencyName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedAgencyId ? (
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-9 h-9 animate-spin text-amber-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-9 h-9 text-red-500 mx-auto mb-3" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <DataTable<Office>
              title="Branch Offices"
              description="Manage offices for each agency"
              dataSource={filteredOffices}
              columns={columns}
              loading={loading}
              emptyText="No offices found for this agency"
              onAddClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              addButtonText="Add Office"
              // searchValue={searchTerm}
              // onSearchChange={setSearchTerm}
            />
          )}

          {/* Your modals remain the same */}
          <FormModal
            title="Add New Office"
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddOffice}
            submitText="Create Office"
            submitLoading={loadingAction === "add"}
          >
            {OfficeFormFields}
          </FormModal>

          {showEditForm && editingOffice && (
            <FormModal
              title="Edit Office"
              isOpen={showEditForm}
              onClose={() => {
                setShowEditForm(false);
                setEditingOffice(null);
              }}
              onSubmit={handleEditOffice}
              submitText="Save Changes"
              submitLoading={loadingAction === editingOffice?._id}
            >
              {OfficeFormFields}
            </FormModal>
          )}

          {isDeleteModalOpen && deleteTarget && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Office
                  </h3>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <p className="text-sm text-gray-700">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold">
                      {deleteTarget.officeName}
                    </span>
                    ?
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
                    onClick={handleDeleteOffice}
                    disabled={deleteSubmitting}
                  >
                    {deleteSubmitting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <Title level={4} className="!text-amber-800 mb-2">
            Select an agency first
          </Title>
          <Text type="secondary">
            Choose an agency from the dropdown to view and manage its offices.
          </Text>
        </div>
      )}
    </div>
  );
}
