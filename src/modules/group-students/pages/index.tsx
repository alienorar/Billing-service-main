"use client"

import type React from "react"

import { FiDownload } from "react-icons/fi"
import { useEffect, useMemo, useState } from "react"
import { type TablePaginationConfig, Spin, Alert, Button, Input } from "antd"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import { useExportStudentList } from "../hooks/mutations"
import { useGetStudents } from "../hooks/queries"
import { ArrowLeftOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons"

interface StudentRecord {
  id: number
  pinfl: string
  studentIdNumber: string
  phone: string
  fullName: string
  educationType: string
  educationForm: string
  speciality: string
  group: string
  paymentGroup: string | null
  level: string
  paymentDetails: DebtAmout
}

interface DebtAmout {
  studentDebtAmount?: number
  studentMustPaidAmount?: number
  studentContractAmount?: number
  studentPaidAmount?: number
  studentDiscountAmount?: number
}

const GroupSinglePage: React.FC = () => {
  const exportStudentsMutation = useExportStudentList()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page") ?? 1)
  const size = Number(searchParams.get("size") ?? 10)
  const groupId = id ? Number(id) : undefined
  const phone = searchParams.get("phone") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const showDebt = searchParams.get("showDebt") || ""

  const {
    data: studentsByGroupId,
    isLoading,
    isError,
    error,
  } = useGetStudents({
    page: page - 1,
    size,
    groupId,
    phone: phone ? Number(phone) : undefined,
    firstName,
    lastName,
    showDebt: true,
  })

  const [tableData, setTableData] = useState<StudentRecord[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (studentsByGroupId?.data?.content) {
      setTableData(studentsByGroupId.data.content)
      setTotal(studentsByGroupId.data.paging.totalItems ?? 0)
    }
  }, [studentsByGroupId])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = pagination
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      phone,
      firstName,
      lastName,
      showDebt,
    })
  }

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      phone,
      firstName,
      lastName,
      showDebt,
    })
  }

  const handleExportStudents = () => {
    const exportParams = {
      phone: phone ? Number(phone) : undefined,
      firstName,
      lastName,
      showDebt: true,
      groupId,
    }

    const cleanParams = Object.fromEntries(
      Object.entries(exportParams).filter(([_, value]) => value !== undefined && value !== ""),
    )

    exportStudentsMutation.mutate(cleanParams)
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">ID</span>,
        dataIndex: "id",
        key: "id",
        render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.id - b.id,
      },
      {
        title: <span className="font-semibold text-gray-700">To'liq ism</span>,
        dataIndex: "fullName",
        key: "fullName",
        render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.fullName.localeCompare(b.fullName),
      },
      {
        title: <span className="font-semibold text-gray-700">Telefon</span>,
        dataIndex: "phone",
        key: "phone",
        render: (text: any) => <span className="text-blue-600 font-medium">{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.phone.localeCompare(b.phone),
      },
      {
        title: <span className="font-semibold text-gray-700">Mutaxasislik</span>,
        dataIndex: "speciality",
        key: "speciality",
        render: (text: any) => <span className="text-gray-800">{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.speciality.localeCompare(b.speciality),
      },
      {
        title: <span className="font-semibold text-gray-700">Guruh</span>,
        dataIndex: "group",
        key: "group",
        render: (text: any) => <span className="text-gray-800 font-medium">{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.group.localeCompare(b.group),
      },
      {
        title: <span className="font-semibold text-gray-700">Kurs</span>,
        dataIndex: "level",
        key: "level",
        render: (text: any) => <span className="text-gray-800">{text}</span>,
        sorter: (a: StudentRecord, b: StudentRecord) => a.level.localeCompare(b.level),
      },
      {
        title: <span className="font-semibold text-gray-700">Qarzdorlik</span>,
        key: "studentDebtAmount",
        sorter: (a: StudentRecord, b: StudentRecord) => {
          const valA = a.paymentDetails?.studentDebtAmount ?? 0
          const valB = b.paymentDetails?.studentDebtAmount ?? 0
          return valA - valB
        },
        render: (_: any, record: StudentRecord) => {
          const amount = record.paymentDetails?.studentDebtAmount ?? 0
          return (
            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                amount < 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
              }`}
            >
              {amount.toLocaleString()}
            </span>
          )
        },
      },
    ],
    [],
  )

  if (!groupId || isNaN(groupId)) {
    return (
      <Alert
        message="Noto'g'ri Guruh ID"
        description="Iltimos, to'g'ri guruh ID ni kiriting."
        type="error"
        showIcon
        className="m-5 rounded-xl"
      />
    )
  }

  if (isError) {
    return (
      <Alert
        message="Xatolik"
        description={error instanceof Error ? error.message : "Studentlarni yuklashda xatolik yuz berdi."}
        type="error"
        showIcon
        className="m-5 rounded-xl"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Guruh Studentlari</h1>
              <p className="text-gray-600 mt-1">Guruh #{groupId} studentlari ro'yxati</p>
            </div>
          </div>

          <Button
            onClick={() => navigate(-1)}
            className="bg-white/80 border-teal-200 text-teal-700 hover:bg-white hover:border-teal-300 transition-all duration-200 rounded-xl px-3"
            icon={<ArrowLeftOutlined />}
          >
            Ortga
          </Button>
        </div>

        {/* Search and Export */}
        <div className="flex flex-wrap items-center gap-4">
          <Input
            placeholder="Telefon"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone: e.target.value,
                firstName,
                lastName,
                showDebt,
              })
            }
            className="w-48 h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="Ism"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName: e.target.value,
                lastName,
                showDebt,
              })
            }
            className="w-48 h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="Familiya"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName: e.target.value,
                showDebt,
              })
            }
            className="w-48 h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Button
            type="primary"
            onClick={handleSearch}
            className="h-11 px-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<SearchOutlined />}
          >
            Qidirish
          </Button>

          <Button
            onClick={handleExportStudents}
            loading={exportStudentsMutation.isPending}
            className="h-11 px-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<FiDownload size={16} />}
          >
            Ro'yxatni yuklash
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <GlobalTable
            loading={isLoading}
            data={tableData}
            columns={columns}
            handleChange={handleTableChange}
            pagination={{
              current: page,
              pageSize: size,
              total: total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
            }}
            onRow={(record: StudentRecord) => ({
              onClick: () => navigate(`/super-admin-panel/students/${record.id}`),
              className: "hover:bg-gray-50 cursor-pointer transition-colors duration-200",
            })}
            className="rounded-2xl"
          />
        )}
      </div>
    </div>
  )
}

export default GroupSinglePage
