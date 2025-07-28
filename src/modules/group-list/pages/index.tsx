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
  hemisId: number
  name: string
  educationLang: string
  educationForm: string
  educationType: string
  curriculum: number
  active: boolean
  specialityFormId: number
  paymentGroupId: number | null
  level: number | null
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
        hemisId: item.hemisId,
        name: item.name,
        educationLang: item.educationLang,
        educationForm: item.educationForm,
        educationType: item.educationType,
        curriculum: item.curriculum,
        active: item.active,
        specialityFormId: item.specialityFormId,
        paymentGroupId: item.paymentGroupId,
        level: item.level,
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
        title: <span className="font-semibold text-gray-700">ID</span>,
        dataIndex: "id",
        key: "id",
        render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.id - b.id,
      },
      {
        title: <span className="font-semibold text-gray-700">Hemis ID</span>,
        dataIndex: "hemisId",
        key: "hemisId",
        render: (text: any) => <span className="font-mono text-sm text-blue-600">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.hemisId - b.hemisId,
      },
      {
        title: <span className="font-semibold text-gray-700">Nomi</span>,
        dataIndex: "name",
        key: "name",
        render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.name.localeCompare(b.name),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim tili</span>,
        dataIndex: "educationLang",
        key: "educationLang",
        render: (text: any) => (
          <Tag color="blue" className="rounded-lg font-medium">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationLang.localeCompare(b.educationLang),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
        dataIndex: "educationForm",
        key: "educationForm",
        render: (text: any) => (
          <Tag color="purple" className="rounded-lg font-medium">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationForm.localeCompare(b.educationForm),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim turi</span>,
        dataIndex: "educationType",
        key: "educationType",
        render: (text: any) => (
          <Tag color="orange" className="rounded-lg font-medium">
            {text}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationType.localeCompare(b.educationType),
      },
      {
        title: <span className="font-semibold text-gray-700">Ta'lim dasturi</span>,
        dataIndex: "curriculum",
        key: "curriculum",
        render: (text: any) => <span className="text-gray-800">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.curriculum - b.curriculum,
      },
      {
        title: <span className="font-semibold text-gray-700">Aktiv</span>,
        dataIndex: "active",
        key: "active",
        render: (active: boolean) => (
          <Tag color={active ? "green" : "red"} className="rounded-lg font-medium px-3 py-1">
            {active ? "Aktiv" : "Aktiv emas"}
          </Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => Number(a.active) - Number(b.active),
      },
      {
        title: <span className="font-semibold text-gray-700">Mutaxasislik ID</span>,
        dataIndex: "specialityFormId",
        key: "specialityFormId",
        render: (text: any) => <span className="text-gray-800">{text}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => a.specialityFormId - b.specialityFormId,
      },
      {
        title: <span className="font-semibold text-gray-700">To'lov guruhi ID</span>,
        dataIndex: "paymentGroupId",
        key: "paymentGroupId",
        render: (value: number | null) => <span className="text-gray-800">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.paymentGroupId || 0) - (b.paymentGroupId || 0),
      },
      {
        title: <span className="font-semibold text-gray-700">Kurs</span>,
        dataIndex: "level",
        key: "level",
        render: (value: number | null) => <span className="text-gray-800">{value ? value : "-"}</span>,
        sorter: (a: GroupRecord, b: GroupRecord) => (a.level || 0) - (b.level || 0),
      },
      {
        title: <span className="font-semibold text-gray-700">Amallar</span>,
        key: "action",
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
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Guruhlar boshqaruvi</h1>
              <p className="text-gray-600 mt-1">Guruhlar ro'yxati va ma'lumotlarini boshqaring</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Guruh nomi"
              prefix={<SearchOutlined className="text-gray-400" />}
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ name: e.target.value })}
              className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
            />

            <Select
              allowClear
              placeholder="Ta'lim tili"
              options={educationLangOptions}
              value={educationLang || undefined}
              onChange={(value: string | undefined) => updateParams({ educationLang: value || undefined })}
              className="h-11"
            />

            <Select
              allowClear
              placeholder="Ta'lim shakli"
              options={educationFormOptions}
              value={educationForm || undefined}
              onChange={(value: string | undefined) => updateParams({ educationForm: value || undefined })}
              className="h-11"
            />

            <Select
              allowClear
              placeholder="Ta'lim turi"
              options={educationTypeOptions}
              value={educationType || undefined}
              onChange={(value: string | undefined) => updateParams({ educationType: value || undefined })}
              className="h-11"
            />

            <Select
              allowClear
              placeholder="Aktivligi"
              options={activeOptions}
              value={active || undefined}
              onChange={(value: string | undefined) => updateParams({ active: value || undefined })}
              className="h-11"
            />

            <Button
              type="primary"
              loading={isFetching}
              onClick={() => updateParams({})}
              className="h-11 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              icon={<SearchOutlined />}
            >
              Qidirish
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
            }}
            className="rounded-2xl"
          />
        </div>
      </div>
    </>
  )
}

export default GroupList
