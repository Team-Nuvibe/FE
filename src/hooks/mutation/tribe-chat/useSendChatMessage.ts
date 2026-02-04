import { sendChatMessage } from "@/apis/tribe-chat/chat";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SendChatMessageParams {
  tribeId: number;
  boardId: number;
  imageId: number;
}

function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tribeId, boardId, imageId }: SendChatMessageParams) =>
      sendChatMessage(tribeId, boardId, imageId),
    onSuccess: (_, variables) => {
      // 해당 트라이브의 채팅 타임라인과 그리드 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.chatTimeline, variables.tribeId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.chatGrid, variables.tribeId],
      });
    },
    onError: (error) => {
      console.error("채팅 발신 실패:", error);
    },
  });
}

export default useSendChatMessage;
