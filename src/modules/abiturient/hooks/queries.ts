import { useQuery } from "@tanstack/react-query";
import { getAbiturients } from "../service";
import { ParamsType } from "@types";

// ============ GET ===========
export function useGetAbiturients(params: ParamsType) {
  return useQuery({
    queryKey: ["abiturients", params],
    queryFn: () => getAbiturients(params),
  });
}
