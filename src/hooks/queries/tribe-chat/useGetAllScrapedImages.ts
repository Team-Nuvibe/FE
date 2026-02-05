import { getAllScrapedImages } from "@/apis/tribe-chat/scrapimage";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetAllScrapedImagesParams {
  imageTag?: string;
  cursorCreatedAt?: string;
  cursorId?: number;
  size?: number;
}

function useGetAllScrapedImages({
  imageTag,
  cursorCreatedAt,
  cursorId,
  size = 24,
}: UseGetAllScrapedImagesParams = {}) {
  return useQuery({
    queryKey: [
      QUERY_KEY.scrapedImages,
      imageTag,
      cursorCreatedAt,
      cursorId,
      size,
    ],
    queryFn: () =>
      getAllScrapedImages(imageTag, cursorCreatedAt, cursorId, size),
  });
}

export default useGetAllScrapedImages;
