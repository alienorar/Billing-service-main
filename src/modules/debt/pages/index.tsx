"use client"

import type React from "react"

import { Table, Button, Tooltip, message, Switch, Space } from "antd"
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { useGetDebtList } from "../hooks/queries"
import { downloadDebtReason } from "../service"
import DebtsModal from "./modal"
import { useDeactivateDebt } from "../hooks/mutations"
import { openNotification } from "@utils"
import { FiEye } from "react-icons/fi"
import AuditModal from "./auditModal"

interface StudentDebtsTableProps {
  studentId?: string
}

const StudentDebtsTable: React.FC<StudentDebtsTableProps> = ({ studentId }) => {
  //Pagination
  const [searchParams, setSearchParams] = useSearchParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    return isNaN(page) || page < 1 ? 1 : page
  })
  const [pageSize, setPageSize] = useState(() => {
    const size = Number.parseInt(searchParams.get("size") || "10", 10)
    return isNaN(size) || ![10, 20, 50].includes(size) ? 10 : size
  })
  const { data, isLoading, error } = useGetDebtList({
    studentId,
    page: currentPage - 1,
    size: pageSize,
  })

  error?.message ? openNotification("error", "Xatolik yuz berdi", error.message) : ""
  const [audetModalOpen, setAudetModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<any | null>(null)
  const debts = data?.data?.content || []
  const deactivateDebt = useDeactivateDebt()

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }
  const showAuditModal = () => {
    setAudetModalOpen(true)
  }

  const totalItems = data?.data?.paging?.totalItems || 0

  useEffect(() => {
    setSearchParams({ page: currentPage.toString(), size: pageSize.toString() })
  }, [currentPage, pageSize, setSearchParams])

  useEffect(() => {
    if (totalItems > 0 && currentPage > Math.ceil(totalItems / pageSize)) {
      setCurrentPage(1)
    }
  }, [totalItems, currentPage, pageSize])

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: downloadDebtReason,
    onSuccess: (data, reasonFile) => {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = `debt_reason_${reasonFile}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      message.success({ content: "Fayl yuklab olindi!", key: "download" })
    },
    onError: (error: any) => {
      console.error(error)
      message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" })
    },
  })
  const handleToggleVisibility = (id: number | string, isVisible: boolean) => {
    if (isVisible) {
      deactivateDebt.mutate(id)
    } else {
      deactivateDebt.mutate(id)
    }
  }

  const handleDownload = (reasonFile: string) => {
    if (reasonFile) downloadFile(reasonFile)
    else message.error({ content: "Fayl ID topilmadi!", key: "download" })
  }

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Talaba",
      key: "studentFullName",
      render: (record: any) => record.student?.fullName || "—",
    },
    {
      title: "Guruh",
      key: "studentGroup",
      render: (record: any) => record.student?.group || "—",
    },
    { title: "Tarif", dataIndex: "description", key: "description" },
    { title: "Turi", dataIndex: "debtType", key: "debtType" },
    {
      title: "Miqdori",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="text-red-500 font-medium">{amount.toLocaleString()} UZS</span>,
    },
    {
      title: "Active",
      dataIndex: "active",
      render: (visible: boolean, record: any) => (
        <Switch
          checked={visible}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggleVisibility(record.id, visible)}
          style={{
            backgroundColor: visible ? "#10b981" : "#6b7280",
          }}
        />
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (record: any) => (
        <Space>
          {record.reasonFile && (
            <Tooltip title="Yuklab olish">
              <Button
                onClick={() => handleDownload(record.reasonFile)}
                loading={isDownloading}
                icon={<DownloadOutlined />}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              />
            </Tooltip>
          )}
          <Tooltip title="Tahrirlash">
            <Button
              onClick={() => {
                setUpdate(record)
                showModal()
              }}
              icon={<EditOutlined />}
              className="border-green-500 text-green-500 hover:bg-green-50"
            />
          </Tooltip>
          <Tooltip title="Ko'rish">
            <Button
              onClick={() => {
                setSelectedRecord(record)
                showAuditModal()
              }}
              className="border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              <FiEye size={18} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <DebtsModal open={isModalOpen} handleClose={handleClose} studentId={studentId} update={update} />
      <AuditModal audetModalOpen={audetModalOpen} setAudetModalOpen={setAudetModalOpen} record={selectedRecord} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Qarzdorliklar</h3>
          <p className="text-gray-600">Jami {totalItems} ta qarzdorlik</p>
        </div>
        <Button
          type="primary"
          onClick={showModal}
          className="bg-gradient-to-r from-teal-600 to-blue-600 border-0 hover:from-teal-700 hover:to-blue-700 rounded-lg px-6 h-10 font-medium transition-all duration-300"
        >
          Yangi Qarz
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      ) : debts?.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">Qarzdorliklar topilmadi</p>
        </div>
      ) : (
        <div className="rounded-xl shadow-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={debts}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Jami: ${total} qarzdorlik`,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            className="rounded-lg overflow-hidden"
            rowClassName="hover:bg-blue-50 transition-colors duration-200"
          />
        </div>
      )}
    </div>
  )
}

export default StudentDebtsTable
