import { useQuery } from "@tanstack/react-query";
import { ParamsType } from "@types";
import { getSpecialityForm } from "../service";

// ============ GET SPECIALITY ===========
export function useGetSpecialityForm(params: ParamsType) {
    return useQuery({
        queryKey: ["speciality-form",params],
        queryFn: () => getSpecialityForm(params)
    })
}
