"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button, Input, Select, type TablePaginationConfig, Tag } from "antd"
import { useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetPaymentHistory } from "../hooks/queries"
import { HistoryOutlined, SearchOutlined } from "@ant-design/icons"

export type PaymentState = "PAID" | "PENDING" | string

export interface PaymentRecord {
  id: number
  clickTransId: number
  amount: number
  amountWithCommission: number
  pinfl: string
  phone: string
  firstName: string
  lastName: string
  group: string
  speciality: string
  studentIdNumber: string
  action: string
  provider: string
  state: PaymentState
  createdAt?: string
  updatedAt?: string
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>

const PaymentHistory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)
  const size = Number(searchParams.get("size") ?? 10)
  const phone = searchParams.get("phone") ?? ""
  const firstName = searchParams.get("firstName") ?? ""
  const lastName = searchParams.get("lastName") ?? ""
  const pinfl = searchParams.get("pinfl") ?? ""
  const studentIdNumber = searchParams.get("studentIdNumber") ?? ""
  const provider = searchParams.get("provider") ?? ""
  const state = searchParams.get("state") ?? ""
  const from = searchParams.get("from") ?? ""
  const to = searchParams.get("to") ?? ""

  const { data: paymentHistory, isFetching } = useGetPaymentHistory({
    page: page - 1,
    size,
    phone: phone || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    pinfl: pinfl || undefined,
    studentIdNumber: studentIdNumber || undefined,
    provider: provider || undefined,
    state: state || undefined,
    from: from ? Number(from) : undefined,
    to: to ? Number(to) : undefined,
  })

  const [tableData, setTableData] = useState<PaymentRecord[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (paymentHistory?.data?.content) {
      setTableData(paymentHistory.data.content)
      setTotal(paymentHistory.data.paging?.totalItems ?? paymentHistory.data.content.length)
    }
  }, [paymentHistory])

  const updateParams = (changed: Record<string, string | undefined>) => {
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

  const getStatusTagColor = (s: PaymentState): string => {
    switch (s) {
      case "PAID":
        return "green"
      case "PENDING":
        return "orange"
      case "FAILED":
        return "red"
      default:
        return "blue"
    }
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">ID</span>,
        dataIndex: "id",
        key: "id",
        width: 80,
        render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Tranzaksiya ID</span>,
        dataIndex: "clickTransId",
        key: "clickTransId",
        render: (text: any) => <span className="font-mono text-sm text-blue-600">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Miqdori</span>,
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => (
          <span className="font-semibold text-green-600">{`${amount.toLocaleString()} UZS`}</span>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Komissiya bilan miqdori</span>,
        dataIndex: "amountWithCommission",
        key: "amountWithCommission",
        render: (amount: number) => (
          <span className="font-semibold text-blue-600">{`${amount.toLocaleString()} UZS`}</span>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Student</span>,
        key: "student",
        render: (record: PaymentRecord) => (
          <div className="space-y-1">
            <div className="font-medium text-gray-800">{`${record.firstName} ${record.lastName}`}</div>
            <div className="text-xs text-gray-500 font-mono">{record.studentIdNumber}</div>
          </div>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Telefon</span>,
        dataIndex: "phone",
        key: "phone",
        render: (text: any) => <span className="font-mono text-sm">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Guruh</span>,
        dataIndex: "group",
        key: "group",
        render: (text: any) => (
          <Tag color="blue" className="rounded-lg">
            {text}
          </Tag>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Mutaxasislik</span>,
        dataIndex: "speciality",
        key: "speciality",
        render: (text: any) => <span className="text-gray-700">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Status</span>,
        dataIndex: "state",
        key: "state",
        render: (state: PaymentState) => (
          <Tag color={getStatusTagColor(state)} className="rounded-lg font-medium px-3 py-1">
            {state}
          </Tag>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">To'lov uslubi</span>,
        dataIndex: "provider",
        key: "provider",
        render: (text: any) => (
          <Tag color="purple" className="rounded-lg">
            {text}
          </Tag>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Amal</span>,
        dataIndex: "action",
        key: "action",
        render: (text: any) => <span className="text-gray-700">{text}</span>,
      },
    ],
    [],
  )

  const stateOptions = [
    { value: "", label: "Barchasi" },
    { value: "PAID", label: "To'langan" },
    { value: "PENDING", label: "Kutilmoqda" },
    { value: "PENDING_CANCELED", label: "Kutish bekor qilindi" },
    { value: "PAID_CANCELED", label: "To'lov bekor qilindi" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <HistoryOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">To'lovlar tarixi</h1>
            <p className="text-gray-600 mt-1">Barcha to'lovlar tarixi va holati</p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Telefon raqami"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ phone: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="Student ID"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={studentIdNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ studentIdNumber: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="Ism"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ firstName: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="Familiya"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ lastName: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Input
            placeholder="PINFL"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={pinfl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ pinfl: e.target.value })}
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
          />

          <Select
            allowClear
            placeholder="Status"
            options={stateOptions}
            value={state || undefined}
            onChange={(v) => updateParams({ state: v || undefined })}
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
            total: total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default PaymentHistory
