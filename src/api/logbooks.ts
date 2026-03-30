import { getAccessToken } from "./auth";
import { API_BASE_URL } from "./config";

export interface LogbookSession {
    _id: string;
    vehicleId: string;
    agencyId: string;
    startDate: string | null;
    endDate: string | null;
    startOdometerInKms: number;
    endOdometerInKms: number | null;
    totalKms: number;
    businessKms: number;
    privateKms: number;
    businessUsePercentage: number;
    minimumPeriodSatisfied: boolean;
    status: "DRAFT" | "LOCKED";
    isLocked: boolean;
    fbtYear: string;
    isValidForFbt: boolean;
    lockedAt?: string | null;
}

export interface CreateLogbookSessionPayload {
    vehicleId: string;
    startDate?: string;
    endDate?: string;
    fbtYear: string;
}

const getHeaders = () => {
    const token = getAccessToken();
    return {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
    };
};

export const logbookService = {
    getSessionsByVehicle: async (vehicleId: string): Promise<LogbookSession[]> => {
        const res = await fetch(`${API_BASE_URL}/api/logbook-sessions/vehicle/${vehicleId}`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to fetch logbook sessions");
        }
        return res.json();
    },

    getLiveSession: async (vehicleId: string): Promise<LogbookSession | null> => {
        const res = await fetch(`${API_BASE_URL}/api/logbook-sessions/live/${vehicleId}`, {
            headers: getHeaders(),
        });
        if (!res.ok) {
            if (res.status === 404) return null; // No active session
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to fetch live session");
        }
        // If it comes back empty without 404
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
    },

    createSession: async (payload: CreateLogbookSessionPayload): Promise<LogbookSession> => {
        const res = await fetch(`${API_BASE_URL}/api/logbook-sessions`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to create logbook session");
        }
        return res.json();
    },

    lockSession: async (sessionId: string): Promise<LogbookSession> => {
        const res = await fetch(`${API_BASE_URL}/api/logbook-sessions/${sessionId}/lock`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({}), // Assume backend handles userId extraction from token 
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Failed to lock logbook session");
        }
        return res.json();
    },
};
