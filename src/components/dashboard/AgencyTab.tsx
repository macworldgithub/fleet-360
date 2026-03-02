"use client";

import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Edit,
  Save,
  X,
  Calendar,
  Globe,
  AlertTriangle,
  Trash2
} from "lucide-react";
import { AgencyInfo } from "@/src/api/auth";
import { fetchAgencies, type Agency } from "@/src/api/agencies";

interface AgencyTabProps {
  agency: AgencyInfo | null;
}

const AgencyTab: React.FC<AgencyTabProps> = ({ agency }) => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [agenciesError, setAgenciesError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgencies = async () => {
      try {
        setIsLoadingAgencies(true);
        setAgenciesError(null);
        const data = await fetchAgencies();
        setAgencies(data);
      } catch (err) {
        console.error("Failed to load agencies", err);
        setAgenciesError("Unable to load agencies. Please try again later.");
      } finally {
        setIsLoadingAgencies(false);
      }
    };

    loadAgencies();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agency Information</h2>
         
        </div>
      </div>
      {/* Agencies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Agencies</h3>
            <p className="text-sm text-gray-600 mt-1">
              List of all agencies registered in the system.
            </p>
          </div>
          {agenciesError && (
            <div className="flex items-center text-sm text-red-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span>{agenciesError}</span>
            </div>
          )}
        </div>

        {isLoadingAgencies ? (
          <div className="p-6 text-sm text-gray-600">Loading agencies...</div>
        ) : (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Agency
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Contact
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Location
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Role / Tier
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500 uppercase tracking-wider text-xs text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {agencies.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-900">{item.agencyName}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.businessType}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div>{item.contactEmail}</div>
                      <div className="text-xs text-gray-500">{item.contactPhone}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div>{item.city}</div>
                      <div className="text-xs text-gray-500">{item.state}, {item.country}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-sm text-gray-700">
                      <div className="uppercase text-xs font-semibold text-gray-800">
                        {item.role || "FLEET_MANAGER"}
                      </div>
                      <div className="text-xs text-gray-500">Tier: {item.subscriptionTier}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          className="px-3 py-1 rounded-md border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgencyTab;
