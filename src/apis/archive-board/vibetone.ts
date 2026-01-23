import type {
  TagUsageRankingResponse,
  CalendarImagesResponse,
  MonthlyUploadDatesResponse,
  MostUsedBoardResponse,
  UserUsagePatternResponse,
} from "@/types/archive";
import { axiosInstance } from "../axios";
import type { ApiResponse } from "@/types/common";

// ----- 바이브톤 리캡 -----

// 사용 태그 순위 조회
export const getTagUsageRanking = async (
  period: "WEEK" | "TOTAL",
): Promise<ApiResponse<TagUsageRankingResponse>> => {
  const { data } = await axiosInstance.get<
    ApiResponse<TagUsageRankingResponse>
  >("/api/recap/tags", {
    params: {
      period,
    },
  });
  return data;
};

// 날짜 별 업로드한 이미지 조회
export const getCalendarImages = async (
  date: string,
): Promise<ApiResponse<CalendarImagesResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<CalendarImagesResponse>>(
    "/api/recap/calendar/images",
    {
      params: {
        date,
      },
    },
  );
  return data;
};

// 월별 업로드 날짜 조회
export const getMonthlyUploadDates = async (
  year: number,
  month: number,
): Promise<ApiResponse<MonthlyUploadDatesResponse>> => {
  const { data } = await axiosInstance.get<
    ApiResponse<MonthlyUploadDatesResponse>
  >("/api/recap/calendar/dates", {
    params: {
      year,
      month,
    },
  });
  return data;
};

// 가장 많이 사용한 보드 조회
export const getMostUsedBoard = async (
  period: "WEEK" | "TOTAL",
): Promise<ApiResponse<MostUsedBoardResponse>> => {
  const { data } = await axiosInstance.get<ApiResponse<MostUsedBoardResponse>>(
    "/api/recap/board",
    {
      params: {
        period,
      },
    },
  );
  return data;
};

// 사용자 이용 패턴 조회
export const getUserUsagePattern = async (
  period: "WEEK" | "TOTAL",
): Promise<ApiResponse<UserUsagePatternResponse>> => {
  const { data } = await axiosInstance.get<
    ApiResponse<UserUsagePatternResponse>
  >("/api/recap/active", {
    params: {
      period,
    },
  });
  return data;
};

// -----------------------------------------
