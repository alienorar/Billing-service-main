import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET STUDENTS ============
export async function getStudents(params:any) {
    return (await axiosInstance.get(`api/v1/hemis/student/list`,{params})).data
}


// ============= STUDENT_HEMIS_LIST_EXPORT ============
export async function exportStudentList(params: ParamsType) {
  return await axiosInstance.get("/api/v1/hemis/student/list/download", {
    params,
    responseType: "blob", // Important for file downloads
  })
}