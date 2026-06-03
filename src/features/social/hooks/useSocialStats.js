import { useQuery } from "@tanstack/react-query";

import { getSocialStats } from "../api/socialApi";

export function useSocialStats() {
  return useQuery({
    queryKey: ["social-stats"],
    queryFn: getSocialStats,
    staleTime: 1000 * 60 * 10,
  });
}
