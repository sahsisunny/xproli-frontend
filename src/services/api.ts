import { API_URL } from "@/constants/constants";
import { ApiResponse } from "@/types/ApiResponse";
import {
  AnalyticsResponse,
  CreateLinkResponse,
  ICreateLinkPayload,
  ILink,
  UpdateLinkResponse,
} from "@/types/link";
import { IUser } from "@/types/user";

// Helper to get the auth token from local storage
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  return user ? `Bearer ${JSON.parse(user).token}` : "";
};

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = token;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "An error occurred",
        status: "error",
      };
    }

    return {
      data: data.data,
      status: "success",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
      status: "error",
    };
  }
}

// User API functions
export const userApi = {
  login: (email: string, password: string) =>
    fetchApi<IUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
    }),

  signup: (name: string, email: string, password: string) =>
    fetchApi<IUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getCurrentUser: () => fetchApi<IUser>("/auth/me"),

  updateProfile: (userData: Partial<IUser>) =>
    fetchApi<IUser>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),
};

// Link API functions
export const linkApi = {
  createLink: (linkData: Partial<ICreateLinkPayload>) =>
    fetchApi<CreateLinkResponse>("/links", {
      method: "POST",
      body: JSON.stringify(linkData),
      credentials: "include",
    }),

  getLinks: () => fetchApi<ILink[]>("/links"),

  getLinkById: (id: string) => fetchApi<ICreateLinkPayload>(`/links/${id}`),

  updateLink: (id: string, linkData: Partial<UpdateLinkResponse>) =>
    fetchApi<UpdateLinkResponse>(`/links/${id}`, {
      method: "PATCH",
      body: JSON.stringify(linkData),
    }),

  deleteLink: (id: string) =>
    fetchApi<void>(`/links/${id}`, {
      method: "DELETE",
    }),
};

// Analytics API functions
export const analyticsApi = {
  getLinkAnalytics: (linkId: string, startDate?: string, endDate?: string) =>
    fetchApi<AnalyticsResponse>(`/analytics/links/${linkId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ startDate, endDate }),
    }),

  getAllLinksAnalytics: () => fetchApi<AnalyticsResponse[]>("/analytics/links"),
};
