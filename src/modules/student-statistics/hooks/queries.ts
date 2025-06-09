import { useQuery } from "@tanstack/react-query";
import { getStudentStatistics } from "../service";

// ============ GET STUDENTS STATISTICS ===========
export function useGetStudentStatistics() {
  return useQuery({
    queryKey: ["students-statistics"],
    queryFn: () => getStudentStatistics(),
  });
}

