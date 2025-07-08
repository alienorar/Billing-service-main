import { useQuery } from "@tanstack/react-query";
import {downloadDiscountReason, getStudentById, getStudentsDiscounts, getStudentsTrInfo } from "../service";

// ============ GET ADMINS ===========
export function useGetStudentById(id:number | string |undefined ) {
    return useQuery({
        queryKey: ["student",id],
        queryFn: () => getStudentById(id)
    })
}

// ============= GET GROUP STATISTICS ============
export function useGetStudentsTrInfo(params:any) {
    return useQuery({
        queryKey:["students",params],
        queryFn:()=> getStudentsTrInfo(params)
    })
}

// ============= GET STUDENTS DISCOUNTS ============
export function useGetStudentsDiscounts(params:any) {
    return useQuery({
        queryKey:["discounts",params],
        queryFn:()=> getStudentsDiscounts(params)
    })
}

// ============= DOWNLOAD STUDENTS DISCOUNTS REASON FILE============
export function useDownloadDiscountReason(params:any) {
    return useQuery({
        queryKey:["discounts",params],
        queryFn:()=> downloadDiscountReason(params)
    })
}


