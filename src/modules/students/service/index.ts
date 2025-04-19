import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= SYNC STUDENTS ============
export async function syncStudents(data:any) {
    return await axiosInstance.post("api/v1/hemis/student/pinfl/sync",data)
}

// ============= GET STUDENTS ============
export async function getStudents(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/hemis/student/list`,{params})).data
}

