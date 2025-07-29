"use client"

import type React from "react"

import { useNavigate, useParams } from "react-router-dom"
import { useGetStudentById, useGetStudentsDiscounts, useGetStudentsTrInfo } from "../hooks/queries"
import { useToggleDebtActive } from "../hooks/mutations"
import { Card, Descriptions, Image, Typography, Table, Button, Tabs, Space, Tooltip, message, Switch } from "antd"
import {
  ArrowLeftOutlined,
  EditOutlined,
  DownloadOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  DollarOutlined,
  CreditCardOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { FiEye } from "react-icons/fi"
import { downloadDiscountReason } from "../service"
import DiscountsModal from "./modal"
import StudentDebtsTable from "../../debt/pages"
import AuditModal from "./auditModal"

const { Title, Text } = Typography

const StudentDetails: React.FC = () => {
  const [audetModalOpen, setAudetModalOpen] = useState<boolean>(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  const { mutate: toggleActive } = useToggleDebtActive()

  const handleToggle = (id: string | number) => {
    toggleActive(id)
  }

  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: studentResponse } = useGetStudentById(id)
  const student = studentResponse?.data

  const { data: trInfoResponse } = useGetStudentsTrInfo({ id })
  const { data: studentsDiscounts } = useGetStudentsDiscounts({ studentId: id })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<any | null>(null)

  const trInfo = trInfoResponse?.data
  const discounts = studentsDiscounts?.data?.content

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }

  const editData = (item: any) => {
    setUpdate(item)
    showModal()
  }

  const audetModal: () => void = () => {
    setAudetModalOpen(true)
  }

  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: downloadDiscountReason,
    onMutate: (reasonFile) => {
      message.loading({ content: "Fayl yuklanmoqda...", key: "download" })
       console.log("[useMutation] Initiating download for reasonFile:", reasonFile);
    },
    onSuccess: (data, reasonFile) => {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement("a")
      link.href = url
      link.download = `discount_reason_${reasonFile}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success({ content: "Fayl yuklab olindi!", key: "download" })
    },
    onError: (error: any) => {
      if (error.message === "Authentication token not found") {
        message.error({ content: "Tizimga kirish uchun token topilmadi! Iltimos, qayta kiring.", key: "download" })
        navigate("/login")
      } else {
        message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" })
      }
    },
  })

  const handleBack = () => {
    const queryParams = new URLSearchParams(location.search)
    const page = queryParams.get("page") || "1"
    const size = queryParams.get("size") || "10"
    const backUrl = `/super-admin-panel/students?page=${page}&size=${size}`
    navigate(backUrl)
  }

  const handleDownload = (reasonFile: string) => {
    if (reasonFile) {
      downloadFile(reasonFile)
    } else {
      message.error({ content: "Fayl ID topilmadi!", key: "download" })
    }
  }

  const transactionColumns = [
    {
      title: <span className="font-semibold text-gray-700">Sana</span>,
      dataIndex: "date",
      key: "date",
      render: (date: string) => <span className="text-gray-800">{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Shartnoma raqami</span>,
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (text: string) => <span className="font-mono text-sm text-blue-600">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Summa</span>,
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-semibold text-green-600">{amount.toLocaleString()} UZS</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Valyuta</span>,
      dataIndex: "currencyCode",
      key: "currencyCode",
      render: (code: string) => (
        <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm font-medium">{code === "860" ? "UZS" : code}</span>
      ),
    },
  ]

  const discountColumns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Chegirma tarifi</span>,
      dataIndex: "description",
      key: "description",
      render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Chegirma turi</span>,
      dataIndex: "discountType",
      key: "discountType",
      render: (text: any) => (
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Miqdori</span>,
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => <span className="font-semibold text-green-600">{amount.toLocaleString()} UZS</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Talaba kursi</span>,
      dataIndex: "studentLevel",
      key: "studentLevel",
      render: (text: any) => (
        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Holat</span>,
      dataIndex: "active",
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggle(record.id)}
          className={active ? "bg-green-500" : "bg-gray-400"}
        />
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Amallar</span>,
      key: "action",
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button
              onClick={() => editData(record)}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
              size="small"
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          {record?.reasonFile && (
            <Tooltip title="Faylni yuklab olish">
              <Button
                onClick={() => handleDownload(record?.reasonFile)}
                loading={isDownloading}
                disabled={isDownloading}
                className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                size="small"
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          )}

          {record?.id && (
            <Tooltip title="Ko'rish">
              <Button
                onClick={() => {
                  setSelectedRecord(record)
                  audetModal()
                }}
                className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                size="small"
              >
                <FiEye size={16} />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="min-h-screen  p-6">
      <DiscountsModal open={isModalOpen} handleClose={handleClose} studentId={id} update={update} />

      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={handleBack}
            className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:border-white/50 transition-all duration-200 px-2"
            icon={<ArrowLeftOutlined />}
          >
            Ortga
          </Button>
        </div>

        {/* Main Card */}
        <Card
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border-0 overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Student Header */}
          <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl">
            <div className="relative">
              <Image
                width={120}
                height={140}
                src={student?.image || "/placeholder.svg"}
                className="rounded-2xl shadow-lg border-4 border-white"
                fallback="https://via.placeholder.com/120x140"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <UserOutlined className="text-white text-sm" />
              </div>
            </div>
            <div className="flex-1">
              <Title level={2} className="text-gray-800 mb-2">
                {student?.fullName}
              </Title>
              <Text className="text-gray-600 text-lg">{student?.universityName}</Text>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm font-medium text-gray-600">Student ID:</span>
                  <span className="font-bold text-teal-600">{student?.studentIdNumber}</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <span className="text-sm font-medium text-gray-600">PINFL:</span>
                  <span className="font-mono text-sm text-gray-800">{student?.pinfl || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <Descriptions
            bordered
            column={2}
            size="middle"
            className="mb-8 bg-white rounded-2xl overflow-hidden shadow-sm"
            labelStyle={{
              fontWeight: "600",
              backgroundColor: "#f8fafc",
              color: "#374151",
            }}
          >
            <Descriptions.Item label="Telefon">{student?.phone || "-"}</Descriptions.Item>
            <Descriptions.Item label="Tug'ilgan sana">
              {(() => {
                const date = new Date(student?.birthDate * 1000)
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = String(date.getDate()).padStart(2, "0")
                const monthNames = [
                  "yanvar",
                  "fevral",
                  "mart",
                  "aprel",
                  "may",
                  "iyun",
                  "iyul",
                  "avgust",
                  "sentyabr",
                  "oktyabr",
                  "noyabr",
                  "dekabr",
                ]
                return `${year}-yil ${day}-${monthNames[month]}`
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Kursi">{student?.levelName}</Descriptions.Item>
            <Descriptions.Item label="Mutaxasisligi">{student?.specialtyName}</Descriptions.Item>
            <Descriptions.Item label="Guruhi">{student?.groupName}</Descriptions.Item>
            <Descriptions.Item label="Ta'lim shakli">{student?.educationTypeName}</Descriptions.Item>
            <Descriptions.Item label="Mamlakat">{student?.countryName}</Descriptions.Item>
            <Descriptions.Item label="Viloyat">{student?.provinceName}</Descriptions.Item>
            <Descriptions.Item label="Tuman" span={2}>
              {student?.districtName}
            </Descriptions.Item>
          </Descriptions>

          {/* Financial Report */}
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 mb-8 border border-teal-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
                <DollarOutlined className="text-white text-sm" />
              </div>
              Moliyaviy Hisobot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCardOutlined className="text-blue-500 text-lg" />
                  <span className="text-sm font-medium text-gray-600">Shartnoma summasi</span>
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {trInfo?.paymentDetails.studentContractAmount
                    ? Number(trInfo?.paymentDetails.studentContractAmount).toLocaleString()
                    : "0"}{" "}
                  UZS
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <CheckOutlined className="text-green-500 text-lg" />
                  <span className="text-sm font-medium text-gray-600">Chegirma summasi</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {trInfo?.paymentDetails.studentDiscountAmount
                    ? Number(trInfo?.paymentDetails.studentDiscountAmount).toLocaleString()
                    : "0"}{" "}
                  UZS
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <DollarOutlined className="text-blue-500 text-lg" />
                  <span className="text-sm font-medium text-gray-600">To'langan summa</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {trInfo?.paymentDetails.studentPaidAmount
                    ? Number(trInfo?.paymentDetails.studentPaidAmount).toLocaleString()
                    : "0"}{" "}
                  UZS
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <ExclamationCircleOutlined className="text-red-500 text-lg" />
                  <span className="text-sm font-medium text-gray-600">Qarzdorlik</span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    Number(trInfo?.paymentDetails.studentDebtAmount) < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {Number(trInfo?.paymentDetails.studentDebtAmount) > 0 ? "+" : ""}
                  {trInfo ? Number(trInfo?.paymentDetails.studentDebtAmount).toLocaleString() : "0"} UZS
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <ExclamationCircleOutlined className="text-orange-500 text-lg" />
                  <span className="text-sm font-medium text-gray-600">Qo'shimcha qarzdorlik</span>
                </div>
                <span
                  className={`text-lg font-bold ${
                    Number(trInfo?.paymentDetails.studentAdditionalDebtAmount) > 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {Number(trInfo?.paymentDetails.studentAdditionalDebtAmount) > 0 ? "-" : ""}
                  {trInfo ? Number(trInfo?.paymentDetails.studentAdditionalDebtAmount).toLocaleString() : "0"} UZS
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            defaultActiveKey="transactions"
            className="custom-tabs"
            items={[
              {
                key: "transactions",
                label: (
                  <span className="flex items-center gap-2 font-medium">
                    <CreditCardOutlined />
                    Tranzaksiyalar tarixi
                  </span>
                ),
                children: (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    {trInfo?.transactions?.length ? (
                      <>
                        <Table
                          columns={transactionColumns}
                          dataSource={trInfo.transactions}
                          rowKey="date"
                          pagination={false}
                          className="mb-6"
                        />
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                          <Text className="text-lg font-bold text-green-700">
                            Jami to'langan: {(Number(trInfo?.paymentDetails.studentPaidAmount) || 0).toLocaleString()}{" "}
                            UZS
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 flex items-center justify-center gap-2">
                        <CreditCardOutlined className="text-4xl text-gray-300" />
                        <Text className="text-gray-500">Tranzaksiyalar topilmadi</Text>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "discounts",
                label: (
                  <span className="flex items-center gap-2 font-medium">
                    <DollarOutlined />
                    Chegirmalar
                  </span>
                ),
                children: (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-end mb-6">
                      <Button
                        type="primary"
                        onClick={showModal}
                        className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        icon={<DollarOutlined />}
                      >
                        Yangi chegirma
                      </Button>
                    </div>
                    {discounts?.length ? (
                      <Table columns={discountColumns} dataSource={discounts} rowKey="id" pagination={false} />
                    ) : (
                      <div className="text-center py-12 flex justify-center items-center gap-2 ">
                        <DollarOutlined className="text-4xl text-gray-300 " />
                        <Text className="text-gray-500">Chegirmalar topilmadi</Text>
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "debts",
                label: (
                  <span className="flex items-center gap-2 font-medium">
                    <ExclamationCircleOutlined />
                    Qarzdorlik
                  </span>
                ),
                children: <StudentDebtsTable studentId={id} />,
              },
            ]}
          />
        </Card>
      </div>

      <AuditModal audetModalOpen={audetModalOpen} setAudetModalOpen={setAudetModalOpen} record={selectedRecord} />
    </div>
  )
}

export default StudentDetails
