"use client"

import React, { useEffect, useState } from "react"
import { useGetUniversityStatistics } from "../hooks/queries"
import { Card, Row, Col, Statistic, Spin, Alert, Typography,  Grid } from "antd"
import { TeamOutlined, DollarOutlined, FileTextOutlined, PercentageOutlined, BankOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
// const { useToken } = theme
const { useBreakpoint } = Grid

interface UniversityStatistics {
  name: string
  studentCount: number
  contractStudentCount: number
  allStudentContractMustPaidAmount: number
  allStudentDebtAmount: number
  allStudentRemainContractAmount: number
  allStudentPaidAmount: number
  allDiscountAmount: number
}

const Index = () => {
  // const { token } = useToken()
  const screens = useBreakpoint()
  const [tableData, setTableData] = useState<UniversityStatistics | null>(null)
  const { data: statisticsData, isLoading, isError, error } = useGetUniversityStatistics()

  useEffect(() => {
    if (statisticsData?.data) {
      setTableData(statisticsData.data)
    }
  }, [statisticsData])

  const formatCurrency = (amount: string | number) => {
    return `${Number(amount).toLocaleString()} UZS`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg">
          <Spin size="large" tip="Statistikani yuklash...">
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
            description={
              error.message || "Universitet statistikasini yuklashda xato yuz berdi. Iltimos, qayta urinib ko'ring."
            }
            type="error"
            showIcon
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    )
  }

  if (!tableData) {
    return null
  }

  const statsCards = [
    {
      title: "Jami Talabalar",
      value: tableData.studentCount,
      icon: <TeamOutlined />,
      color: "#1890ff",
      background: "from-blue-50 to-cyan-50",
      span: 8,
    },
    {
      title: "Shartnoma Talabalari",
      value: tableData.contractStudentCount,
      icon: <TeamOutlined />,
      color: "#52c41a",
      background: "from-green-50 to-emerald-50",
      span: 8,
    },
    {
      title: "Jami Shartnoma Summasi",
      value: tableData.allStudentContractMustPaidAmount,
      icon: <DollarOutlined />,
      color: "#fa8c16",
      background: "from-orange-50 to-amber-50",
      formatter: formatCurrency,
      span: 8,
    },
    {
      title: "To'langan Summa",
      value: tableData.allStudentPaidAmount,
      icon: <BankOutlined />,
      color: "#13c2c2",
      background: "from-cyan-50 to-teal-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Qolgan Shartnoma Summasi",
      value: tableData.allStudentRemainContractAmount,
      icon: <DollarOutlined />,
      color: "#722ed1",
      background: "from-purple-50 to-indigo-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Jami Qarz Summasi",
      value: tableData.allStudentDebtAmount,
      icon: <FileTextOutlined />,
      color: "#f5222d",
      background: "from-red-50 to-pink-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Jami Chegirma Summasi",
      value: tableData.allDiscountAmount,
      icon: <PercentageOutlined />,
      color: "#eb2f96",
      background: "from-pink-50 to-rose-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <BankOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={1} className="!text-3xl !font-bold !text-gray-800 !mb-2">
              {tableData.name} Statistikasi
            </Title>
            <Text className="text-lg text-gray-600">Oxirgi yangilanish: {new Date().toLocaleDateString()}</Text>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto">
        <Row gutter={[24, 24]}>
          {statsCards.map((card, index) => (
            <Col key={index} xs={24} sm={12} lg={card.span}>
              <Card
                className={`bg-gradient-to-br ${card.background} border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                bodyStyle={{ padding: "24px" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    {React.cloneElement(card.icon, {
                      style: { color: card.color, fontSize: 20 },
                    })}
                  </div>
                </div>
                <div>
                  <Text strong className="text-gray-600 text-base block mb-2">
                    {card.title}
                  </Text>
                  <Statistic
                    value={card.value}
                    formatter={card.formatter ? (val) => card.formatter!(val) : undefined}
                    valueStyle={{
                      color: card.color,
                      fontSize: screens.lg ? "28px" : "24px",
                      fontWeight: "700",
                      lineHeight: 1.2,
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Summary Section */}
      <div className="max-w-7xl mx-auto mt-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="flex justify-between items-center p-6">
            <div>
              <Text strong className="text-lg text-gray-800">
                Umumiy statistika {new Date().getFullYear()} yil
              </Text>
              <div className="text-gray-600 mt-1">{tableData.name} tomonidan taqdim etilgan</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">
                {((tableData.allStudentPaidAmount / tableData.allStudentContractMustPaidAmount) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">To'lov foizi</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Index
