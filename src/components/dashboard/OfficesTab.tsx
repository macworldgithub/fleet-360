"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Users,
  Edit,
  Trash2,
  Building,
  Calendar
} from "lucide-react";

interface Office {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  manager: string;
  agents: number;
  established: string;
  status: "active" | "inactive";
}

const OfficesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const offices: Office[] = [
    {
      id: "1",
      name: "Head Office - Sydney",
      address: "Level 12, 123 Pitt Street",
      city: "Sydney",
      state: "NSW",
      postcode: "2000",
      phone: "+61 2 9876 5432",
      email: "sydney@aylasagency.com.au",
      manager: "John Smith",
      agents: 12,
      established: "2019",
      status: "active"
    },
    {
      id: "2",
      name: "Melbourne Branch",
      address: "Suite 5, 456 Collins Street",
      city: "Melbourne",
      state: "VIC",
      postcode: "3000",
      phone: "+61 3 8765 4321",
      email: "melbourne@aylasagency.com.au",
      manager: "Sarah Johnson",
      agents: 8,
      established: "2021",
      status: "active"
    },
    {
      id: "3",
      name: "Brisbane Office",
      address: "Level 3, 789 Queen Street",
      city: "Brisbane",
      state: "QLD",
      postcode: "4000",
      phone: "+61 7 5432 1098",
      email: "brisbane@aylasagency.com.au",
      manager: "Mike Chen",
      agents: 4,
      established: "2022",
      status: "active"
    }
  ];

  const filteredOffices = offices.filter(office => 
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  const stats = [
    { label: "Total Offices", value: offices.length, icon: Building, color: "bg-blue-500" },
    { label: "Active Offices", value: offices.filter(o => o.status === "active").length, icon: MapPin, color: "bg-green-500" },
    { label: "Total Agents", value: offices.reduce((sum, office) => sum + office.agents, 0), icon: Users, color: "bg-purple-500" },
    { label: "States Covered", value: [...new Set(offices.map(o => o.state))].length, icon: MapPin, color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Office Locations</h2>
          <p className="text-gray-600 mt-1">Manage your agency offices and branch locations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Office</span>
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

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search offices by name, city, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffices.map((office) => (
          <div key={office.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Office Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{office.name}</h3>
                    <p className="text-amber-100 text-sm">{office.city}, {office.state}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  office.status === "active" 
                    ? "bg-white/20 text-white" 
                    : "bg-gray-500/20 text-gray-200"
                }`}>
                  {office.status}
                </span>
              </div>
            </div>

            {/* Office Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{office.address}</p>
                  <p className="text-sm text-gray-600">{office.city}, {office.state} {office.postcode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-900">{office.phone}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-900">{office.email}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{office.manager}</span> • {office.agents} agents
                  </p>
                  <p className="text-xs text-gray-500">Manager • Team size</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-900">Established {office.established}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium text-sm">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Office Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Office</h3>
            <p className="text-gray-600 mb-4">Office addition form would go here...</p>
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
                Add Office
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficesTab;
