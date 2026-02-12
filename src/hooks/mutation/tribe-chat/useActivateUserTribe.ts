import { activateUserTribe } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useActivateUserTribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userTribeId: number) => activateUserTribe(userTribeId),
    onSuccess: () => {
      // 대기 중인 트라이브 목록과 활성화된 트라이브 목록 모두 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.waitingTribeList],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
    },
    onError: (error) => {
      console.error("트라이브 활성화 실패:", error);
    },
  });
}

export default useActivateUserTribe;
