"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Table, Card, Spin, Select, Input } from "antd"
import { useGetSpecialityStatistics } from "../hooks/queries"
import { BarChartOutlined, SearchOutlined } from "@ant-design/icons"

interface Specialty {
  id: number
  name: string
  code: string
  educationType: string
  educationForm: string
  specialityId: number
  studentCount: number
  contractStudentCount: number
  allStudentContractMustPaid: number
  allStudentRemainContractAmount: number
  allStudentDebtAmount: number
  allStudentPaidAmount: number
  allDiscountAmount: number
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> => {
  const result: Record<string, string> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      result[key] = value
    }
  })

  return result
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const size = Number(searchParams.get("size") ?? 10)
  const name = searchParams.get("name") ?? ""
  const educationForm = searchParams.get("educationForm") ?? ""
  const educationType = searchParams.get("educationType") ?? ""

  const [tableData, setTableData] = useState<Specialty[]>([])
  const [total, setTotal] = useState<number>(0)

  const { data: statisticsData, isLoading } = useGetSpecialityStatistics({
    page: page - 1,
    size,
    name: name || undefined,
    educationForm: educationForm || undefined,
    educationType: educationType || undefined,
  })

  useEffect(() => {
    if (statisticsData?.data) {
      setTableData(statisticsData.data.content)
      setTotal(statisticsData.data.paging.totalItems)
    }
  }, [statisticsData])

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} UZS`

  const updateParams = (changed: Record<string, string | undefined>) => {
    const merged = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    }
    if (!("page" in changed)) merged.page = "1"
    if (!("size" in merged)) merged.size = size.toString()
    setSearchParams(filterEmpty(merged))
  }

  const handleTableChange = (pagination: { current: number; pageSize: number }) => {
    updateParams({
      page: pagination.current.toString(),
      size: pagination.pageSize.toString(),
    })
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">Yo'nalish Nomi</span>,
        dataIndex: "name",
        key: "name",
        render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
        sorter: (a: Specialty, b: Specialty) => a.name.localeCompare(b.name),
      },
      {
        title: <span className="font-semibold text-gray-700">Kodi</span>,
        dataIndex: "code",
        key: "code",
        render: (text: any) => <span className="font-mono text-sm text-blue-600">{text}</span>,
        sorter: (a: Specialty, b: Specialty) => a.code.localeCompare(b.code),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim Turi</span>,
        dataIndex: "educationType",
        key: "educationType",
        render: (text: any) => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">{text}</span>
        ),
        sorter: (a: Specialty, b: Specialty) => a.educationType.localeCompare(b.educationType),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim Shakli</span>,
        dataIndex: "educationForm",
        key: "educationForm",
        render: (text: any) => (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">{text}</span>
        ),
        sorter: (a: Specialty, b: Specialty) => a.educationForm.localeCompare(b.educationForm),
      },
      {
        title: <span className="font-semibold text-gray-700">Talabalar Soni</span>,
        dataIndex: "studentCount",
        key: "studentCount",
        render: (text: any) => <span className="font-semibold text-gray-800">{text}</span>,
        sorter: (a: Specialty, b: Specialty) => a.studentCount - b.studentCount,
      },
      {
        title: <span className="font-semibold text-gray-700">Shartnoma Talabalari</span>,
        dataIndex: "contractStudentCount",
        key: "contractStudentCount",
        render: (text: any) => <span className="font-semibold text-purple-600">{text}</span>,
        sorter: (a: Specialty, b: Specialty) => a.contractStudentCount - b.contractStudentCount,
      },
      {
        title: <span className="font-semibold text-gray-700">Jami Shartnoma</span>,
        dataIndex: "allStudentContractMustPaid",
        key: "allStudentContractMustPaid",
        render: (value: number) => <span className="font-semibold text-orange-600">{formatCurrency(value)}</span>,
        sorter: (a: Specialty, b: Specialty) => a.allStudentContractMustPaid - b.allStudentContractMustPaid,
      },
      {
        title: <span className="font-semibold text-gray-700">To'langan</span>,
        dataIndex: "allStudentPaidAmount",
        key: "allStudentPaidAmount",
        render: (value: number) => <span className="font-semibold text-green-600">{formatCurrency(value)}</span>,
        sorter: (a: Specialty, b: Specialty) => a.allStudentPaidAmount - b.allStudentPaidAmount,
      },
      {
        title: <span className="font-semibold text-gray-700">Qolgan</span>,
        dataIndex: "allStudentRemainContractAmount",
        key: "allStudentRemainContractAmount",
        render: (value: number) => <span className="font-semibold text-blue-600">{formatCurrency(value)}</span>,
        sorter: (a: Specialty, b: Specialty) => a.allStudentRemainContractAmount - b.allStudentRemainContractAmount,
      },
      {
        title: <span className="font-semibold text-gray-700">Qarz</span>,
        dataIndex: "allStudentDebtAmount",
        key: "allStudentDebtAmount",
        render: (value: number) => <span className="font-semibold text-red-600">{formatCurrency(value)}</span>,
        sorter: (a: Specialty, b: Specialty) => a.allStudentDebtAmount - b.allStudentDebtAmount,
      },
      {
        title: <span className="font-semibold text-gray-700">Chegirma</span>,
        dataIndex: "allDiscountAmount",
        key: "allDiscountAmount",
        render: (value: number) => <span className="font-semibold text-purple-600">{formatCurrency(value)}</span>,
        sorter: (a: Specialty, b: Specialty) => a.allDiscountAmount - b.allDiscountAmount,
      },
    ],
    [page, size],
  )

  const educationFormOptions = [
    { value: "", label: "Barchasi" },
    { value: "KUNDUZGI", label: "Kunduzgi" },
    { value: "SIRTQI", label: "Sirtqi" },
    { value: "MASOFAVIY", label: "Masofaviy" },
    { value: "KECHKI", label: "Kechki" },
  ]

  const educationTypeOptions = [
    { value: "", label: "Barchasi" },
    { value: "BAKALAVR", label: "Bakalavr" },
    { value: "MAGISTR", label: "Magistr" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <BarChartOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mutaxasislik statistikasi</h1>
            <p className="text-gray-600 mt-1">Mutaxasisliklar bo'yicha batafsil statistik ma'lumotlar</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Yo'nalish nomi"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={name}
            onChange={(e) => updateParams({ name: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />
          <Select
            allowClear
            placeholder="Ta'lim shakli"
            value={educationForm || undefined}
            options={educationFormOptions}
            onChange={(value) => updateParams({ educationForm: value || undefined })}
            className="h-11"
          />
          <Select
            allowClear
            placeholder="Ta'lim turi"
            value={educationType || undefined}
            options={educationTypeOptions}
            onChange={(value) => updateParams({ educationType: value || undefined })}
            className="h-11"
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
          <div className="flex flex-col items-center justify-center">
            <Spin size="large" />
            <p className="text-gray-600 mt-4">Statistikani yuklash...</p>
          </div>
        </div>
      ) : (
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={tableData}
            pagination={{
              current: page,
              pageSize: size,
              total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            scroll={{ x: "max-content" }}
            className="rounded-xl"
          />
        </Card>
      )}
    </div>
  )
}

export default Index
