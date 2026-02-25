"use client";

import React, { useState } from "react";
import { 
  Car, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Calendar,
  Fuel,
  Settings,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  registration: string;
  status: "active" | "maintenance" | "inactive";
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  lastService: string;
  nextService: string;
  driver: string;
  mileage: number;
}

const VehiclesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const vehicles: Vehicle[] = [
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      registration: "ABC-123",
      status: "active",
      fuelType: "hybrid",
      lastService: "2024-01-15",
      nextService: "2024-04-15",
      driver: "John Smith",
      mileage: 15420
    },
    {
      id: "2",
      make: "Ford",
      model: "Ranger",
      year: 2023,
      registration: "XYZ-789",
      status: "maintenance",
      fuelType: "diesel",
      lastService: "2024-02-01",
      nextService: "2024-05-01",
      driver: "Sarah Johnson",
      mileage: 8750
    },
    {
      id: "3",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      registration: "EVS-001",
      status: "active",
      fuelType: "electric",
      lastService: "2024-01-20",
      nextService: "2024-07-20",
      driver: "Mike Chen",
      mileage: 12300
    },
    {
      id: "4",
      make: "Hyundai",
      model: "i30",
      year: 2021,
      registration: "HYU-456",
      status: "inactive",
      fuelType: "petrol",
      lastService: "2023-12-10",
      nextService: "2024-03-10",
      driver: "Unassigned",
      mileage: 28900
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.registration.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  const stats = [
    { label: "Total Vehicles", value: vehicles.length, icon: Car, color: "bg-blue-500" },
    { label: "Active", value: vehicles.filter(v => v.status === "active").length, icon: CheckCircle, color: "bg-green-500" },
    { label: "In Maintenance", value: vehicles.filter(v => v.status === "maintenance").length, icon: Settings, color: "bg-yellow-500" },
    { label: "Service Due", value: vehicles.filter(v => {
      const nextService = new Date(v.nextService);
      const today = new Date();
      const daysUntilService = Math.ceil((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilService <= 30;
    }).length, icon: AlertTriangle, color: "bg-red-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Fleet Management</h2>
          <p className="text-gray-600 mt-1">Manage your agency vehicles and track maintenance schedules</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by make, model, or registration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mileage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getFuelIcon(vehicle.fuelType)}</div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">{vehicle.year}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">{vehicle.registration}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.mileage.toLocaleString()} km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(vehicle.nextService).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-amber-600 hover:text-amber-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vehicle Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Vehicle</h3>
            <p className="text-gray-600 mb-4">Vehicle addition form would go here...</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesTab;
