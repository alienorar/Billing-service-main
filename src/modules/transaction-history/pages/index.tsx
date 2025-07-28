"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Button, DatePicker, Input, Select, type TablePaginationConfig, Tag } from "antd"
import type { Dayjs } from "dayjs"
import dayjs from "dayjs"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetTransactionHistory } from "../hooks/queries"
import type { RangePickerTimeProps } from "antd/es/time-picker"
import { HistoryOutlined, SearchOutlined, CalendarOutlined } from "@ant-design/icons"
import type { JSX } from "react/jsx-runtime"

const { RangePicker } = DatePicker

export type TransactionState = "PENDING" | "CANCELLED" | "SUCCESS" | string

export interface TransactionRecord {
  id: number
  identifier: string
  amount: number
  currencyCode: string
  pinfl: string
  contractDate: string
  contractNumber: string
  docNumber: string
  status: TransactionState
  provider: string
  phone: string
  firstName: string
  lastName: string
  group: string
  speciality: string
  studentIdNumber: string
  createdAt: string
  updatedAt: string
  createdDate: number
  existIn1C: boolean
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)) as Record<string, string>

const TransactionHistory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

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

  const { data: transactionHistory, isFetching } = useGetTransactionHistory({
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

  const [tableData, setTableData] = useState<TransactionRecord[]>([])
  const [total, setTotal] = useState<number>(0)

  useEffect(() => {
    if (transactionHistory?.data?.items) {
      const normalized: TransactionRecord[] = (transactionHistory.data.items as any[]).map((item) => {
        const student = item.student ?? {}
        return {
          id: item.id,
          identifier: item.identifier,
          amount: item.amount,
          currencyCode: item.currencyCode,
          pinfl: item.pinfl,
          contractDate: item.contractDate,
          contractNumber: item.contractNumber,
          docNumber: item.docNumber,
          status: item.status,
          provider: item.provider,
          phone: student.phone ?? "",
          firstName: student.firstName ?? "",
          lastName: student.lastName ?? "",
          group: student.group ?? "",
          speciality: student.speciality ?? "",
          studentIdNumber: student.studentIdNumber ?? "",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          createdDate: dayjs(item.createdAt, "DD-MM-YYYY HH:mm:ss").valueOf(),
          existIn1C: item.existIn1C ?? false,
        } as TransactionRecord
      })
      setTableData(normalized)
      setTotal(transactionHistory.data.paging.totalItems ?? 0)
    }
  }, [transactionHistory])

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

  const handleDateChange: RangePickerTimeProps<Dayjs>["onChange"] = (dates, _dateStrings) => {
    if (dates && dates[0] && dates[1]) {
      updateParams({
        from: dates[0].startOf("day").valueOf().toString(),
        to: dates[1].endOf("day").valueOf().toString(),
      })
    } else {
      updateParams({ from: undefined, to: undefined })
    }
  }

  const getStatusTagColor = (s: TransactionState): string => {
    switch (s) {
      case "SUCCESS":
        return "green"
      case "PENDING":
        return "orange"
      case "CANCELLED":
        return "volcano"
      default:
        return "blue"
    }
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">Sana</span>,
        dataIndex: "createdDate",
        key: "date",
        render: (ts: number): string => dayjs(ts).format("DD-MM-YYYY HH:mm"),
      },
      {
        title: <span className="font-semibold text-gray-700">Tranzaksiya ID</span>,
        dataIndex: "id",
        key: "id",
        render: (text: any) => <span className="font-mono text-sm text-blue-600">#{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Miqdor</span>,
        dataIndex: "amount",
        key: "amount",
       render: (amount: number): string => `${amount.toLocaleString()} UZS`,
      },
      {
        title: <span className="font-semibold text-gray-700">Student</span>,
        key: "student",
        render: (record: TransactionRecord): JSX.Element => (
          <div className="space-y-1">
            <div className="font-medium text-gray-800">{`${record.firstName} ${record.lastName}`}</div>
            <div className="text-xs text-gray-500 font-mono">{record.pinfl}</div>
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
        dataIndex: "status",
        key: "status",
        render: (s: TransactionState): JSX.Element => (
          <Tag color={getStatusTagColor(s)} className="rounded-lg font-medium px-3 py-1">
            {s}
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
        title: <span className="font-semibold text-gray-700">Amallar</span>,
        key: "action",
        render: (record: TransactionRecord): JSX.Element | null =>
          record.provider !== "BANK" ? (
            <Button
              type="primary"
              size="small"
              onClick={() => navigate(`/super-admin-panel/transaction-history/${record.id}`)}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-lg"
            >
              Tekshirish
            </Button>
          ) : null,
      },
    ],
    [navigate],
  )

  const providerOptions = [
    { value: "", label: "Barchasi" },
    { value: "CLICK", label: "Click" },
    { value: "PAYME", label: "Payme" },
    { value: "XAZNA", label: "Xazna" },
    { value: "UZUM", label: "Uzum" },
    { value: "BANK", label: "Bank" },
  ]

  const stateOptions = [
    { value: "SUCCESS", label: "Muvaffaqiyatli" },
    { value: "PENDING", label: "Kutilmoqda" },
    { value: "CANCELLED", label: "Bekor qilingan" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <HistoryOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tranzaksiyalar tarixi</h1>
            <p className="text-gray-600 mt-1">Barcha to'lov tranzaksiyalarini kuzatish</p>
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
            placeholder="To'lov uslubi"
            options={providerOptions}
            value={provider || undefined}
            onChange={(v) => updateParams({ provider: v || undefined })}
            className="h-11"
          />
          <Select
            allowClear
            placeholder="Status"
            options={stateOptions}
            value={state || undefined}
            onChange={(v) => updateParams({ state: v || undefined })}
            className="h-11"
          />
          <RangePicker
            className="h-11 rounded-xl border-gray-200 focus:border-teal-400 transition-all duration-200"
            format="DD-MM-YYYY"
            value={from && to ? [dayjs(Number(from)), dayjs(Number(to))] : undefined}
            onChange={handleDateChange}
            allowClear
            suffixIcon={<CalendarOutlined className="text-teal-500" />}
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
          rowClassName={(record: TransactionRecord) =>
            record.provider !== "BANK" ? (record.existIn1C ? "bg-green-50" : "bg-red-50") : ""
          }
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default TransactionHistory
