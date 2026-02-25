"use client";

import React, { useState } from "react";
import { 
  Car, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  MapPin,
  Fuel,
  Calendar,
  BarChart3
} from "lucide-react";

interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  inMaintenance: number;
  fuelEfficiency: number;
  totalDistance: number;
  maintenanceCost: number;
  fuelCost: number;
}

const FleetOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const fleetStats: FleetStats = {
    totalVehicles: 24,
    activeVehicles: 18,
    inMaintenance: 3,
    fuelEfficiency: 8.2,
    totalDistance: 45680,
    maintenanceCost: 12450,
    fuelCost: 28900
  };

  const recentActivities = [
    {
      id: 1,
      type: "maintenance",
      vehicle: "Toyota Camry - ABC-123",
      description: "Scheduled service completed",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "fuel",
      vehicle: "Ford Ranger - XYZ-789",
      description: "Fuel tank filled - 65L",
      time: "4 hours ago",
      status: "completed"
    },
    {
      id: 3,
      type: "alert",
      vehicle: "Tesla Model 3 - EVS-001",
      description: "Service due in 7 days",
      time: "6 hours ago",
      status: "pending"
    },
    {
      id: 4,
      type: "maintenance",
      vehicle: "Hyundai i30 - HYU-456",
      description: "Brake pads replacement needed",
      time: "1 day ago",
      status: "urgent"
    }
  ];

  const topPerformers = [
    { vehicle: "Toyota Camry - ABC-123", efficiency: 9.2, distance: 3420 },
    { vehicle: "Tesla Model 3 - EVS-001", efficiency: 15.8, distance: 2890 },
    { vehicle: "Ford Ranger - XYZ-789", efficiency: 7.1, distance: 4150 }
  ];

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "fuel":
        return <Fuel className="w-4 h-4 text-blue-500" />;
      case "alert":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    changeType?: "up" | "down"; 
    icon: any; 
    color: string; 
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === "up" ? "text-green-600" : "text-red-600"
            }`}>
              {changeType === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet Overview</h2>
          <p className="text-gray-600 mt-1">Monitor your fleet performance and key metrics</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={fleetStats.totalVehicles}
          icon={Car}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Vehicles"
          value={fleetStats.activeVehicles}
          change="+2 this week"
          changeType="up"
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="In Maintenance"
          value={fleetStats.inMaintenance}
          change="-1 this week"
          changeType="down"
          icon={AlertTriangle}
          color="bg-yellow-500"
        />
        <StatCard
          title="Avg Fuel Efficiency"
          value={`${fleetStats.fuelEfficiency} L/100km`}
          change="+0.3 this month"
          changeType="down"
          icon={Fuel}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  {getStatusIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.vehicle}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Top Performers
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">{performer.vehicle}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600">
                      {performer.efficiency} L/100km
                    </p>
                    <p className="text-xs text-gray-500">
                      {performer.distance.toLocaleString()} km
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cost Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Costs</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">${fleetStats.maintenanceCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">This month</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Fuel Costs</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">${fleetStats.fuelCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">This month</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Fuel className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;
