import { getTribeScrapedImages } from "@/apis/tribe-chat/scrapimage";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetTribeScrapedImagesParams {
  tribeId: number;
  imageTag?: string;
  cursorCreatedAt?: string;
  cursorId?: number;
  size?: number;
}

function useGetTribeScrapedImages({
  tribeId,
  imageTag,
  cursorCreatedAt,
  cursorId,
  size = 24,
}: UseGetTribeScrapedImagesParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.tribeScrapedImages,
      tribeId,
      imageTag,
      cursorCreatedAt,
      cursorId,
      size,
    ],
    queryFn: () =>
      getTribeScrapedImages(tribeId, imageTag, cursorCreatedAt, cursorId, size),
    enabled: !!tribeId,
  });
}

export default useGetTribeScrapedImages;
