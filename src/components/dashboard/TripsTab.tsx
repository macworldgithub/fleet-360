"use client";
import React, { useState, useEffect } from "react";
import {
  Route,
  Search,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Filter,
} from "lucide-react";
import { Button, Tag, Space, Typography } from "antd";
import { DataTable } from "@/src/components/dashboard/DataTable";
import { FormModal } from "@/src/components/dashboard/FormModal";
import toast from "react-hot-toast";
import type { ColumnsType } from "antd/es/table";
import { tripService, KmLog, KmLogFilters, KmLogPayload } from "@/src/api/Trip";
import { useAuth } from "@/src/api/auth";

const { Text, Title } = Typography;

const TRIP_TYPES = ["BUSINESS", "PRIVATE", "COMMUTE"] as const;

const tripTypeColors: Record<string, string> = {
  BUSINESS: "blue",
  PRIVATE: "green",
  COMMUTE: "orange",
};

export default function TripsTab() {
  const { agency } = useAuth();

  // Filters
  const [filters, setFilters] = useState<KmLogFilters>({
    vehicleId: "",
    officeId: "",
    tripType: undefined,
    fromDate: "",
    toDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<KmLogFilters>({});

  // Data
  const [trips, setTrips] = useState<KmLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<KmLog | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Delete state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KmLog | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  const [form, setForm] = useState<KmLogPayload>({
    vehicleId: "",
    officeId: "",
    tripDate: "",
    startOdometerInKms: 0,
    endOdometerInKms: 0,
    tripType: "BUSINESS",
    notes: "",
    businessPurpose: "",
  });

  // Load trips
  const loadTrips = async (activeFilters?: KmLogFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripService.getKmLogs(activeFilters);
      setTrips(data);
    } catch (err: any) {
      setError(err.message || "Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips(appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilters = () => {
    const cleanFilters: KmLogFilters = {};
    if (filters.vehicleId) cleanFilters.vehicleId = filters.vehicleId;
    if (filters.officeId) cleanFilters.officeId = filters.officeId;
    if (filters.tripType) cleanFilters.tripType = filters.tripType;
    if (filters.fromDate) cleanFilters.fromDate = filters.fromDate;
    if (filters.toDate) cleanFilters.toDate = filters.toDate;
    setAppliedFilters(cleanFilters);
    loadTrips(cleanFilters);
  };

  const handleClearFilters = () => {
    const cleared: KmLogFilters = {
      vehicleId: "",
      officeId: "",
      tripType: undefined,
      fromDate: "",
      toDate: "",
    };
    setFilters(cleared);
    setAppliedFilters({});
    setSearchTerm("");
    loadTrips({});
  };

  const handleEditTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrip) return;

    setLoadingAction(editingTrip._id);
    try {
      const updated = await tripService.updateKmLog(editingTrip._id, form);
      setTrips((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
      setShowEditForm(false);
      setEditingTrip(null);
      toast.success("Trip updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update trip");
    } finally {
      setLoadingAction(null);
    }
  };

  const openEditModal = async (trip: KmLog) => {
    try {
      const full = await tripService.getKmLogById(trip._id);
      setEditingTrip(full);
      setForm({
        vehicleId: full.vehicleId || "",
        officeId: full.officeId || "",
        tripDate: full.tripDate ? full.tripDate.substring(0, 10) : "",
        startOdometerInKms: full.startOdometerInKms,
        endOdometerInKms: full.endOdometerInKms,
        tripType: full.tripType || "BUSINESS",
        notes: full.notes || "",
        businessPurpose: full.businessPurpose || "",
      });
      setShowEditForm(true);
    } catch {
      toast.error("Could not load trip details");
    }
  };

  const openDeleteModal = (trip: KmLog) => {
    setDeleteTarget(trip);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTrip = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      await tripService.deleteKmLog(deleteTarget._id);
      setTrips((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
      toast.success("Trip deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trip");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredTrips = trips.filter((t) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      t.tripType.toLowerCase().includes(lower) ||
      (t.notes || "").toLowerCase().includes(lower) ||
      (t.businessPurpose || "").toLowerCase().includes(lower)
    );
  });

  const columns: ColumnsType<KmLog> = [
    {
      title: "Trip Date",
      dataIndex: "tripDate",
      key: "tripDate",
      render: (date) => <Text strong>{formatDate(date)}</Text>,
      sorter: (a, b) =>
        new Date(a.tripDate).getTime() - new Date(b.tripDate).getTime(),
    },
    {
      title: "Trip Type",
      dataIndex: "tripType",
      key: "tripType",
      render: (type) => (
        <Tag color={tripTypeColors[type] || "default"}>{type}</Tag>
      ),
    },
    {
      title: "Start Odometer (km)",
      dataIndex: "startOdometerInKms",
      key: "startOdometerInKms",
      render: (val) => <Text>{val?.toLocaleString()} km</Text>,
    },
    {
      title: "End Odometer (km)",
      dataIndex: "endOdometerInKms",
      key: "endOdometerInKms",
      render: (val) => <Text>{val?.toLocaleString()} km</Text>,
    },
    {
      title: "Distance (km)",
      dataIndex: "distanceInKms",
      key: "distanceInKms",
      render: (val) => <Tag color="geekblue">{val?.toLocaleString()} km</Tag>,
      sorter: (a, b) => a.distanceInKms - b.distanceInKms,
    },
    {
      title: "Purpose / Notes",
      key: "purpose",
      render: (_, record) => (
        <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
          {record.businessPurpose || record.notes || "—"}
        </Text>
      ),
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

  const TripFormFields = (
    <>
      {/* Trip Date */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Trip Date *
        </label>
        <input
          type="date"
          required
          value={form.tripDate}
          onChange={(e) => setForm({ ...form, tripDate: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
        />
      </div>

      {/* Trip Type */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Trip Type *
        </label>
        <select
          required
          value={form.tripType}
          onChange={(e) =>
            setForm({
              ...form,
              tripType: e.target.value as KmLogPayload["tripType"],
            })
          }
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
        >
          {TRIP_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Odometer readings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-black">
            Start Odometer (km) *
          </label>
          <input
            type="number"
            required
            min={0}
            value={form.startOdometerInKms}
            onChange={(e) =>
              setForm({ ...form, startOdometerInKms: Number(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-black">
            End Odometer (km) *
          </label>
          <input
            type="number"
            required
            min={0}
            value={form.endOdometerInKms}
            onChange={(e) =>
              setForm({ ...form, endOdometerInKms: Number(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
          />
        </div>
      </div>

      {/* Vehicle ID */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Vehicle ID *
        </label>
        <input
          required
          value={form.vehicleId}
          onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
          placeholder="e.g. 69a7daab7766bca292efe780"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />
      </div>

      {/* Office ID */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Office ID *
        </label>
        <input
          required
          value={form.officeId}
          onChange={(e) => setForm({ ...form, officeId: e.target.value })}
          placeholder="e.g. 69a2d0317a9510769822d9f6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />
      </div>

      {/* Business Purpose */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Business Purpose
        </label>
        <input
          value={form.businessPurpose || ""}
          onChange={(e) =>
            setForm({ ...form, businessPurpose: e.target.value })
          }
          placeholder="e.g. Meeting with client at their office"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1.5 text-black">
          Notes
        </label>
        <textarea
          value={form.notes || ""}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          placeholder="Additional notes..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6 p-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2}>Trips (KM Logs)</Title>
          <Text type="secondary">
            View and manage vehicle trip kilometre logs
          </Text>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-gray-700 text-sm">
            Filter Trips
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Vehicle ID */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Vehicle ID
            </label>
            <input
              value={filters.vehicleId || ""}
              onChange={(e) =>
                setFilters({ ...filters, vehicleId: e.target.value })
              }
              placeholder="Vehicle ID"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
            />
          </div>

          {/* Office ID */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Office ID
            </label>
            <input
              value={filters.officeId || ""}
              onChange={(e) =>
                setFilters({ ...filters, officeId: e.target.value })
              }
              placeholder="Office ID"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black placeholder-gray-400"
            />
          </div>

          {/* Trip Type */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Trip Type
            </label>
            <select
              value={filters.tripType || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tripType: (e.target.value as any) || undefined,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
            >
              <option value="">All Types</option>
              {TRIP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.fromDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.toDate || ""}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-black"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={handleApplyFilters}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C46A0A] text-white rounded-lg font-medium shadow-sm text-sm"
          >
            <Search size={15} />
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <X size={15} />
            Clear
          </button>
        </div>
      </div>

      {/* Search + Table */}
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
        <DataTable<KmLog>
          title="KM Logs"
          description="All vehicle trip kilometre records"
          dataSource={filteredTrips}
          columns={columns}
          loading={loading}
          emptyText="No trip logs found. Adjust filters and try again."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}

      {/* Edit Modal */}
      {showEditForm && editingTrip && (
        <FormModal
          title="Edit Trip Log"
          isOpen={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingTrip(null);
          }}
          onSubmit={handleEditTrip}
          submitText="Save Changes"
          submitLoading={loadingAction === editingTrip?._id}
          width="max-w-xl"
        >
          {TripFormFields}
        </FormModal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Trip Log
              </h3>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-gray-700">
                Are you sure you want to delete the trip log for{" "}
                <span className="font-semibold">
                  {new Date(deleteTarget.tripDate).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>{" "}
                (<span className="font-semibold">{deleteTarget.tripType}</span>{" "}
                — {deleteTarget.distanceInKms} km)?
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
                onClick={handleDeleteTrip}
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
