import { leaveTribe } from "@/apis/tribe-chat/usertribe";
import { QUERY_KEY } from "@/constants/key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useLeaveTribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userTribeId: number) => leaveTribe(userTribeId),
    onSuccess: () => {
      // 트라이브 목록 갱신
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.activeTribeList],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.waitingTribeList],
      });
    },
    onError: (error) => {
      console.error("트라이브 퇴장 실패:", error);
    },
  });
}

export default useLeaveTribe;
