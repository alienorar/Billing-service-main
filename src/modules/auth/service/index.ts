import axiosInstance from "@api";
import { SignIn } from "../types";


// ==============Sign In ============
export async function signIn(data:SignIn) {
    return await axiosInstance.post("/api/v1/admin/sign/in",data)
}



