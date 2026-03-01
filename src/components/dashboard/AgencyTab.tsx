"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Edit,
  Save,
  X,
  Calendar,
  Globe,
  AlertTriangle,
  Trash2,
  Plus
} from "lucide-react";
import { AgencyInfo } from "@/src/api/auth";
import { fetchAgencies, createAgency, updateAgency, deleteAgency, type Agency } from "@/src/api/agencies";

interface AgencyTabProps {
  agency: AgencyInfo | null;
}

const AgencyTab: React.FC<AgencyTabProps> = ({ agency }) => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [agenciesError, setAgenciesError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    agencyName: "",
    businessType: "",
    abn: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    subscriptionTier: "ESSENTIAL",
    role: "FLEET_MANAGER" as "PRINCIPAL" | "FLEET_MANAGER",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    agencyName: "",
    businessType: "",
    abn: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    subscriptionTier: "ESSENTIAL",
    role: "FLEET_MANAGER" as "PRINCIPAL" | "FLEET_MANAGER",
  });
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Agency | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setIsLoadingAgencies(true);
        setAgenciesError(null);
        const data = await fetchAgencies();
        setAgencies(data);
      } catch (err) {
        console.error("Failed to load agencies", err);
        setAgenciesError("Unable to load agencies. Please try again later.");
      } finally {
        setIsLoadingAgencies(false);
      }
    };

    loadAgencies();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
      };

      const created = await createAgency(payload);
      setAgencies((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      setForm({
        agencyName: "",
        businessType: "",
        abn: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        country: "",
        state: "",
        city: "",
        subscriptionTier: "ESSENTIAL",
        role: "FLEET_MANAGER",
      });
    } catch (err) {
      console.error("Failed to create agency", err);
      setFormError("Failed to create agency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (agencyToEdit: Agency) => {
    setSelectedAgencyId(agencyToEdit._id);
    setEditFormError(null);
    setEditForm({
      agencyName: agencyToEdit.agencyName || "",
      businessType: agencyToEdit.businessType || "",
      abn: agencyToEdit.abn || "",
      contactEmail: agencyToEdit.contactEmail || "",
      contactPhone: agencyToEdit.contactPhone || "",
      address: agencyToEdit.address || "",
      country: agencyToEdit.country || "",
      state: agencyToEdit.state || "",
      city: agencyToEdit.city || "",
      subscriptionTier: agencyToEdit.subscriptionTier || "ESSENTIAL",
      role: (agencyToEdit.role || "FLEET_MANAGER") as "PRINCIPAL" | "FLEET_MANAGER",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (agencyToDelete: Agency) => {
    setDeleteTarget(agencyToDelete);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await deleteAgency(deleteTarget._id);
      setAgencies((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      if (typeof window !== "undefined") {
        alert("Agency deleted successfully.");
      }
    } catch (err: any) {
      console.error("Failed to delete agency", err);
      const message = err?.response?.data?.message || "Failed to delete agency. Please try again.";
      if (typeof window !== "undefined") {
        alert(message);
      }
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgencyId) return;
    setEditFormError(null);
    setEditSubmitting(true);

    try {
      const payload = {
        ...editForm,
      };

      const updated = await updateAgency(selectedAgencyId, payload);
      setAgencies((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
      setIsEditModalOpen(false);
      setSelectedAgencyId(null);

      if (typeof window !== "undefined") {
        alert("Agency updated successfully.");
      }
    } catch (err: any) {
      console.error("Failed to update agency", err);
      const message =
        err?.response?.data?.message || "Failed to update agency. Please try again.";
      setEditFormError(message);
      if (typeof window !== "undefined") {
        alert(message);
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agency Information</h2>
         
        </div>
      </div>
      {/* Agencies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Agencies</h3>
            <p className="text-sm text-gray-600 mt-1">
              List of all agencies registered in the system.
            </p>
            {agenciesError && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>{agenciesError}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C46A0A] text-white text-sm font-semibold shadow-sm hover:bg-[#a85908] transition"
          >
            <Plus className="w-4 h-4" />
            Add Agency
          </button>
        </div>

        {isLoadingAgencies ? (
          <div className="p-6 text-sm text-gray-600">Loading agencies...</div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Agency
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Contact
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Location
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Role / Tier
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agencies.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-900">{item.agencyName}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.businessType}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div>{item.contactEmail}</div>
                      <div className="text-xs text-gray-500">{item.contactPhone}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div>{item.city}</div>
                      <div className="text-xs text-gray-500">{item.state}, {item.country}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div className="uppercase text-xs font-semibold text-gray-800">
                        {item.role || "FLEET_MANAGER"}
                      </div>
                      <div className="text-xs text-gray-500">Tier: {item.subscriptionTier}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => openEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-1"
                          onClick={() => openDeleteModal(item)}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Agency</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={form.agencyName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={form.businessType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ABN
                  </label>
                  <input
                    type="text"
                    name="abn"
                    value={form.abn}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={form.contactPhone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    name="subscriptionTier"
                    value={form.subscriptionTier}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  >
                    <option value="ESSENTIAL">ESSENTIAL</option>
                    <option value="OPTIMISED">OPTIMISED</option>
                    <option value="PARTNER">PARTNER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  >
                    <option value="PRINCIPAL">Principal</option>
                    <option value="FLEET_MANAGER">Fleet Manager</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-[#C46A0A] text-white text-sm font-semibold shadow-sm hover:bg-[#a85908] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Create Agency"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Agency</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
              {editFormError && (
                <div className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>{editFormError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={editForm.agencyName}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={editForm.businessType}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    ABN
                  </label>
                  <input
                    type="text"
                    name="abn"
                    value={editForm.abn}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={editForm.contactEmail}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={editForm.contactPhone}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={editForm.country}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={editForm.state}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    name="subscriptionTier"
                    value={editForm.subscriptionTier}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  >
                    <option value="ESSENTIAL">ESSENTIAL</option>
                    <option value="OPTIMISED">OPTIMISED</option>
                    <option value="PARTNER">PARTNER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C46A0A]/60 focus:border-[#C46A0A]"
                    required
                  >
                    <option value="PRINCIPAL">Principal</option>
                    <option value="FLEET_MANAGER">Fleet Manager</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-[#C46A0A] text-white text-sm font-semibold shadow-sm hover:bg-[#a85908] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={editSubmitting}
                >
                  {editSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Delete Agency</h3>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete
                {" "}
                <span className="font-semibold">{deleteTarget.agencyName}</span>?
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
                onClick={handleConfirmDelete}
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
};

export default AgencyTab;
