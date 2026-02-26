"use client";
import React, { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ChevronDown,
  X,
} from "lucide-react";
import { API_BASE_URL, getAccessToken } from "@/src/api/auth";

interface AgencyOption {
  _id: string;
  agencyName: string;
}

interface Office {
  _id: string;
  officeName: string;
  officeType: string;
  officeHours?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
}

export default function OfficesTab() {
  const [agencies, setAgencies] = useState<AgencyOption[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [loadingOffices, setLoadingOffices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // officeId or "add"

  // Form state (shared for add & edit)
  const [form, setForm] = useState({
    officeName: "",
    officeType: "Real Estate Branch",
    officeHours: "9:00 AM - 5:00 PM",
    address: "",
    city: "",
    state: "",
    country: "Australia",
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  useEffect(() => {
    if (selectedAgencyId) {
      fetchOffices(selectedAgencyId);
    } else {
      setOffices([]);
    }
  }, [selectedAgencyId]);

  const fetchAgencies = async () => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE_URL}/api/agencies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        // include status so we can diagnose 401 versus other failures
        throw new Error(`Failed to fetch agencies (HTTP ${res.status})`);
      }
      const data = await res.json();
      setAgencies(data);
      if (data.length > 0) setSelectedAgencyId(data[0]._id);
    } catch (err: any) {
      setError(err.message || "Failed to load agencies");
    }
  };

  const fetchOffices = async (agencyId: string) => {
    setLoadingOffices(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(
        `${API_BASE_URL}/api/agencies/${agencyId}/offices`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch offices (HTTP ${res.status})`);
      }
      const data = await res.json();
      setOffices(data);
    } catch (err: any) {
      setError(err.message || "Failed to load offices");
    } finally {
      setLoadingOffices(false);
    }
  };

  const fetchOfficeById = async (officeId: string) => {
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_BASE_URL}/api/offices/${officeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch office");
      return await res.json();
    } catch (err) {
      console.error(err);
      alert("Could not load office details");
      return null;
    }
  };

  const handleAddOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgencyId) return;

    setLoadingAction("add");
    try {
      const token = getAccessToken();
      const res = await fetch(
        `${API_BASE_URL}/api/agencies/${selectedAgencyId}/offices`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (!res.ok) throw new Error("Failed to create office");

      const newOffice = await res.json();
      setOffices((prev) => [...prev, newOffice]);
      setShowAddForm(false);
      resetForm();
    } catch (err) {
      alert("Error creating office");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleEditOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;

    setLoadingAction(editingOffice._id);
    try {
      const token = getAccessToken();
      const res = await fetch(
        `${API_BASE_URL}/api/offices/${editingOffice._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        },
      );

      if (!res.ok) throw new Error("Failed to update office");

      const updatedOffice = await res.json();
      setOffices((prev) =>
        prev.map((o) => (o._id === updatedOffice._id ? updatedOffice : o)),
      );
      setShowEditForm(false);
      setEditingOffice(null);
      resetForm();
    } catch (err) {
      alert("Error updating office");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteOffice = async (officeId: string) => {
    setLoadingAction(officeId);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_BASE_URL}/api/offices/${officeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete office");

      setOffices((prev) => prev.filter((o) => o._id !== officeId));
      setShowDeleteConfirm(null);
    } catch (err) {
      alert("Error deleting office");
    } finally {
      setLoadingAction(null);
    }
  };

  const openEditModal = async (office: Office) => {
    const fullOffice = await fetchOfficeById(office._id);
    if (fullOffice) {
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
    }
  };

  const resetForm = () => {
    setForm({
      officeName: "",
      officeType: "Real Estate Branch",
      officeHours: "9:00 AM - 5:00 PM",
      address: "",
      city: "",
      state: "",
      country: "Australia",
    });
  };

  const filteredOffices = offices.filter(
    (o) =>
      o.officeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header + Agency Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branch Offices</h2>
          <p className="text-gray-600">Manage offices for each agency</p>
        </div>
        <div className="min-w-[240px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Agency
          </label>
          <div className="relative">
            <select
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 appearance-none"
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
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search offices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Office
            </button>
          </div>

          {/* Content */}
          {loadingOffices ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-9 h-9 animate-spin text-amber-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-9 h-9 text-red-500 mx-auto mb-3" />
              <p className="text-red-700">{error}</p>
            </div>
          ) : filteredOffices.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-10 text-center text-gray-500 border border-gray-200">
              No offices found for this agency
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffices.map((office) => (
                <div
                  key={office._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-4 text-white">
                    <h3 className="font-semibold text-lg">
                      {office.officeName}
                    </h3>
                    <p className="text-amber-100 text-sm mt-0.5">
                      {office.officeType}
                    </p>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-900">{office.address}</p>
                        <p className="text-gray-600">
                          {office.city}, {office.state} • {office.country}
                        </p>
                      </div>
                    </div>
                    {office.officeHours && (
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-center text-gray-400">
                          🕒
                        </span>
                        <p className="text-gray-900">{office.officeHours}</p>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-100 flex justify-end gap-4 text-xs font-medium">
                      <button
                        onClick={() => openEditModal(office)}
                        disabled={loadingAction === office._id}
                        className="text-amber-600 hover:text-amber-800 flex items-center gap-1 disabled:opacity-50"
                      >
                        {loadingAction === office._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(office._id)}
                        disabled={loadingAction === office._id}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
                      >
                        {loadingAction === office._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Modal */}
          {showAddForm && (
            <OfficeFormModal
              title="Add New Office"
              form={form}
              setForm={setForm}
              onSubmit={handleAddOffice}
              onCancel={() => setShowAddForm(false)}
              submitText="Create Office"
              loading={loadingAction === "add"}
            />
          )}

          {/* Edit Modal */}
          {showEditForm && editingOffice && (
            <OfficeFormModal
              title="Edit Office"
              form={form}
              setForm={setForm}
              onSubmit={handleEditOffice}
              onCancel={() => {
                setShowEditForm(false);
                setEditingOffice(null);
              }}
              submitText="Save Changes"
              loading={loadingAction === editingOffice._id}
            />
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this office? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteOffice(showDeleteConfirm)}
                    disabled={loadingAction === showDeleteConfirm}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingAction === showDeleteConfirm && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <Building2 className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">
            Select an agency first
          </h3>
          <p className="text-amber-700">
            Choose an agency from the dropdown to view and manage its offices.
          </p>
        </div>
      )}
    </div>
  );
}

// Reusable modal form component
type OfficeFormModalProps = {
  title: string;
  form: any;
  setForm: (f: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitText: string;
  loading: boolean;
};

function OfficeFormModal({
  title,
  form,
  setForm,
  onSubmit,
  onCancel,
  submitText,
  loading,
}: OfficeFormModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button onClick={onCancel}>
              <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Office Name *
              </label>
              <input
                required
                value={form.officeName}
                onChange={(e) =>
                  setForm({ ...form, officeName: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type
                </label>
                <input
                  value={form.officeType}
                  onChange={(e) =>
                    setForm({ ...form, officeType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Hours
                </label>
                <input
                  value={form.officeHours}
                  onChange={(e) =>
                    setForm({ ...form, officeHours: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address *
              </label>
              <input
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City *
                </label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State *
                </label>
                <input
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country
                </label>
                <input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
