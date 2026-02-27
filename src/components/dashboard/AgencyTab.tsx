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
  const [isEditing, setIsEditing] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [agenciesError, setAgenciesError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    agencyName: agency?.agencyName || "",
    contactEmail: agency?.contactEmail || "",
    phone: "+61 2 9876 5432",
    address: "123 Business Street, Sydney NSW 2000",
    website: "www.aylasagency.com.au",
    established: "2019"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving agency data:", formData);
    setIsEditing(false);
  };

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

  const handleCancel = () => {
    setFormData({
      agencyName: agency?.agencyName || "",
      contactEmail: agency?.contactEmail || "",
      phone: "+61 2 9876 5432",
      address: "123 Business Street, Sydney NSW 2000",
      website: "www.aylasagency.com.au",
      established: "2019"
    });
    setIsEditing(false);
  };

  const stats = [
    { label: "Total Agents", value: "24", change: "+2 this month" },
    { label: "Active Listings", value: "156", change: "+12 this week" },
    { label: "Properties Sold", value: "89", change: "+8 this month" },
    { label: "Revenue MTD", value: "$45.2K", change: "+15% vs last month" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agency Information</h2>
          <p className="text-gray-600 mt-1">Manage your agency details and view performance metrics</p>
        </div>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isEditing 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
          }`}
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
            <p className="text-sm text-green-600 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Agency Information Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-amber-600" />
            Agency Details
          </h3>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agency Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="agencyName"
                  value={formData.agencyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="established"
                value={formData.established}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                  isEditing ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 font-medium"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
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
