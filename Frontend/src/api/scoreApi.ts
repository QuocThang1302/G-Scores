import axios from "axios";

import type {
  AdmissionGroupOption,
  ApiResponse,
  DashboardData,
  ExamScore,
  ScoreLevelReport,
  TopGroupReport,
} from "../types/score.type";

const scoreApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

const unwrap = <T>(response: { data: ApiResponse<T> | T }) => {
  const payload = response.data;

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    "success" in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
};

export const getScoreBySbd = async (sbd: string) => {
  const response = await scoreApi.get<ApiResponse<ExamScore>>(`/scores/${sbd}`);
  return unwrap<ExamScore>(response);
};

export const getDashboard = async () => {
  const response = await scoreApi.get<ApiResponse<DashboardData>>(
    "/scores/dashboard",
  );
  return unwrap<DashboardData>(response);
};

export const getScoreLevelReport = async () => {
  const response =
    await scoreApi.get<ApiResponse<ScoreLevelReport[]>>(
      "/scores/reports/score-levels",
    );
  return unwrap<ScoreLevelReport[]>(response);
};

export const getAdmissionGroups = async () => {
  const response =
    await scoreApi.get<ApiResponse<AdmissionGroupOption[]>>(
      "/scores/reports/top-groups",
    );
  return unwrap<AdmissionGroupOption[]>(response);
};

export const getTopAdmissionGroup = async (groupCode: string) => {
  const response = await scoreApi.get<ApiResponse<TopGroupReport>>(
    `/scores/reports/top-groups/${encodeURIComponent(groupCode)}`,
  );
  return unwrap<TopGroupReport>(response);
};

export default scoreApi;
