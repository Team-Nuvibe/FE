import { useQuery } from "@tanstack/react-query";
import { checkImageStatus } from "@/apis/tribe-chat/chat";
import type { ImageStatusResponse } from "@/types/tribeChat";
import type { ApiResponse } from "@/types/common";

export const useGetImageStatus = (imageId: number | null) => {
  return useQuery<ApiResponse<ImageStatusResponse>, Error>({
    queryKey: ["imageStatus", imageId],
    queryFn: () => checkImageStatus(imageId!),
    enabled: !!imageId,
  });
};
