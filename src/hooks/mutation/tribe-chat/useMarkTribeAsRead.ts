import { markTribeAsRead } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useMarkTribeAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tribeId: number) => markTribeAsRead(tribeId),
    onSuccess: () => {
      // 활성화된 트라이브 목록 갱신 (읽음 상태 변경)
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
    },
    onError: (error) => {
      console.error("읽음 처리 실패:", error);
    },
  });
}

export default useMarkTribeAsRead;
