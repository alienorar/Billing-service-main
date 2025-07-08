import { useQuery } from "@tanstack/react-query";
import { getDebtList } from "../service";
import { ParamsType } from "@types";

export function useGetDebtList (params:ParamsType) {
    return useQuery({
        queryKey:["debt",params],
        queryFn: ()=> getDebtList(params)
    })
}