import { useQuery } from "@tanstack/react-query";
import { getLog } from "../service";
import { ParamsType } from "@types";

// ============ GET ===========
export function useGetLog(params: ParamsType) {
  return useQuery({
    queryKey: ["log", params],
    queryFn: () => getLog(params),
  });
}
