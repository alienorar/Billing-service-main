import { useQuery } from "@tanstack/react-query";
import { getSpeciality,  } from "../service";
import { ParamsType } from "@types";

// ============ GET SPECIALITY ===========
export function useGetSpeciality(params:ParamsType) {
    return useQuery({
        queryKey: ["speciality",params],
        queryFn: () => getSpeciality(params)
    })
}
