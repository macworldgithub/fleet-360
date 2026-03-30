"use client";

import React, { useEffect, useState } from "react";
import { Modal, Spin, Descriptions, Typography, Divider, Card } from "antd";
import { fetchVehicleCostSummary, fetchVehicleCostBreakdown, CostSummary, CostBreakdown } from "@/src/api/costIntelligence";
import { DollarOutlined, BarChartOutlined, DashboardOutlined, ToolOutlined, WarningOutlined, ApiOutlined, CarOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

interface CostIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string | null;
  vehicleName: string;
}

export const CostIntelligenceModal: React.FC<CostIntelligenceModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  vehicleName,
}) => {
  const [loading, setLoading] = useState(false);
  const [costData, setCostData] = useState<CostSummary | null>(null);
  const [breakdownData, setBreakdownData] = useState<CostBreakdown | null>(null);

  useEffect(() => {
    if (isOpen && vehicleId) {
      loadData(vehicleId);
    } else {
      setCostData(null);
      setBreakdownData(null);
    }
  }, [isOpen, vehicleId]);

  const loadData = async (id: string) => {
    setLoading(true);
    try {
      const [summary, breakdown] = await Promise.all([
        fetchVehicleCostSummary(id),
        fetchVehicleCostBreakdown(id)
      ]);
      setCostData(summary);
      setBreakdownData(breakdown);
    } catch (error) {
      toast.error("Failed to load cost intelligence data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDistance = (value: number) => {
    return `${new Intl.NumberFormat("en-US").format(value)} km`;
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-indigo-700">
          <BarChartOutlined className="text-xl" />
          <span className="text-xl font-bold">Cost Intelligence</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      <div className="py-4">
        <Typography.Paragraph className="text-gray-600 mb-6">
          Cost summary for <span className="font-semibold text-gray-900">{vehicleName}</span>
        </Typography.Paragraph>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spin size="large" />
          </div>
        ) : costData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-100 shadow-sm" bodyStyle={{ padding: "16px" }}>
                <div className="flex flex-col">
                  <span className="text-blue-600 text-sm font-semibold mb-1 flex items-center gap-1">
                    <DollarOutlined /> Total Cost
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(costData.totalCost)}</span>
                </div>
              </Card>

              <Card className="bg-emerald-50 border-emerald-100 shadow-sm" bodyStyle={{ padding: "16px" }}>
                <div className="flex flex-col">
                  <span className="text-emerald-700 text-sm font-semibold mb-1 flex items-center gap-1">
                    <DashboardOutlined /> Total Distance
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{formatDistance(costData.totalDistance)}</span>
                </div>
              </Card>

              <Card className="bg-amber-50 border-amber-100 shadow-sm" bodyStyle={{ padding: "16px" }}>
                <div className="flex flex-col">
                  <span className="text-amber-700 text-sm font-semibold mb-1 flex items-center gap-1">
                    <ApiOutlined /> Cost Per Km
                  </span>
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(costData.costPerKm)}</span>
                </div>
              </Card>
            </div>

            <Card className="shadow-sm border-gray-200">
              
              {breakdownData && breakdownData.totalCost > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Cost Composition</h4>
                  <div className="w-full h-4 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
                    <div style={{ width: `${(breakdownData.purchaseCost / breakdownData.totalCost) * 100}%` }} className="bg-indigo-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Purchase: ${formatCurrency(breakdownData.purchaseCost)}`} />
                    <div style={{ width: `${(breakdownData.fuelCost / breakdownData.totalCost) * 100}%` }} className="bg-blue-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Fuel: ${formatCurrency(breakdownData.fuelCost)}`} />
                    <div style={{ width: `${(breakdownData.maintenanceCost / breakdownData.totalCost) * 100}%` }} className="bg-orange-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Maintenance: ${formatCurrency(breakdownData.maintenanceCost)}`} />
                    <div style={{ width: `${(breakdownData.incidentRepairCost / breakdownData.totalCost) * 100}%` }} className="bg-red-500 hover:opacity-90 transition-opacity cursor-pointer" title={`Incidents: ${formatCurrency(breakdownData.incidentRepairCost)}`} />
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></span> Purchase</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span> Fuel</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></span> Maintenance</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></span> Incidents</div>
                  </div>
                  <Divider className="my-4" />
                </div>
              )}

              <Descriptions
                title="Detailed Breakdown"
                bordered
                column={1}
                size="small"
                labelStyle={{ fontWeight: "600", width: "40%" }}
              >
                <Descriptions.Item label="Purchase Cost">
                  <span className="flex items-center gap-2">
                    <CarOutlined className="text-indigo-500" />
                    {formatCurrency(costData.purchaseCost)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Fuel Cost">
                  <span className="flex items-center gap-2">
                    <DashboardOutlined className="text-blue-500" />
                    {formatCurrency(costData.fuelCost)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Maintenance Cost">
                  <span className="flex items-center gap-2">
                    <ToolOutlined className="text-orange-500" />
                    {formatCurrency(costData.maintenanceCost)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Incident Repair Cost">
                  <span className="flex items-center gap-2">
                    <WarningOutlined className="text-red-500" />
                    {breakdownData ? formatCurrency(breakdownData.incidentRepairCost) : formatCurrency(costData.incidentCost)}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Total Running Cost">
                  <span className="font-semibold text-indigo-600">
                    {formatCurrency(costData.totalRunningCost)}
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No cost intelligence data available.
          </div>
        )}
      </div>
    </Modal>
  );
};
