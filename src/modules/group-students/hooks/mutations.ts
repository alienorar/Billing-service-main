// hooks/mutations.ts

import { useMutation } from "@tanstack/react-query";
import { exportStudentList } from "../../students/service";
import { ParamsType } from "@types";
import { openNotification } from "@utils";


// ============= STUDENT_HEMIS_LIST_EXPORT ============
export function useExportStudentList() {
  return useMutation({
    mutationFn: (params: ParamsType) => exportStudentList(params),
    onSuccess: (response) => {
      // Handle file download
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Get filename from response headers or use default
      const contentDisposition = response.headers["content-disposition"]
      let filename = "students_list.xlsx"
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      openNotification("success", "Success", "Student list downloaded successfully")
    },
    onError: (error) => {
      openNotification("error", "Error", error?.message || "Failed to download student list")
    },
  })
}
