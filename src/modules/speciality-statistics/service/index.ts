
import axiosInstance from "@api";
import { ParamsType } from "@types";

export async function getSpecialityStatistics(params: ParamsType) {
    return (await axiosInstance.get(`api/v1/speciality-form/statistics`, { params })).data
}