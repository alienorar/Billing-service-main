"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button, Input, Select, type TablePaginationConfig, Alert, Spin } from "antd"
import { FiSearch, FiFileText, FiChevronUp, FiChevronDown } from "react-icons/fi"
// import { GlobalTable } from "../GlobalTable"
import { useGetLog } from "../hooks/queries"
import { GlobalTable } from "@components"

const { Option } = Select

// Define interfaces for the data structure
interface Log {
  [x: string]: any
  id?: number
  pinfl?: string
  type?: string
  paymentDetails?: {
    contractAmount: number
    discountAmount: number
    additionalDebtAmount: number
    paidAmount: number
    calculatedDebt: number
    extraPayment: number | string
  }
  fullName?: string
}

const Index: React.FC = () => {
  const [tableData, setTableData] = useState<Log[]>([])
  const [total, setTotal] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const page = Number(searchParams.get("page")) || 1
  const size = Number(searchParams.get("size")) || 10
  const pinfl = searchParams.get("pinfl") || ""
  const type = searchParams.get("type") || ""
  const name = searchParams.get("name") || ""
  const sortBy = searchParams.get("sortBy") || "calculatedDebt"
  const direction = searchParams.get("direction") || "DESC"

  const {
    data: logs,
    isLoading,
    isError,
    error,
  } = useGetLog({
    page: page - 1,
    size,
    pinfl: pinfl || undefined,
    type: type || undefined,
    name: name || undefined,
    sortBy,
    direction,
  })

  useEffect(() => {
    setTableData(logs?.data?.content || [])
    setTotal(logs?.data?.paging?.totalItems || 0)
  }, [logs])

  const updateSearchParams = (params: Record<string, string>) => {
    setSearchParams({
      page: params.page,
      size: params.size,
      pinfl: params.pinfl,
      type: params.type,
      name: params.name,
      sortBy: params.sortBy,
      direction: params.direction,
    })
  }

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current ?? 1
    const pageSize = pagination.pageSize ?? 10
    updateSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      pinfl,
      type,
      name,
      sortBy,
      direction,
    })
  }

  const handleSearch = () => {
    updateSearchParams({
      page: "1",
      size: size.toString(),
      pinfl,
      type,
      name,
      sortBy,
      direction,
    })
  }

  const handleSort = (field: string) => {
    const newDirection = sortBy === field && direction === "ASC" ? "DESC" : "ASC"
    updateSearchParams({
      page: "1",
      size: size.toString(),
      pinfl,
      type,
      name,
      sortBy: field,
      direction: newDirection,
    })
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <div className="flex flex-col ml-1 opacity-50 hover:opacity-100 transition-opacity">
          <FiChevronUp className="text-gray-400 text-xs -mb-1" />
          <FiChevronDown className="text-gray-400 text-xs" />
        </div>
      )
    }
    return direction === "ASC" ? (
      <FiChevronUp className="text-blue-600 ml-1 text-sm font-bold" />
    ) : (
      <FiChevronDown className="text-blue-600 ml-1 text-sm font-bold" />
    )
  }

  const formatCurrency = (value: number | undefined): string => {
    return value !== undefined ? `${value.toLocaleString()} UZS` : "-"
  }

  const handleRowClick = (record: Log) => {
    if (record.id) {
      navigate(`/super-admin-panel/students/${record.studentId}`)
    }
  }

  const columns = [
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("id")}
        >
          <span className="font-semibold text-gray-700">ID</span>
          {getSortIcon("id")}
        </div>
      ),
      dataIndex: "id",
      render: (value?: number) => <span className="font-medium text-gray-600">#{value ?? "-"}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("fullName")}
        >
          <span className="font-semibold text-gray-700">To'liq ism</span>
          {getSortIcon("fullName")}
        </div>
      ),
      dataIndex: "fullName",
      render: (value?: string) => <span className="font-medium text-gray-800">{value ?? "-"}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("pinfl")}
        >
          <span className="font-semibold text-gray-700">PINFL</span>
          {getSortIcon("pinfl")}
        </div>
      ),
      dataIndex: "pinfl",
      render: (value?: string) => <span className="font-mono text-sm text-gray-600">{value ?? "-"}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("type")}
        >
          <span className="font-semibold text-gray-700">Type</span>
          {getSortIcon("type")}
        </div>
      ),
      dataIndex: "type",
      render: (value?: string) => (
        <span className="text-blue-600 font-medium px-2 py-1 rounded-lg bg-blue-50">{value ?? "-"}</span>
      ),
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("contractAmount")}
        >
          <span className="font-semibold text-gray-700">Shartnoma summasi</span>
          {getSortIcon("contractAmount")}
        </div>
      ),
      dataIndex: ["paymentDetails", "contractAmount"],
      render: (value?: number) => <span className="text-gray-800 text-sm">{formatCurrency(value)}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("discount")}
        >
          <span className="font-semibold text-gray-700">Chegirma</span>
          {getSortIcon("discount")}
        </div>
      ),
      dataIndex: ["paymentDetails", "discountAmount"],
      render: (value?: number) => <span className="text-gray-800 text-sm">{formatCurrency(value)}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("additionalDebt")}
        >
          <span className="font-semibold text-gray-700">Qo'shimcha qarz</span>
          {getSortIcon("additionalDebt")}
        </div>
      ),
      dataIndex: ["paymentDetails", "additionalDebtAmount"],
      render: (value?: number) => <span className="text-gray-800 text-sm">{formatCurrency(value)}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("paid")}
        >
          <span className="font-semibold text-gray-700">To'langan</span>
          {getSortIcon("paid")}
        </div>
      ),
      dataIndex: ["paymentDetails", "paidAmount"],
      render: (value?: number) => <span className="text-green-600 text-sm">{formatCurrency(value)}</span>,
    },
    {
      title: (
        <div
          className="flex items-center cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-all duration-200 select-none"
          onClick={() => handleSort("calculatedDebt")}
        >
          <span className="font-semibold text-gray-700">Qarzdorlik</span>
          {getSortIcon("calculatedDebt")}
        </div>
      ),
      dataIndex: ["paymentDetails", "calculatedDebt"],
      render: (value?: number) => (
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold  text-red-600 bg-red-50 `}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Oldindan to'lov</span>,
      dataIndex: ["paymentDetails", "extraPayment"],
      render: (value?: number) => (
        <span className={`px-3 py-1 rounded-lg text-sm font-semibold  text-green-600 bg-green-50 `}>
          {formatCurrency(value)}
        </span>
      ),
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg">
          <Spin size="large" tip="Ma'lumotlarni yuklash...">
            <div className="w-32 h-32" />
          </Spin>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Alert
            message="Xato"
            description={error?.message || "Loglarni yuklashda xato yuz berdi. Iltimos, qayta urinib ko'ring."}
            type="error"
            showIcon
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <FiFileText className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Loglar boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Log ma'lumotlarini ko'ring va boshqaring</p>
          </div>
        </div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="PINFL"
            value={pinfl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSearchParams({
                page: "1",
                size: size.toString(),
                pinfl: e.target.value,
                type,
                name,
                sortBy,
                direction,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />
          <Select
            placeholder="Type"
            value={type || undefined}
            onChange={(value) =>
              updateSearchParams({
                page: "1",
                size: size.toString(),
                pinfl,
                type: value || "",
                name,
                sortBy,
                direction,
              })
            }
            className="h-10 rounded-xl"
            allowClear
            size="large"
          >
            <Option value="STUDENT">STUDENT</Option>
            <Option value="ABITURIENT">ABITURIENT</Option>
          </Select>
          <Input
            placeholder="Ism"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateSearchParams({
                page: "1",
                size: size.toString(),
                pinfl,
                type,
                name: e.target.value,
                sortBy,
                direction,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />
          <Select
            placeholder="Sort Direction"
            value={direction}
            onChange={(value) =>
              updateSearchParams({
                page: "1",
                size: size.toString(),
                pinfl,
                type,
                name,
                sortBy,
                direction: value,
              })
            }
            className="h-10 rounded-xl"
            size="large"
          >
            <Option value="ASC">ASC</Option>
            <Option value="DESC">DESC</Option>
          </Select>
          <Button
            type="primary"
            onClick={handleSearch}
            className="h-10 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<FiSearch />}
          >
            Qidirish
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-scroll">
        <GlobalTable
          loading={isLoading}
          data={tableData}
          columns={columns}
          handleChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: size,
            total: total || 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          onRow={(record: Log) => ({
            onClick: () => handleRowClick(record),
            className: "cursor-pointer hover:bg-gray-50",
          })}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default Index
