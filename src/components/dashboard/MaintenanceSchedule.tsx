"use client";

import React, { useEffect, useState } from "react";
import { Wrench, AlertCircle } from "lucide-react";
import { Select, Tag, Typography, Space, Button, Dropdown } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DataTable } from "@/src/components/dashboard/DataTable";
import {
  maintenanceService,
  type Maintenance,
  type MaintenanceStatus,
} from "@/src/api/maintenance";
import { FormModal } from "@/src/components/dashboard/FormModal";
import toast from "react-hot-toast";
import { DownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const STATUS_OPTIONS: MaintenanceStatus[] = [
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const MaintenanceSchedule: React.FC = () => {
  const [status, setStatus] = useState<MaintenanceStatus>("SUBMITTED");
  const [items, setItems] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const [detailVehicleId, setDetailVehicleId] = useState<string | null>(null);
  const [detailItems, setDetailItems] = useState<Maintenance[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  // Complete maintenance modal: enter actual cost, then show result
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<Maintenance | null>(null);
  const [actualCostInput, setActualCostInput] = useState<string>("");
  const [completeSubmitting, setCompleteSubmitting] = useState(false);
  const [completedResult, setCompletedResult] = useState<Maintenance | null>(null);

  const loadByStatus = async (selectedStatus: MaintenanceStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await maintenanceService.getByStatus(selectedStatus);
      setItems(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load maintenance records");
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleDetails = async (vehicleId: string) => {
    setDetailVehicleId(vehicleId);
    setDetailLoading(true);
    setDetailOpen(true);
    try {
      const data = await maintenanceService.getByVehicle(vehicleId);
      setDetailItems(data);
    } catch {
      setDetailItems([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusChange = async (
    record: Maintenance,
    newStatus: "APPROVED" | "REJECTED" | "COMPLETED"
  ) => {
    if (newStatus === "COMPLETED") {
      setCompleteTarget(record);
      setActualCostInput(
        record.actualCost != null ? String(record.actualCost) : ""
      );
      setCompletedResult(null);
      setCompleteModalOpen(true);
      return;
    }
    try {
      setStatusUpdatingId(record._id);
      const updated = await maintenanceService.updateStatus(record._id, {
        status: newStatus,
      });
      setItems((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      toast.success(
        newStatus === "REJECTED"
          ? "Maintenance rejected"
          : "Maintenance approved"
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;
    const cost = parseFloat(actualCostInput);
    if (Number.isNaN(cost) || cost < 0) {
      toast.error("Please enter a valid actual cost");
      return;
    }
    try {
      setCompleteSubmitting(true);
      const updated = await maintenanceService.updateStatus(completeTarget._id, {
        status: "COMPLETED",
        actualCost: cost,
      });
      setCompletedResult(updated);
      setItems((prev) =>
        prev.map((m) => (m._id === updated._id ? updated : m))
      );
      toast.success("Maintenance completed");
    } catch (err: any) {
      toast.error(err?.message || "Failed to complete maintenance");
    } finally {
      setCompleteSubmitting(false);
    }
  };

  const closeCompleteModal = () => {
    setCompleteModalOpen(false);
    setCompleteTarget(null);
    setActualCostInput("");
    setCompletedResult(null);
  };

  useEffect(() => {
    loadByStatus(status);
  }, [status]);

  const statusTagColor = (s: string) => {
    switch (s) {
      case "SUBMITTED":
        return "processing";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "error";
      case "COMPLETED":
        return "default";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<Maintenance> = [
    {
      title: "Vehicle ID",
      dataIndex: "vehicleId",
      key: "vehicleId",
      render: (val) => <Text code>{val}</Text>,
    },
    {
      title: "Type",
      dataIndex: "maintenanceType",
      key: "maintenanceType",
      render: (val) => <Text>{val}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Odometer (km)",
      dataIndex: "odometerAtRequest",
      key: "odometerAtRequest",
      render: (v) => (v != null ? v.toLocaleString() : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string, record: Maintenance) => {
        const actionable = s === "SUBMITTED" || s === "APPROVED";
        const busy = statusUpdatingId === record._id;

        if (!actionable) {
          return <Tag color={statusTagColor(s)}>{s}</Tag>;
        }

        const items =
          s === "SUBMITTED"
            ? [
                {
                  key: "approve",
                  label: "Approved",
                  disabled: busy,
                  onClick: () => handleStatusChange(record, "APPROVED"),
                },
                {
                  key: "reject",
                  label: "Reject",
                  disabled: busy,
                  onClick: () => handleStatusChange(record, "REJECTED"),
                },
              ]
            : [
                {
                  key: "complete",
                  label: "Completed",
                  disabled: busy,
                  onClick: () => handleStatusChange(record, "COMPLETED"),
                },
              ];

        return (
          <Dropdown
            trigger={["click"]}
            placement="bottomLeft"
            menu={{ items }}
          >
            <Tag
              color={statusTagColor(s)}
              className="cursor-pointer select-none inline-flex items-center gap-1"
            >
              {s} <DownOutlined style={{ fontSize: 10 }} />
            </Tag>
          </Dropdown>
        );
      },
    },
    {
      title: "Scheduled Date",
      dataIndex: "scheduledServiceDate",
      key: "scheduledServiceDate",
      render: (d) =>
        d ? new Date(d).toLocaleDateString() : "—",
    },
    {
      title: "Completed At",
      dataIndex: "completedAt",
      key: "completedAt",
      render: (d) =>
        d ? new Date(d).toLocaleDateString() : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => loadVehicleDetails(record.vehicleId)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const detailRecord = detailItems[0] || null;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <Title level={3} className="!mb-0">
              Maintenance
            </Title>
            <Text type="secondary">
              View maintenance requests by status and per vehicle
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Text className="mr-1">Status:</Text>
          <Select
            value={status}
            onChange={(val: MaintenanceStatus) => setStatus(val)}
            options={STATUS_OPTIONS.map((s) => ({
              value: s,
              label: s,
            }))}
            className="min-w-[180px]"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <Text type="danger">{error}</Text>
        </div>
      )}

      <DataTable<Maintenance>
        title="Maintenance Requests"
        description="Filtered by selected status"
        dataSource={items}
        columns={columns}
        loading={loading}
        emptyText="No maintenance records found for this status"
      />

      <FormModal
        title={
          detailVehicleId
            ? `Vehicle Maintenance History (${detailVehicleId})`
            : "Vehicle Maintenance History"
        }
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setDetailItems([]);
          setDetailVehicleId(null);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          setDetailOpen(false);
        }}
        submitText="Close"
        submitDisabled
        width="max-w-3xl"
      >
        {detailLoading ? (
          <div className="py-8 text-center">
            <Text>Loading...</Text>
          </div>
        ) : !detailRecord ? (
          <div className="py-8 text-center">
            <Text type="secondary">
              No maintenance history for this vehicle
            </Text>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-gray-900 font-semibold">Vehicle ID</Text>
                <div className="font-medium break-all text-gray-900">
                  {detailRecord.vehicleId}
                </div>
              </div>
              <div>
                <Text className="text-gray-900 font-semibold">
                  Maintenance Type
                </Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.maintenanceType}
                </div>
              </div>
              <div>
                <Text className="text-gray-900 font-semibold">Status</Text>
                <div className="font-medium text-gray-900">
                  <Tag color={statusTagColor(detailRecord.status)}>
                    {detailRecord.status}
                  </Tag>
                </div>
              </div>
              <div>
                <Text className="text-gray-900 font-semibold">Workshop</Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.workshopName || "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-gray-900 font-semibold">
                  Odometer at Request (km)
                </Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.odometerAtRequest != null
                    ? detailRecord.odometerAtRequest.toLocaleString()
                    : "—"}
                </div>
              </div>
              <div>
                <Text className="text-gray-900 font-semibold">
                  Next Service Due (km)
                </Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.nextServiceDueAtKm != null
                    ? detailRecord.nextServiceDueAtKm.toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-gray-900 font-semibold">
                  Scheduled Service Date
                </Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.scheduledServiceDate
                    ? new Date(
                        detailRecord.scheduledServiceDate,
                      ).toLocaleString()
                    : "—"}
                </div>
              </div>
              <div>
                <Text className="text-gray-900 font-semibold">
                  Completed At
                </Text>
                <div className="font-medium text-gray-900">
                  {detailRecord.completedAt
                    ? new Date(detailRecord.completedAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>

            <div>
              <Text className="text-gray-900 font-semibold">Description</Text>
              <div className="font-medium mt-1 text-gray-900">
                {detailRecord.description || "—"}
              </div>
            </div>
          </div>
        )}
      </FormModal>

      {/* Complete maintenance: enter actual cost, then show result */}
      <FormModal
        title={completedResult ? "Maintenance Completed" : "Complete Maintenance"}
        isOpen={completeModalOpen}
        onClose={closeCompleteModal}
        onSubmit={(e) => {
          e.preventDefault();
          if (completedResult) closeCompleteModal();
          else handleCompleteSubmit(e);
        }}
        submitText={completedResult ? "Close" : "Complete"}
        submitLoading={completeSubmitting}
        width="max-w-md"
      >
        {completedResult ? (
          <div className="space-y-3">
            <Text className="text-gray-900 font-semibold block">
              Actual cost
            </Text>
            <p className="text-xl font-bold text-gray-900">
              ${completedResult.actualCost != null
                ? Number(completedResult.actualCost).toLocaleString()
                : "—"}
            </p>
          </div>
        ) : completeTarget ? (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1.5">
              Actual cost *
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              required
              value={actualCostInput}
              onChange={(e) => setActualCostInput(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-gray-900"
              placeholder="e.g. 1200"
            />
          </div>
        ) : null}
      </FormModal>
    </div>
  );
};

export default MaintenanceSchedule;

