import axiosInstance from "@api";
import { DebtRecord, ParamsType } from "@types";

export async function getDebtList(params:ParamsType) {
    return (await axiosInstance.get(`api/v1/debt/list/pageable`,{params})).data
}
export async function createDebtList(data:DebtRecord) {
    return (await axiosInstance.post('api/v1/debt/create',data)).data
}
// ============= CREATE STUDENTS DISCOUNTS ============
export async function updateDebtList(data:DebtRecord) {
    return (await axiosInstance.put(`api/v1/debt/update`,data)).data
}

// ============= UPLOAD STUDENTS DISCOUNTS REASON FILE ============
export async function uploadDebtReason(data:any) {
    return (await axiosInstance.post(`api/v1/file/upload`,data)).data
}

// ============= DEACTIVATE DEBT ============
export async function deactivateDebt(id:number|string) {
    return (await axiosInstance.put(`api/v1/debt/activate-deactivate/${id}`))
}


export async function downloadDebtReason(reasonFile: string) {
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
    const response = await axiosInstance.get(`api/v1/file/download/${reasonFile}`, {
      responseType: "blob",
      headers: {
        "x-admin-token": token,
        "accept": "multipart/form-data",
      },
    });
  
    return response.data;
  } catch (error: any) {
 
    throw error;
  }
}

