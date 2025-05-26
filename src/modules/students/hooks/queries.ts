import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getStudents, syncStudent } from "../service";

// ============ GET STUDENTS ===========
export function useGetStudents(params: ParamsType) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
}

// ============ SYNC STUDENTS ===========
export function useSyncGetStudents(options = {}) {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => syncStudent(),
    enabled: false, // Disable automatic fetching
    ...options,
  });
}