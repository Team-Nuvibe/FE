import { getChatGrid } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";
import { useQuery } from "@tanstack/react-query";

interface UseGetChatGridParams {
  tribeId: number;
  cursorCreatedAt?: string;
  cursorChatId?: number;
  size?: number;
}

function useGetChatGrid({
  tribeId,
  cursorCreatedAt,
  cursorChatId,
  size = 24,
}: UseGetChatGridParams) {
  return useQuery({
    queryKey: [
      QUERY_KEY.chatGrid,
      tribeId,
      cursorCreatedAt,
      cursorChatId,
      size,
    ],
    queryFn: () => getChatGrid(tribeId, cursorCreatedAt, cursorChatId, size),
    enabled: !!tribeId,
  });
}

export default useGetChatGrid;
