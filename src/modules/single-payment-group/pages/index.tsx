"use client"

import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetOneGroup } from "../hooks/queries"
import type { PaymentGroup } from "@types"
import { Card, Descriptions, Tag, Spin, Alert, Typography, Button } from "antd"
import { ArrowLeftOutlined, TeamOutlined, DollarOutlined } from "@ant-design/icons"

const { Title } = Typography

const Index = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: response, isLoading, error } = useGetOneGroup(id)

  const paymentGroup: PaymentGroup | undefined = response?.data

  useEffect(() => {
    console.log("Payment Group Response:", response, "ID:", id)
  }, [response, id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg">
          <Spin size="large" tip="Ma'lumotlar yuklanmoqda..." />
        </div>
      </div>
    )
  }

  if (error || !response?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Alert
            message="Xato"
            description={error?.message || response?.errorMessage || "To'lov guruhini yuklashda xato."}
            type="error"
            showIcon
            className="rounded-2xl shadow-lg mb-6"
          />
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl"
          >
            Ortga
          </Button>
        </div>
      </div>
    )
  }

  if (!paymentGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Alert
            message="Ma'lumot topilmadi"
            description="Berilgan ID uchun to'lov guruhi topilmadi."
            type="warning"
            showIcon
            className="rounded-2xl shadow-lg mb-6"
          />
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="bg-white px-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl"
          >
            Ortga
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <TeamOutlined className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">To'lov guruhi tafsilotlari</h1>
                <p className="text-gray-600 mt-1">ID: {paymentGroup.id}</p>
              </div>
            </div>

            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl"
            >
              Ortga
            </Button>
          </div>
        </div>

        {/* Payment Group Details */}
        <Card className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
              <DollarOutlined className="text-teal-600 text-lg" />
            </div>
            <Title level={3} className="!mb-0 !text-gray-800">
              To'lov guruhi ma'lumotlari
            </Title>
          </div>

          <Descriptions bordered column={1} className="rounded-xl overflow-hidden">
            <Descriptions.Item
              label={<span className="font-semibold text-gray-700">ID</span>}
              labelStyle={{ backgroundColor: "#f8fafc", fontWeight: "600" }}
            >
              <span className="font-mono text-blue-600">#{paymentGroup.id}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={<span className="font-semibold text-gray-700">Nomi</span>}
              labelStyle={{ backgroundColor: "#f8fafc", fontWeight: "600" }}
            >
              <span className="font-medium text-gray-800">{paymentGroup.name}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={<span className="font-semibold text-gray-700">Muddati</span>}
              labelStyle={{ backgroundColor: "#f8fafc", fontWeight: "600" }}
            >
              <span className="font-medium text-gray-800">{paymentGroup.duration} yil</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={<span className="font-semibold text-gray-700">Kontrakt miqdorlari</span>}
              labelStyle={{ backgroundColor: "#f8fafc", fontWeight: "600" }}
            >
              <div className="flex flex-wrap gap-2">
                {Object.entries(paymentGroup.contractAmounts).map(([year, amount]) => (
                  <Tag key={year} color="blue" className="px-3 py-1 rounded-lg font-medium text-sm">
                    Yil {year}: {amount?.toLocaleString()} UZS
                  </Tag>
                ))}
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={<span className="font-semibold text-gray-700">Guruh ID lari</span>}
              labelStyle={{ backgroundColor: "#f8fafc", fontWeight: "600" }}
            >
              <div className="flex flex-wrap gap-2">
                {paymentGroup?.groupIds?.map((group) => (
                  <Tag key={group.id} color="green" className="px-3 py-1 rounded-lg font-medium text-sm">
                    {`${group.id} - ${group.name}`}
                  </Tag>
                ))}
              </div>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </div>
  )
}

export default Index
