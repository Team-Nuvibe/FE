import { useInfiniteQuery } from "@tanstack/react-query";
import { getChatTimeline } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";

interface UseInfiniteChatTimelineParams {
  tribeId: number;
  size?: number;
}

const useInfiniteChatTimeline = ({
  tribeId,
  size = 20,
}: UseInfiniteChatTimelineParams) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.chatTimeline, tribeId, size],
    queryFn: ({ pageParam }) =>
      getChatTimeline(tribeId, pageParam as number | undefined, size),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있으면 nextLastChatId 반환, 없으면 undefined
      return lastPage.data.hasNext ? lastPage.data.nextLastChatId : undefined;
    },
    enabled: !!tribeId,
  });
};

export default useInfiniteChatTimeline;
