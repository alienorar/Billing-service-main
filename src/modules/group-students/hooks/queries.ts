import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../service";

// ============ GET STUDENTS ===========
export function useGetStudents(params:any) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
}