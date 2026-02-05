import { getChatTimeline } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetChatTimelineParams {
  tribeId: number;
  lastChatId?: number;
  size?: number;
}

function useGetChatTimeline({
  tribeId,
  lastChatId,
  size = 20,
}: UseGetChatTimelineParams) {
  return useQuery({
    queryKey: [QUERY_KEY.chatTimeline, tribeId, lastChatId, size],
    queryFn: () => getChatTimeline(tribeId, lastChatId, size),
    enabled: !!tribeId,
  });
}

export default useGetChatTimeline;
