"use client"

import { Button, Table, Tooltip, Space } from "antd"
import { DownloadOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { message } from "antd"
import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useGetStudentsDiscounts } from "../hooks/queries"
import { downloadDiscountReason } from "../service"
import { FiEye } from "react-icons/fi"
import AuditModal from "./auditModal"

interface DiscountType {
  id: string
  studentId: string
  description: string
  discountType: string
  studentLevel: string
  amount: number
  reasonFile?: string
}

const DiscountsSection = () => {
  const [audetModalOpen, setAudetModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  const { id: studentId } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize pagination from query parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    return isNaN(page) || page < 1 ? 1 : page
  })
  const [pageSize, setPageSize] = useState(() => {
    const size = Number.parseInt(searchParams.get("size") || "10", 10)
    return isNaN(size) || ![10, 20, 50].includes(size) ? 10 : size
  })

  // Fetch discounts with pagination
  const {
    data: studentsDiscounts,
    isLoading,
    error,
  } = useGetStudentsDiscounts({
    studentId,
    page: currentPage - 1,
    size: pageSize,
  })

  // Extract discounts and pagination data
  const discounts = studentsDiscounts?.data?.content || []
  const totalItems = studentsDiscounts?.data?.paging?.totalItems || 0
  const totalPages = studentsDiscounts?.data?.paging?.totalPages || 0

  // Debug API response
  useEffect(() => {
    console.log("[useGetStudentsDiscounts] Response:", {
      studentsDiscounts,
      discounts,
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      queryParams: { page: currentPage - 1, size: pageSize },
    })
  }, [studentsDiscounts, discounts, totalItems, totalPages, currentPage, pageSize])

  useEffect(() => {
    setSearchParams({ page: currentPage.toString(), size: pageSize.toString() })
  }, [currentPage, pageSize, setSearchParams])

  useEffect(() => {
    if (totalItems > 0 && totalPages > 0 && currentPage > totalPages) {
      console.log(
        `[Pagination] Resetting currentPage from ${currentPage} to 1 due to totalPages: ${totalPages}, totalItems: ${totalItems}, pageSize: ${pageSize}`,
      )
      setCurrentPage(1)
    }
  }, [totalItems, totalPages, currentPage, pageSize])

  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: downloadDiscountReason,
    onMutate: (reasonFile) => {
      console.log("[useMutation] Initiating download for reasonFile:", reasonFile)
      message.loading({ content: "Fayl yuklanmoqda...", key: "download" })
    },
    onSuccess: (data, reasonFile) => {
      console.log("[useMutation] Download successful for reasonFile:", reasonFile)
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = `discount_reason_${reasonFile}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success({ content: "Fayl yuklab olindi!", key: "download" })
    },
    onError: (error: any) => {
      console.error("[useMutation] Download failed:", {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : "No response",
      })
      if (error.message === "Authentication token not found") {
        message.error({ content: "Tizimga kirish uchun token topilmadi! Iltimos, qayta kiring.", key: "download" })
      } else if (error.message === "target must be an object") {
        message.error({ content: "Faylni yuklashda xato: Noto'g'ri so'rov formati!", key: "download" })
      } else {
        message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" })
      }
    },
  })

  const handleDownload = (reasonFile: string | undefined) => {
    console.log("[handleDownload] Download button clicked for reasonFile:", reasonFile)
    if (reasonFile) {
      downloadFile(reasonFile)
    } else {
      console.error("[handleDownload] No reasonFile provided")
      message.error({ content: "Fayl ID topilmadi!", key: "download" })
    }
  }

  const handleTableChange = (pagination: any) => {
    console.log("[handleTableChange] Pagination:", pagination)
    setCurrentPage(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const showModal = () => {
    setAudetModalOpen(true)
  }

  const discountColumns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text: string) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Talaba</span>,
      key: "studentName",
      render: (record: any) => <span className="font-medium text-gray-800">{record.student?.fullName || "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Guruh</span>,
      key: "group",
      render: (record: any) => (
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
          {record.student?.group || "-"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Chegirma tarifi</span>,
      dataIndex: "description",
      key: "description",
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Chegirma turi</span>,
      dataIndex: "discountType",
      key: "discountType",
      render: (text: string) => (
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Miqdori</span>,
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-semibold text-green-600">{amount.toLocaleString()} UZS</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Talaba kursi</span>,
      dataIndex: "studentLevel",
      key: "studentLevel",
      render: (level: string) => (
        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">{level}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Chegirma Sababi</span>,
      key: "download",
      render: (record: DiscountType) => (
        <Space size="middle">
          {record.reasonFile && (
            <Tooltip title="Faylni yuklab olish">
              <Button
                onClick={() => {
                  console.log("[Button] Download button clicked for record:", record)
                  handleDownload(record.reasonFile)
                }}
                loading={isDownloading}
                disabled={isDownloading}
                className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                size="small"
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Amallar</span>,
      key: "action",
      render: (record: any) =>
        record?.id ? (
          <Space size="middle">
            <Tooltip title="Ko'rish">
              <Button
                onClick={() => {
                  setSelectedRecord(record)
                  showModal()
                }}
                className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                size="small"
              >
                <FiEye size={16} />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          "-"
        ),
    },
  ]

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">Ma'lumotlarni yuklashda xatolik: {error.message}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {discounts?.length ? (
        <div>
          <Table
            columns={discountColumns}
            dataSource={discounts}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total, range) => (
                <span className="text-gray-600">
                  {range[0]}-{range[1]} / {total} ta chegirma
                </span>
              ),
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            loading={isLoading}
            className="custom-table"
            rowClassName="hover:bg-green-50 transition-colors duration-200"
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl text-gray-300 mb-4">💰</div>
          <h2 className="text-xl text-gray-500">Chegirmalar topilmadi</h2>
        </div>
      )}
      <AuditModal audetModalOpen={audetModalOpen} setAudetModalOpen={setAudetModalOpen} record={selectedRecord} />
    </div>
  )
}

export default DiscountsSection
