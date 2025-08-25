import axiosInstance from "@api";
import { ParamsType } from "@types";

// ============= GET STUDENTS ============
export async function getAbiturients(params: ParamsType) {
  return (await axiosInstance.get(`api/v1/abiturient/list`, { params })).data
}