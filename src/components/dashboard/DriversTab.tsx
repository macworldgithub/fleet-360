"use client";

import React from "react";
import { User, Phone, Car, MapPin } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  office: string;
  status: "active" | "inactive";
}

const sampleDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+61 400 123 456",
    vehicle: "Toyota Camry · ABC-123",
    office: "Head Office - Sydney",
    status: "active",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+61 400 987 654",
    vehicle: "Ford Ranger · XYZ-789",
    office: "Melbourne Branch",
    status: "active",
  },
  {
    id: "3",
    name: "Mike Chen",
    phone: "+61 400 555 999",
    vehicle: "Tesla Model 3 · EVS-001",
    office: "Brisbane Office",
    status: "inactive",
  },
];

const DriversTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Drivers</h2>
          <p className="text-gray-600 mt-1">
            View your fleet drivers and which vehicles and offices they are assigned to.
          </p>
        </div>
      </div>

      {/* Drivers list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {sampleDrivers.map((driver) => (
            <div key={driver.id} className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{driver.name}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{driver.phone}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Car className="w-3 h-3" />
                      <span>{driver.vehicle}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{driver.office}</span>
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${{
                  active: "bg-green-100 text-green-800",
                  inactive: "bg-gray-100 text-gray-700",
                }[driver.status]}`}
              >
                {driver.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DriversTab;
