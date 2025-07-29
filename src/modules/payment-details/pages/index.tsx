"use client"

import type React from "react"
import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Card, Table, Spin, Alert, message } from "antd"
import { ArrowLeftOutlined, RedoOutlined, FileTextOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import { useCheckTransactionHistory } from "../../transaction-history/hooks/queries"
import { useRetryTransactionHistory } from "../hooks/mutations"

// const { Title } = Typography

interface RequestData {
  id: number
  paidDate: string
  paidSumm: number
  currencyCode: string
  paymentTypeId: number
  contractNumber: string
  contractDate: string
  clientName: string
  clientPinfl: string
}

const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: apiResponse, isLoading, error } = useCheckTransactionHistory(id || "")

  const transactionId = apiResponse?.data?.id

  const {
    mutate: retryTransaction,
    isPending: isRetrying,
    error: retryError,
    reset: resetMutation,
  } = useRetryTransactionHistory(transactionId || "")

  useEffect(() => {
    return () => {
      resetMutation()
    }
  }, [resetMutation])

  const handleRetry = () => {
    if (!transactionId) {
      message.error("Cannot retry: Transaction ID not available")
      return
    }
    retryTransaction(transactionId)
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">Maydon</span>,
      dataIndex: "key",
      key: "key",
      render: (text: string) => (
        <span className="font-medium text-gray-800">
          {text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Qiymat</span>,
      dataIndex: "value",
      key: "value",
      render: (value: any, record: { key: string }) => {
        if (value === null || value === undefined) return <span className="text-gray-400">-</span>
        if (typeof value === "boolean") return value ? "Ha" : "Yo'q"
        if (["timestamp", "createdAt", "updatedAt", "paidDate"].includes(record.key.toLowerCase())) {
          return <span className="font-mono text-sm">{dayjs(value).format("DD-MM-YYYY HH:mm:ss")}</span>
        }
        if (["paidSumm"].includes(record.key.toLowerCase())) {
          return <span className="font-semibold text-green-600">{`${value.toLocaleString()} UZS`}</span>
        }
        return <span className="text-gray-800">{String(value)}</span>
      },
    },
  ]

  const tableData = apiResponse
    ? (() => {
        const { timestamp, success, errorMessage, data } = apiResponse

        let parsedRequest: RequestData | null = null
        try {
          parsedRequest = JSON.parse(data.request) as RequestData
        } catch (e) {
          console.error("Failed to parse request JSON:", e)
        }

        const topLevelFields = {
          Timestamp: timestamp,
          Success: success,
          "Error Message": errorMessage,
        }

        const dataFields = {
          ID: data.id,
          "Payment ID": data.payment_id,
          Provider: data.provider,
          "Successfully Saved In 1C": data.successfullySavedIn1C,
          "Created At": data.createdAt,
          "Updated At": data.updatedAt,
          Response: data.response,
        }

        const requestFields = parsedRequest
          ? {
              "Request ID": parsedRequest.id,
              "Paid Date": parsedRequest.paidDate,
              "Paid Sum": parsedRequest.paidSumm,
              "Currency Code": parsedRequest.currencyCode,
              "Payment Type ID": parsedRequest.paymentTypeId,
              "Contract Number": parsedRequest.contractNumber,
              "Contract Date": parsedRequest.contractDate,
              "Client Name": parsedRequest.clientName,
              "Client PINFL": parsedRequest.clientPinfl,
            }
          : { "Request (Raw)": data.request }

        return Object.entries({ ...topLevelFields, ...dataFields, ...requestFields }).map(([key, value], index) => ({
          key,
          value,
          id: index,
        }))
      })()
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <FileTextOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Tranzaksiya tafsilotlari</h1>
              <p className="text-gray-600 mt-1">ID: {id}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/super-admin-panel/transaction-history")}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl"
            >
              Ortga
            </Button>
            <Button
              type="primary"
              icon={<RedoOutlined />}
              onClick={handleRetry}
              loading={isRetrying}
              disabled={isLoading || !!error || !transactionId}
              className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl"
            >
              Qayta urinish
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <Spin spinning={isLoading}>
            {error && (
              <Alert
                message="Xato"
                description={error.message || "Tranzaksiya tafsilotlarini yuklashda xato"}
                type="error"
                showIcon
                className="mb-4 rounded-xl"
              />
            )}
            {retryError && (
              <Alert
                message="Qayta urinish xatosi"
                description={retryError.message || "Tranzaksiyani qayta urinishda xato"}
                type="error"
                showIcon
                className="mb-4 rounded-xl"
              />
            )}
            {!isLoading && !error && tableData.length > 0 ? (
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowKey="id"
                locale={{ emptyText: "Ma'lumot mavjud emas" }}
                rowClassName={(record) =>
                  record.key === "Successfully Saved In 1C"
                    ? record.value
                      ? "bg-green-50"
                      : "bg-red-50"
                    : "hover:bg-gray-50"
                }
                className="rounded-xl"
              />
            ) : (
              !isLoading &&
              !error && (
                <Alert
                  message="Ma'lumot topilmadi"
                  description="Ushbu ID uchun tranzaksiya tafsilotlari topilmadi."
                  type="info"
                  showIcon
                  className="rounded-xl"
                />
              )
            )}
          </Spin>
        </Card>
      </div>
    </div>
  )
}

export default TransactionDetails
