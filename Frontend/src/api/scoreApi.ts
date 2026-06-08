import axios from "axios";

import type {
  ApiResponse,
  DashboardData,
  ExamScore,
  ScoreLevelReport,
  TopGroupAStudent,
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

export const getTopGroupA = async () => {
  const response =
    await scoreApi.get<ApiResponse<TopGroupAStudent[]>>(
      "/scores/reports/top-group-a",
    );
  return unwrap<TopGroupAStudent[]>(response);
};

export default scoreApi;
