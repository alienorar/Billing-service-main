import axiosInstance from "@api";
import { ParamsType } from "@types";

// =========================GET++++++++++++++++++++++++
export async function getUniversityStatistics () {
    return (await  axiosInstance.get("api/v1/student/transaction/log/statistics")).data
}

// =========================GET++++++++++++++++++++++++
export async function getDebtRate(params:ParamsType) {
    return (await  axiosInstance.get(`/api/v1/debt/rate/list`,{params})).data
}
