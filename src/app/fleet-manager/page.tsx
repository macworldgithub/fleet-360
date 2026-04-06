"use client";

import React, { useState, useEffect } from "react";
import {
  Car,
  MapPin,
  Users,
  Menu,
  X,
  Home,
  LogOut,
  User,
  TrendingUp,
  Wrench,
  Settings,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/api/auth";
import OfficesTab from "@/src/components/dashboard/OfficesTab";
import VehiclesTab from "@/src/components/dashboard/VehiclesTab";
import DriversTab from "@/src/components/dashboard/DriversTab";
import MaintenanceSchedule from "@/src/components/dashboard/MaintenanceSchedule";
import IncidentsTab from "@/src/components/dashboard/incidents";
import KMLogsTab from "@/src/components/dashboard/KMLogsTab";
import StatsTab from "@/src/components/dashboard/StatsTab";

type TabType = "stats" | "offices" | "vehicles" | "drivers" | "maintenance" | "incidents" | "km-logs";

const FleetManagerDashboard: React.FC = () => {
  const router = useRouter();

  const { agency, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("stats");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuItems = [
    { id: "stats", label: "Stats", icon: TrendingUp },
    { id: "offices", label: "Offices", icon: MapPin },
    { id: "vehicles", label: "Vehicles", icon: Car },
    { id: "drivers", label: "Drivers", icon: Users },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "incidents", label: "Incidents", icon: Settings },
    { id: "km-logs", label: "KM Logs", icon: FileText },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "stats":
        return <StatsTab />;
      case "offices":
        return <OfficesTab />;
      case "vehicles":
        return <VehiclesTab />;
      case "drivers":
        return <DriversTab />;
      case "maintenance":
        return <MaintenanceSchedule />;
      case "incidents":
        return <IncidentsTab />;
      case "km-logs":
        return <KMLogsTab />;
      default:
        return <StatsTab />;
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-50 to-gray-100">
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
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold px-3 py-2 text-sm rounded-lg shadow-lg">
                  FM
                </div>
                <div className="ml-3">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    Fleet Manager Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                    {agency?.agencyName}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="truncate max-w-[150px]">{agency?.contactEmail}</span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs px-3 py-1 bg-amber-100 text-amber-800 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>FLEET MANAGER</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-2 sm:px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-6rem)]">
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
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
        <main className="flex-1 p-6 min-w-0">
          <div className="max-w-7xl mx-auto">{renderTabContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default FleetManagerDashboard;
