import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentDiscount } from "@types";
import { createStudentsDiscounts, updateStudentsDiscounts, uploadDiscountReason, toggleDebtActive } from "../service";
import { openNotification } from "@utils";

// ============ CREATE ROLES ===========
export function useCreateStudentsDiscounts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: StudentDiscount) => createStudentsDiscounts(data),
        onSuccess: () => {
            openNotification("success", "Success", "Chegirma successfully created");
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ Update student discount ===========
export function useUpdateStudentsDiscounts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: StudentDiscount) => updateStudentsDiscounts(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ upload discount reason file  ===========
export function useUploadDiscountReason() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: any) => uploadDiscountReason(data),
        onSuccess: (data) => {
            console.log(data)
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}



// ======= discaount active =======
import { message } from "antd";



export function useToggleDebtActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleDebtActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.errorMessage || error.message || "Xatolik yuz berdi.";
      message.error(msg);
    },
  });
}



