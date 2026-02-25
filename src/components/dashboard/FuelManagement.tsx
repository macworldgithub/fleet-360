"use client";

import React, { useState } from "react";
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Calendar,
  DollarSign,
  BarChart3,
  Plus,
  Search,
  Filter,
  Download
} from "lucide-react";

interface FuelRecord {
  id: string;
  vehicleId: string;
  vehicle: string;
  registration: string;
  date: string;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  volume: number;
  cost: number;
  odometer: number;
  location: string;
  driver: string;
  efficiency: number;
}

const FuelManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const fuelRecords: FuelRecord[] = [
    {
      id: "1",
      vehicleId: "1",
      vehicle: "Toyota Camry",
      registration: "ABC-123",
      date: "2024-02-25",
      fuelType: "hybrid",
      volume: 35,
      cost: 65.50,
      odometer: 15420,
      location: "Shell Station, Sydney CBD",
      driver: "John Smith",
      efficiency: 6.2
    },
    {
      id: "2",
      vehicleId: "2",
      vehicle: "Ford Ranger",
      registration: "XYZ-789",
      date: "2024-02-24",
      fuelType: "diesel",
      volume: 65,
      cost: 125.30,
      odometer: 8750,
      location: "BP Service, Parramatta",
      driver: "Sarah Johnson",
      efficiency: 9.8
    },
    {
      id: "3",
      vehicleId: "3",
      vehicle: "Tesla Model 3",
      registration: "EVS-001",
      date: "2024-02-23",
      fuelType: "electric",
      volume: 45,
      cost: 18.00,
      odometer: 12300,
      location: "Tesla Supercharger, Chatswood",
      driver: "Mike Chen",
      efficiency: 15.8
    },
    {
      id: "4",
      vehicleId: "4",
      vehicle: "Hyundai i30",
      registration: "HYU-456",
      date: "2024-02-22",
      fuelType: "petrol",
      volume: 40,
      cost: 78.20,
      odometer: 28900,
      location: "Caltex, North Sydney",
      driver: "Emma Wilson",
      efficiency: 8.1
    }
  ];

  const filteredRecords = fuelRecords.filter(record => {
    const matchesSearch = record.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.driver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFuelType = fuelTypeFilter === "all" || record.fuelType === fuelTypeFilter;
    return matchesSearch && matchesFuelType;
  });

  const getFuelIcon = (fuelType: string) => {
    switch (fuelType) {
      case "electric":
        return "⚡";
      case "hybrid":
        return "🔋";
      case "diesel":
        return "🛢️";
      default:
        return "⛽";
    }
  };

  const getFuelColor = (fuelType: string) => {
    switch (fuelType) {
      case "electric":
        return "bg-green-100 text-green-800";
      case "hybrid":
        return "bg-blue-100 text-blue-800";
      case "diesel":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const totalFuelCost = fuelRecords.reduce((sum, record) => sum + record.cost, 0);
  const totalVolume = fuelRecords.reduce((sum, record) => sum + record.volume, 0);
  const avgEfficiency = fuelRecords.reduce((sum, record) => sum + record.efficiency, 0) / fuelRecords.length;

  const stats = [
    {
      label: "Total Fuel Cost",
      value: `$${totalFuelCost.toFixed(2)}`,
      change: "+12% vs last month",
      changeType: "up" as const,
      icon: DollarSign,
      color: "bg-red-500"
    },
    {
      label: "Total Volume",
      value: `${totalVolume}L`,
      change: "+8% vs last month",
      changeType: "up" as const,
      icon: Fuel,
      color: "bg-blue-500"
    },
    {
      label: "Avg Efficiency",
      value: `${avgEfficiency.toFixed(1)} L/100km`,
      change: "-5% vs last month",
      changeType: "down" as const,
      icon: TrendingDown,
      color: "bg-green-500"
    },
    {
      label: "Refuels",
      value: fuelRecords.length,
      change: "+2 vs last month",
      changeType: "up" as const,
      icon: BarChart3,
      color: "bg-purple-500"
    }
  ];

  const fuelTypeStats = [
    { type: "Petrol", count: fuelRecords.filter(r => r.fuelType === "petrol").length, cost: fuelRecords.filter(r => r.fuelType === "petrol").reduce((sum, r) => sum + r.cost, 0) },
    { type: "Diesel", count: fuelRecords.filter(r => r.fuelType === "diesel").length, cost: fuelRecords.filter(r => r.fuelType === "diesel").reduce((sum, r) => sum + r.cost, 0) },
    { type: "Electric", count: fuelRecords.filter(r => r.fuelType === "electric").length, cost: fuelRecords.filter(r => r.fuelType === "electric").reduce((sum, r) => sum + r.cost, 0) },
    { type: "Hybrid", count: fuelRecords.filter(r => r.fuelType === "hybrid").length, cost: fuelRecords.filter(r => r.fuelType === "hybrid").reduce((sum, r) => sum + r.cost, 0) }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fuel Management</h2>
          <p className="text-gray-600 mt-1">Track fuel consumption and manage fuel expenses</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium">
            <Plus className="w-4 h-4" />
            <span>Add Fuel Record</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  {stat.change && (
                    <div className={`flex items-center mt-2 text-sm ${
                      stat.changeType === "up" ? "text-red-600" : "text-green-600"
                    }`}>
                      {stat.changeType === "up" ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fuel Records Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by vehicle, registration, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={fuelTypeFilter}
                  onChange={(e) => setFuelTypeFilter(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="all">All Fuel Types</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{getFuelIcon(record.fuelType)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.vehicle}</div>
                            <div className="text-sm text-gray-500">{record.registration}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.volume}L
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${record.cost.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.efficiency} L/100km
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fuel Type Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Fuel Type Breakdown</h3>
            </div>
            <div className="p-6 space-y-4">
              {fuelTypeStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {stat.type === "Petrol" ? "⛽" : 
                       stat.type === "Diesel" ? "🛢️" : 
                       stat.type === "Electric" ? "⚡" : "🔋"}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stat.type}</p>
                      <p className="text-xs text-gray-500">{stat.count} refuels</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">${stat.cost.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total cost</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Fuel Efficiency Tip</h3>
            <p className="text-sm opacity-90">
              Regular maintenance and proper tire inflation can improve fuel efficiency by up to 10%. 
              Consider scheduling regular check-ups for your fleet vehicles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelManagement;
