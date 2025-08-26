import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET STUDENTS ============
export async function getLog(params: ParamsType) {
  return (await axiosInstance.get(`api/v1/student/transaction/log/list`, { params })).data
}