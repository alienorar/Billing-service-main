import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET GROUP STATISTICS ============
export async function getGroupStatistics(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/groups/statistics`,{params})).data
}

// ============= GET STUDENTS ============
export async function getStudents(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/hemis/student/list`,{params})).data
}
