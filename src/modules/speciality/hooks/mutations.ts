import { useMutation, useQueryClient } from "@tanstack/react-query";
import { blockSpeciality, createSpeciality, unblockSpeciality, updateSpeciality } from "../service";
import { openNotification } from "@utils";
import { SpecialityType } from "@types";

// ============ CREATE SPECIALITY ===========
export function useCreateSpeciality() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:any) => createSpeciality(data),
        onSuccess: () => {
            openNotification("success", "Success", "Speciality successfully created");
            queryClient.invalidateQueries({ queryKey: ["speciality"] });
        },
        onError: (error) => {
            openNotification("error", "Error", error?.message)
        }
    })
}

// ============ UPDATE SPECIALITY ===========
export function useUpdateSpeciality() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data:SpecialityType) => updateSpeciality(data),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
        },
        onSettled: (_, error) => {
            if (error) {
                openNotification("error", "Error", error?.message)
            } else {
                queryClient.invalidateQueries({ queryKey: ["speciality"] })
            }
        }
    })

}
// ============ BLOCK SPECIALITY ===========
export function useBlockSpeciality() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id:number|string) => blockSpeciality(id),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
        },
        onSettled: (_, error) => {
            if (error) {
                openNotification("error", "Error", error?.message)
            } else {
                queryClient.invalidateQueries({ queryKey: ["speciality"] })
            }
        }
    })

}

// ============ UNBLOCK SPECIALITY ===========
export function useUnblockSpeciality() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id:number|string) => unblockSpeciality(id),
        onSuccess: (data) => {
            openNotification("success", "Success", data?.data?.message)
        },
        onSettled: (_, error) => {
            if (error) {
                openNotification("error", "Error", error?.message)
            } else {
                queryClient.invalidateQueries({ queryKey: ["speciality"] })
            }
        }
    })

}


