import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getXaznaHistory } from "../service";

// ============ GET PAYMENT HISTORY ===========
export function useGetXaznaHistory(params:ParamsType) {
    return useQuery({
        queryKey:["xazna",params],
        queryFn:()=> getXaznaHistory(params)
    })
}