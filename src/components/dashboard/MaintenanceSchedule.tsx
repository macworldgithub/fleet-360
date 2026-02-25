"use client";

import React, { useState } from "react";
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Car,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

interface MaintenanceTask {
  id: string;
  vehicleId: string;
  vehicle: string;
  registration: string;
  task: string;
  scheduledDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "scheduled" | "in-progress" | "completed" | "overdue";
  estimatedCost: number;
  mechanic: string;
  notes: string;
}

const MaintenanceSchedule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const maintenanceTasks: MaintenanceTask[] = [
    {
      id: "1",
      vehicleId: "1",
      vehicle: "Toyota Camry",
      registration: "ABC-123",
      task: "Regular Service - Oil Change & Filter",
      scheduledDate: "2024-03-15",
      priority: "medium",
      status: "scheduled",
      estimatedCost: 250,
      mechanic: "John's Auto Service",
      notes: "Regular 6-month service"
    },
    {
      id: "2",
      vehicleId: "2",
      vehicle: "Ford Ranger",
      registration: "XYZ-789",
      task: "Brake Pad Replacement",
      scheduledDate: "2024-03-10",
      priority: "high",
      status: "in-progress",
      estimatedCost: 450,
      mechanic: "Quick Fix Garage",
      notes: "Front brakes worn, needs immediate attention"
    },
    {
      id: "3",
      vehicleId: "3",
      vehicle: "Tesla Model 3",
      registration: "EVS-001",
      task: "Annual Inspection",
      scheduledDate: "2024-02-28",
      priority: "urgent",
      status: "overdue",
      estimatedCost: 200,
      mechanic: "Tesla Service Center",
      notes: "Annual safety inspection required"
    },
    {
      id: "4",
      vehicleId: "4",
      vehicle: "Hyundai i30",
      registration: "HYU-456",
      task: "Tire Rotation & Balance",
      scheduledDate: "2024-03-20",
      priority: "low",
      status: "scheduled",
      estimatedCost: 80,
      mechanic: "Tire Plus",
      notes: "Regular tire maintenance"
    }
  ];

  const filteredTasks = maintenanceTasks.filter(task => {
    const matchesSearch = task.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.task.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const stats = [
    {
      label: "Scheduled",
      value: maintenanceTasks.filter(t => t.status === "scheduled").length,
      icon: Calendar,
      color: "bg-yellow-500"
    },
    {
      label: "In Progress",
      value: maintenanceTasks.filter(t => t.status === "in-progress").length,
      icon: Clock,
      color: "bg-blue-500"
    },
    {
      label: "Completed",
      value: maintenanceTasks.filter(t => t.status === "completed").length,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      label: "Overdue",
      value: maintenanceTasks.filter(t => t.status === "overdue").length,
      icon: AlertTriangle,
      color: "bg-red-500"
    }
  ];

  const totalEstimatedCost = maintenanceTasks
    .filter(t => t.status !== "completed")
    .reduce((sum, task) => sum + task.estimatedCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h2>
          <p className="text-gray-600 mt-1">Manage and track vehicle maintenance tasks</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium">
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
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
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Total Estimated Cost</h3>
            <p className="text-sm text-gray-600 mt-1">For pending maintenance tasks</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">${totalEstimatedCost.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{maintenanceTasks.filter(t => t.status !== "completed").length} tasks</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by vehicle, registration, or task..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="pl-3 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scheduled Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Est. Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Car className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.vehicle}</div>
                        <div className="text-sm text-gray-500">{task.registration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{task.task}</div>
                    <div className="text-sm text-gray-500">{task.mechanic}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(task.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${task.estimatedCost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
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
    </div>
  );
};

export default MaintenanceSchedule;
