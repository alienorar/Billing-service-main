"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button, Input, Select, type TablePaginationConfig } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetGroupStatistics } from "../hooks/queries"

interface GroupStatisticsRecord {
  id: number
  name: string
  speciality: string
  studentCount: number
  contractStudentCount: number
  allStudentDebts: number | null
  allStudentPaid: number | null
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>

const Index: React.FC = () => {
  /* ---------- URL params ---------- */
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = Number(searchParams.get("page") ?? 1)
  const size = Number(searchParams.get("size") ?? 10)
  const name = searchParams.get("name") ?? ""
  const educationLang = searchParams.get("educationLang") ?? ""
  const educationForm = searchParams.get("educationForm") ?? ""
  const educationType = searchParams.get("educationType") ?? ""
  const active = searchParams.get("active") ?? ""

  /* ---------- Data ---------- */
  const { data: groupStatistics, isFetching } = useGetGroupStatistics({
    page: page - 1,
    size,
    name: name || undefined,
    educationLang: educationLang || undefined,
    educationForm: educationForm || undefined,
    educationType: educationType || undefined,
    active: active || undefined,
  })

  const [tableData, setTableData] = useState<GroupStatisticsRecord[]>([])
  const [total, setTotal] = useState<number>(0)

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (groupStatistics?.data?.content) {
      const normalized: GroupStatisticsRecord[] = groupStatistics.data.content.map((item: any) => ({
        id: item.id,
        name: item.name,
        speciality: item.speciality,
        studentCount: item.studentCount,
        contractStudentCount: item.contractStudentCount,
        allStudentDebts: item.allStudentDebts,
        allStudentPaid: item.allStudentPaid,
      }))
      setTableData(normalized)
      setTotal(groupStatistics.data.paging.totalItems ?? 0)
    }
  }, [groupStatistics])

  /* ---------- Helpers ---------- */
  const updateParams = (changed: Record<string, string | undefined>): void => {
    const merged = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    } as Record<string, string | undefined>
    if (!("page" in changed)) merged.page = "1"
    if (!("size" in merged)) merged.size = size.toString()
    setSearchParams(filterEmpty(merged))
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = pagination
    updateParams({
      page: current.toString(),
      size: pageSize.toString(),
    })
  }

  /* ---------- Row Click Handler ---------- */
  const handleRowClick = (record: GroupStatisticsRecord) => {
    navigate(`/super-admin-panel/group-statistics/${record.id}`)
  }

  /* ---------- Columns ---------- */
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.id - b.id,
      },
      {
        title: "Nomi",
        dataIndex: "name",
        key: "name",
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.name.localeCompare(b.name),
        render: (text: string, record: GroupStatisticsRecord) => (
          <a
            onClick={() => handleRowClick(record)}
            className="text-teal-600 hover:text-teal-800 font-medium cursor-pointer"
          >
            {text}
          </a>
        ),
      },
      {
        title: "Mutaxasisligi",
        dataIndex: "speciality",
        key: "speciality",
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.speciality.localeCompare(b.speciality),
      },
      {
        title: "Studentlar soni",
        dataIndex: "studentCount",
        key: "studentCount",
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.studentCount - b.studentCount,
      },
      {
        title: "Kontrakt studentlar soni",
        dataIndex: "contractStudentCount",
        key: "contractStudentCount",
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.contractStudentCount - b.contractStudentCount,
      },
      {
        title: "Qarzdorlik summasi",
        dataIndex: "allStudentDebts",
        key: "allStudentDebts",
        render: (value: number | null) => (
          <span className={value ? "text-red-600 font-medium" : "text-gray-400"}>
            {value ? value.toLocaleString() + " UZS" : "—"}
          </span>
        ),
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
          (a.allStudentDebts || 0) - (b.allStudentDebts || 0),
      },
      {
        title: "Jami to'langan summa",
        dataIndex: "allStudentPaid",
        key: "allStudentPaid",
        render: (value: number | null) => (
          <span className={value ? "text-green-600 font-medium" : "text-gray-400"}>
            {value ? value.toLocaleString() + " UZS" : "—"}
          </span>
        ),
        sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
          (a.allStudentPaid || 0) - (b.allStudentPaid || 0),
      },
    ],
    [],
  )

  /* ---------- Options ---------- */
  const educationLangOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "UZB", label: "Uzbek" },
  ]

  const educationFormOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "SIRTQI", label: "Sirtqi" },
  ]

  const educationTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "BAKALAVR", label: "Bakalavr" },
    { value: "MAGISTR", label: "Magistr" },
  ]

  const activeOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "true", label: "Aktiv" },
    { value: "false", label: "Aktiv emas" },
  ]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Guruh Statistikasi</h1>
          <p className="text-white/80">Guruhlar bo'yicha batafsil ma'lumotlar va statistika</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-gradient-to-r from-slate-300 to-slate-500 rounded-2xl shadow-2xl p-8">
          {/* Filters */}
          <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Guruh nomi"
              className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500 outline-black"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ name: e.target.value })}
            />
            <Select
              allowClear
              placeholder="Ta'lim tili"
              className="rounded-lg"
              options={educationLangOptions}
              value={educationLang || undefined}
              onChange={(value: string | undefined) => updateParams({ educationLang: value || undefined })}
            />
            <Select
              allowClear
              placeholder="Ta'lim shakli"
              className="rounded-lg"
              options={educationFormOptions}
              value={educationForm || undefined}
              onChange={(value: string | undefined) => updateParams({ educationForm: value || undefined })}
            />
            <Select
              allowClear
              placeholder="Ta'lim turi"
              className="rounded-lg"
              options={educationTypeOptions}
              value={educationType || undefined}
              onChange={(value: string | undefined) => updateParams({ educationType: value || undefined })}
            />
            <Select
              allowClear
              placeholder="Aktivligi"
              className="rounded-lg"
              options={activeOptions}
              value={active || undefined}
              onChange={(value: string | undefined) => updateParams({ active: value || undefined })}
            />
            <Button
              type="primary"
              loading={isFetching}
              className="bg-gradient-to-r from-teal-600 to-blue-600 border-0 hover:from-teal-700 hover:to-blue-700 rounded-lg h-10 font-medium transition-all duration-300"
              onClick={() => updateParams({})}
            >
              Qidirish
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <GlobalTable
              loading={isFetching}
              data={tableData}
              columns={columns}
              handleChange={handleTableChange}
              pagination={{
                current: page,
                pageSize: size,
                total: total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
              }}
              onRow={(record: GroupStatisticsRecord) => ({
                onClick: () => handleRowClick(record),
                className: "hover:bg-blue-50 cursor-pointer transition-colors duration-200",
              })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
