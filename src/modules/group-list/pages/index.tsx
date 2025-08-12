"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button, Input, Select, Space, type TablePaginationConfig, Tag, Tooltip } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetStudentById } from "../hooks/queries"
import type { GroupListUpdate } from "@types"
import { EditOutlined, TeamOutlined, SearchOutlined } from "@ant-design/icons"
import GroupModal from "./modal"

interface GroupRecord {
  id: number
  name: string
  educationLang: string
  educationForm: string
  educationType: string
  active: boolean
  specialityName: string
  paymentGroupId: number | null
  paymentGroupName: string | null
  level: number | null
  debtLevel: number | null
}

interface QueryParams {
  page: number
  size: number
  name?: string
  educationLang?: string
  educationForm?: string
  active?: string
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>

const GroupList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [update, setUpdate] = useState<GroupListUpdate | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const page = Number(searchParams.get("page") ?? 1)
  const size = Number(searchParams.get("size") ?? 10)
  const name = searchParams.get("name") ?? ""
  const educationLang = searchParams.get("educationLang") ?? ""
  const educationForm = searchParams.get("educationForm") ?? ""
  const educationType = searchParams.get("educationType") ?? ""
  const active = searchParams.get("active") ?? ""

  const { data: groupData, isFetching } = useGetStudentById({
    page: page - 1,
    size,
    name: name || undefined,
    educationLang: educationLang || undefined,
    educationForm: educationForm || undefined,
    educationType: educationType || undefined,
    active: active || undefined,
  } as QueryParams)

  const [tableData, setTableData] = useState<GroupRecord[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (groupData?.data?.content) {
      const normalized: GroupRecord[] = groupData.data.content.map((item: GroupRecord) => ({
        id: item.id,
        name: item.name,
        educationLang: item.educationLang,
        educationForm: item.educationForm,
        educationType: item.educationType,
        active: item.active,
        specialityName: item.specialityName,
        paymentGroupId: item.paymentGroupId,
        paymentGroupName: item.paymentGroupName,
        level: item.level,
        debtLevel: item.debtLevel,
      }))
      setTableData(normalized)
      setTotal(groupData.data.paging.totalItems ?? 0)
    }
  }, [groupData])

  const updateParams = (changed: Record<string, string | undefined>): void => {
    const merged: Record<string, string | undefined> = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    }
    if (!("page" in changed)) merged.page = "1"
    if (!("size" in merged)) merged.size = size.toString()
    setSearchParams(filterEmpty(merged))
  }

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    const { current = 1, pageSize = 10 } = pagination
    updateParams({
      page: current.toString(),
      size: pageSize.toString(),
    })
  }

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }

  const editData = (item: GroupListUpdate) => {
    setUpdate(item)
    showModal()
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">ID</span>,
        dataIndex: "id",
        key: "id",
        width: 80,
        minWidth: 80,
        render: (text: any) => <span className="font-medium text-gray-600 text-sm md:text-base">#{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.id - b.id,
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Ta'lim yo'nalishi</span>,
        dataIndex: "specialityName",
        key: "specialityName",
        width: 200,
        minWidth: 150,
        render: (text: any) => <span className="font-mono text-sm text-blue-600">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.specialityName.localeCompare(b.specialityName),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Nomi</span>,
        dataIndex: "name",
        key: "name",
        width: 150,
        minWidth: 120,
        render: (text: any) => <span className="font-medium text-gray-800 text-sm md:text-base">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.name.localeCompare(b.name),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Ta'lim tili</span>,
        dataIndex: "educationLang",
        key: "educationLang",
        width: 120,
        minWidth: 100,
        render: (text: any) => (
          <Tag color="blue" className="rounded-lg font-medium text-xs md:text-sm">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationLang.localeCompare(b.educationLang),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Ta'lim shakli</span>,
        dataIndex: "educationForm",
        key: "educationForm",
        width: 120,
        minWidth: 100,
        render: (text: any) => (
          <Tag color="purple" className="rounded-lg font-medium text-xs md:text-sm">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationForm.localeCompare(b.educationForm),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Ta'lim turi</span>,
        dataIndex: "educationType",
        key: "educationType",
        width: 120,
        minWidth: 100,
        render: (text: any) => (
          <Tag color="orange" className="rounded-lg font-medium text-xs md:text-sm">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationType.localeCompare(b.educationType),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Aktiv</span>,
        dataIndex: "active",
        key: "active",
        width: 100,
        minWidth: 80,
        render: (active: boolean) => (
          <Tag color={active ? "green" : "red"} className="rounded-lg font-medium px-2 md:px-3 py-1 text-xs md:text-sm">
            {active ? "Aktiv" : "Aktiv emas"}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => Number(a.active) - Number(b.active),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Ko'rinish</span>,
        dataIndex: "visible",
        key: "visible",
        width: 100,
        minWidth: 80,
        render: (active: boolean) => (
          <Tag color={active ? "green" : "red"} className="rounded-lg font-medium px-2 md:px-3 py-1 text-xs md:text-sm">
            {active ? "Aktiv" : "Aktiv emas"}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => Number(a.active) - Number(b.active),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">To'lov guruhi ID</span>,
        dataIndex: "paymentGroupId",
        key: "paymentGroupId",
        width: 120,
        minWidth: 100,
        responsive: ["md"] as any, // Hide on small screens
        render: (value: number | null) => <span className="text-gray-800 text-sm md:text-base">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.paymentGroupId || 0) - (b.paymentGroupId || 0),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">To'lov guruhi nomi</span>,
        dataIndex: "paymentGroupName",
        key: "paymentGroupName",
        width: 150,
        minWidth: 120,
        render: (value: string | null) => <span className="text-gray-800 text-sm md:text-base">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.paymentGroupName || "").localeCompare(b.paymentGroupName || ""),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Kurs</span>,
        dataIndex: "level",
        key: "level",
        width: 100,
        minWidth: 80,
        render: (value: number | null) => <span className="text-gray-800 text-sm md:text-base">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.level || 0) - (b.level || 0),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Qarz darajasi</span>,
        dataIndex: "debtLevel",
        key: "debtLevel",
        width: 120,
        minWidth: 100,
        responsive: ["md"] as any, // Hide on small screens
        render: (value: number | null) => <span className="text-gray-800 text-sm md:text-base">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.debtLevel || 0) - (b.debtLevel || 0),
      },
      {
        title: <span className="font-semibold text-gray-700 text-sm md:text-base">Amallar</span>,
        key: "action",
        width: 80,
        minWidth: 80,
        fixed: "right" as const,
        render: (_: any, record: any) => (
          <Space size="small">
            <Tooltip title="Tahrirlash">
              <Button
                onClick={() => editData(record)}
                className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-lg"
                size="small"
              >
                <EditOutlined />
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [navigate],
  )

  const educationLangOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "UZB", label: "O'zbek" },
  ]

  const educationFormOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "SIRTQI", label: "Sirtqi" },
  ]

  const educationTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "BAKALAVR", label: "Bakalavr" },
    { value: "MAGISTR", label: "Magistr" },
  ]

  const activeOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "true", label: "Aktiv" },
    { value: "false", label: "Aktiv emas" },
  ]

  return (
    <>
      <GroupModal open={isModalOpen} handleClose={handleClose} update={update} />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-4 md:p-6 rounded-2xl border border-teal-100">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-lg md:text-xl" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Guruhlar boshqaruvi</h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Guruhlar ro'yxati va ma'lumotlarini boshqaring</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Guruh nomi"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ name: e.target.value })}
              className="h-10 md:h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
            />

            <Select
              allowClear
              placeholder="Ta'lim tili"
              options={educationLangOptions}
              value={educationLang || undefined}
              onChange={(value: string | undefined) => updateParams({ educationLang: value || undefined })}
              className="h-10 md:h-11"
            />

            <Select
              allowClear
              placeholder="Ta'lim shakli"
              options={educationFormOptions}
              value={educationForm || undefined}
              onChange={(value: string | undefined) => updateParams({ educationForm: value || undefined })}
              className="h-10 md:h-11"
            />

            <Select
              allowClear
              placeholder="Ta'lim turi"
              options={educationTypeOptions}
              value={educationType || undefined}
              onChange={(value: string | undefined) => updateParams({ educationType: value || undefined })}
              className="h-10 md:h-11"
            />

            <Select
              allowClear
              placeholder="Aktivligi"
              options={activeOptions}
              value={active || undefined}
              onChange={(value: string | undefined) => updateParams({ active: value || undefined })}
              className="h-10 md:h-11"
            />

            <Button
              type="primary"
              loading={isFetching}
              onClick={() => updateParams({})}
              className="h-10 md:h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              icon={<SearchOutlined />}
            >
              Qidirish
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          <GlobalTable
            loading={isFetching}
            data={tableData}
            columns={columns}
            handleChange={handleTableChange}
            pagination={{
              current: page,
              pageSize: size,
              total,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
              responsive: true,
            }}
            className="rounded-2xl min-w-[800px]" // Ensure minimum width for table content
          />
        </div>
      </div>
    </>
  )
}

export default GroupList