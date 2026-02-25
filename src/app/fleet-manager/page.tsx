"use client";

import React, { useState } from "react";
import {
  Car,
  MapPin,
  Wrench,
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  User,
  TrendingUp,
  Fuel,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/api/auth";
import FleetOverview from "@/src/components/dashboard/FleetOverview";
import MaintenanceSchedule from "@/src/components/dashboard/MaintenanceSchedule";
import FuelManagement from "@/src/components/dashboard/FuelManagement";
// import FleetOverview from "@/src/components/dashboard/FleetOverview";
// import MaintenanceSchedule from "@/src/components/dashboard/MaintenanceSchedule";
// import FuelManagement from "@/src/components/dashboard/FuelManagement";

type TabType = "overview" | "maintenance" | "fuel";

const FleetManagerDashboard: React.FC = () => {
  const router = useRouter();

  const { agency, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { id: "overview", label: "Fleet Overview", icon: Car },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "fuel", label: "Fuel Management", icon: Fuel },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <FleetOverview />;
      case "maintenance":
        return <MaintenanceSchedule />;
      case "fuel":
        return <FuelManagement />;
      default:
        return <FleetOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <div className="ml-4 flex items-center">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold px-3 py-2 text-sm rounded-lg shadow-lg">
                  FM
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    Fleet Manager Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">{agency?.agencyName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{agency?.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>FLEET MANAGER</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 bg-white border-r border-gray-200 shadow-sm overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
