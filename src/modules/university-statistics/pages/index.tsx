"use client"

import { useEffect, useState } from "react"
import { useGetUniversityStatistics } from "../hooks/queries"
import { Card, Row, Col, Statistic, Spin, Alert, Typography } from "antd"
import { TeamOutlined, DollarOutlined, FileTextOutlined, PercentageOutlined } from "@ant-design/icons"

const { Title } = Typography

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
  const [tableData, setTableData] = useState<UniversityStatistics | null>(null)
  const { data: statisticsData, isLoading, isError, error } = useGetUniversityStatistics()

 

  useEffect(() => {
    if (statisticsData?.data) {
      setTableData(statisticsData.data)
    }
  }, [statisticsData])



  // Summani formatlash funksiyasi (B va M qisqartmalarisiz)
  const formatCurrency = (amount:string|number) => {
    return `${amount.toLocaleString()} UZS` // Raqamni to'liq ko'rsatish
  }

  // Yuklanish holati
  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Statistikani yuklash..." />
      </div>
    )
  }

  // Xato holati
  if (isError) {
    return (
      <Alert
        message="Xato"
        description={error.message || "Universitet statistikasini yuklashda xato yuz berdi. Iltimos, qayta urinib ko'ring."}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    )
  }

  // Agar tableData bo'lmasa, hech narsa ko'rsatilmaydi
  if (!tableData) {
    return null
  }

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: "24px", textAlign: "center" }}>
        {tableData.name} Statistikasi
      </Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Jami Talabalar"
              value={tableData.studentCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Shartnoma Talabalari"
              value={tableData.contractStudentCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Jami Shartnoma Summasi"
              value={tableData.allStudentContractMustPaidAmount}
              formatter={formatCurrency}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="To'langan Summa"
              value={tableData.allStudentPaidAmount}
              formatter={formatCurrency}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Qolgan Shartnoma Summasi"
              value={tableData.allStudentRemainContractAmount}
              formatter={formatCurrency}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Jami Qarz Summasi"
              value={tableData.allStudentDebtAmount}
              formatter={formatCurrency}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
            <Statistic
              title="Jami Chegirma Summasi"
              value={tableData.allDiscountAmount}
              formatter={formatCurrency}
              prefix={<PercentageOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Index