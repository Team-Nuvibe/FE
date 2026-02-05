import { joinOrCreateTribe } from "@/apis/tribe-chat/tribe";
import { QUERY_KEY } from "@/constants/key";
import type { TribeJoinRequest } from "@/types/tribeChat";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useJoinOrCreateTribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TribeJoinRequest) => joinOrCreateTribe(data),
    onSuccess: () => {
      // 트라이브 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.waitingTribeList],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
    },
    onError: (error) => {
      console.error("트라이브 입장/생성 실패:", error);
    },
  });
}

export default useJoinOrCreateTribe;
