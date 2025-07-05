import axiosInstance from "@api";
import { StudentDiscount } from "@types";

// ============= GET STUDENT BY ID============
export async function getStudentById(id:number|string|undefined) {
    return (await axiosInstance.get(`api/v1/hemis/student/one?id=${id}`)).data
}

// ============= GET STUDENTS TR INFO BY PINFL============
export async function getStudentsTrInfo(params:any) {
    return (await axiosInstance.get(`api/v1/student/transaction/list`,{params})).data
}

// ============= CREATE STUDENTS DISCOUNTS ============
export async function createStudentsDiscounts(data:StudentDiscount) {
    return (await axiosInstance.post(`api/v1/discount/create`,data)).data
}

// ============= GET STUDENTS DISCOUNTS ============
export async function getStudentsDiscounts(params:any) {
    return (await axiosInstance.get(`api/v1/discount/list/pageable`,{params})).data
}

// ============= CREATE STUDENTS DISCOUNTS ============
export async function updateStudentsDiscounts(data:StudentDiscount) {
    return (await axiosInstance.put(`/api/v1/discount/update`,data)).data
}

// ============= UPLOAD STUDENTS DISCOUNTS REASON FILE ============
export async function uploadDiscountReason(data:any) {
    return (await axiosInstance.post(`api/v1/file/upload`,data)).data
}


export async function downloadDiscountReason(reasonFile: string) {

  const possibleTokenKeys = ["x-admin-token", "adminToken", "token", "authToken", "jwt", "accessToken"];
  let token: string | null = null;

  for (const key of possibleTokenKeys) {
    token = localStorage.getItem(key);
    if (token) {
      console.log(`[downloadDiscountReason] Token found in localStorage for key "${key}":`, token);
      break;
    }
  }



 
  try {
    // console.log("[downloadDiscountReason] Sending GET request to:", `api/v1/file/download/${reasonFile}`);
    const response = await axiosInstance.get(`api/v1/file/download/${reasonFile}`, {
      responseType: "blob",
      headers: {
        "x-admin-token": token,
        "accept": "multipart/form-data",
      },
    });
    // console.log("[downloadDiscountReason] Response received:", {
    //   status: response.status,
    //   headers: response.headers,
    //   data: response.data instanceof Blob ? `Blob of size ${response.data.size}` : response.data,
    // });
    return response.data;
  } catch (error: any) {
    // console.error("[downloadDiscountReason] Error during request:", {
    //   message: error.message,
    //   response: error.response ? {
    //     status: error.response.status,
    //     data: error.response.data,
    //   } : "No response",
    // });
    throw error;
  }
}

export async function toggleDebtActive(id: string | number) {
  return await axiosInstance.put(`api/v1/discount/activate-deactivate/${id}`);
}

