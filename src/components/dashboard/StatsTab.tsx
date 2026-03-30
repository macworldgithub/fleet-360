"use client";

import React, { useEffect, useState } from "react";
import {
  Car,
  Users,
  Wrench,
  Fuel,
  FileText,
  ShieldCheck,
  Loader2,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { statsService, StatsData, DashStats } from "@/src/api/stats";
import { useAuth } from "@/src/api/auth";
import { toast } from "react-hot-toast";

const StatCard = ({ title, value, icon: Icon, color, details }: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  details?: { label: string; value: number }[];
}) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-xl shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {details && details.length > 0 && (
      <div className="mt-4 grid grid-cols-2 gap-2">
        {details.map((detail, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-2">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">{detail.label}</p>
            <p className="text-sm font-bold text-gray-700">{detail.value}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function StatsTab() {
  const { agency, isLoading: authLoading } = useAuth();
  const isPrincipal = agency?.role === "PRINCIPAL";
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize before fetching stats
    if (authLoading) return;

    // If not authenticated, don't attempt to fetch
    if (!agency) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        const response: any = await statsService.getDashboardStats();

        // Handle different response structures
        if (response.summary || response.agencyStats) {
          // Structure with summary/agencyStats (Principal view)
          if (isPrincipal) {
            setStats(response.summary);
          } else {
            // Fleet Manager finding their stats in the list
            const myAgencyStats = response.agencyStats?.find((as: any) =>
              as.agencyId === agency.id || as.agencyId === (agency as any)._id
            );

            if (myAgencyStats) {
              setStats(myAgencyStats.stats);
            } else {
              setStats(response.summary);
            }
          }
        } else if (response.vehicles) {
          // Direct structure (Fleet Manager view seen in screenshot)
          setStats(response as StatsData);
        } else {
          toast.error("Statistics format not recognized.");
        }
      } catch (error: any) {
        if (error?.response?.status !== 401) {
          console.error("Failed to fetch stats:", error);
          toast.error("Failed to load dashboard statistics.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isPrincipal, agency, authLoading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading Statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-700">No Statistics Available</h3>
        <p className="text-gray-500">We couldn't find any statistical data to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Key metrics for your {isPrincipal ? "organization" : "agency"} at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Vehicles Summary */}
        <StatCard
          title="Total Vehicles"
          value={stats.vehicles.total}
          icon={Car}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          details={[
            { label: "Active", value: stats.vehicles.active },
            { label: "Assigned", value: stats.vehicles.assigned },
            { label: "Agreement", value: stats.vehicles.underAgreement },
            { label: "Maintenance", value: stats.vehicles.inMaintenance },
          ]}
        />

        {/* Drivers & Maintenance */}
        <StatCard
          title="Total Drivers"
          value={stats.drivers.total}
          icon={Users}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />

        <StatCard
          title="Maintenance Tasks"
          value={stats.maintenance.completed}
          icon={Wrench}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
          details={[
            { label: "Submitted", value: stats.maintenance.submitted },
            { label: "Rejected", value: stats.maintenance.rejected },
          ]}
        />

        {/* Fuel Distribution */}
        <StatCard
          title="Fuel Types"
          value={Object.values(stats.fuelDistribution).reduce((a, b) => a + b, 0)}
          icon={Fuel}
          color="bg-gradient-to-br from-green-500 to-green-600"
          details={[
            { label: "Petrol", value: stats.fuelDistribution.petrol },
            { label: "Diesel", value: stats.fuelDistribution.diesel },
            { label: "Hybrid", value: stats.fuelDistribution.hybrid },
            { label: "EV", value: stats.fuelDistribution.ev },
          ]}
        />

        {/* Lease Distribution */}
        <StatCard
          title="Ownership"
          value={stats.leaseDistribution.owned + stats.leaseDistribution.loan}
          icon={CreditCard}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          details={[
            { label: "Owned", value: stats.leaseDistribution.owned },
            { label: "Loan/Financed", value: stats.leaseDistribution.loan },
          ]}
        />

        {/* Logbook sessions */}
        <StatCard
          title="Logbook Sessions"
          value={stats.logbookSessions.draft + stats.logbookSessions.locked}
          icon={FileText}
          color="bg-gradient-to-br from-rose-500 to-rose-600"
          details={[
            { label: "Draft", value: stats.logbookSessions.draft },
            { label: "Locked", value: stats.logbookSessions.locked },
          ]}
        />
      </div>

      {/* Additional Visuals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-gray-900">Vehicle Status Health</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Active Fleet</span>
                <span className="text-sm font-bold text-gray-900">{Math.round((stats.vehicles.active / stats.vehicles.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.vehicles.active / stats.vehicles.total) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Assigned Drivers</span>
                <span className="text-sm font-bold text-gray-900">{Math.round((stats.vehicles.assigned / stats.vehicles.total) * 100) || 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(stats.vehicles.assigned / stats.vehicles.total) * 100 || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900">Maintenance Pipeline</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-amber-50 text-amber-700 rounded-lg mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.maintenance.submitted}</p>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Submitted</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-green-50 text-green-700 rounded-lg mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.maintenance.completed}</p>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Completed</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-2 bg-rose-50 text-rose-700 rounded-lg mb-2">
                <XCircle className="w-5 h-5" />
              </div>
              <p className="text-xl font-bold text-gray-900">{stats.maintenance.rejected}</p>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Rejected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
