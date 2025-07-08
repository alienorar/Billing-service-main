"use client"

import React, { useEffect, useState } from "react"
import { useGetUniversityStatistics } from "../hooks/queries"
import { Card, Row, Col, Statistic, Spin, Alert, Typography, theme, Grid } from "antd"
import { TeamOutlined, DollarOutlined, FileTextOutlined, PercentageOutlined } from "@ant-design/icons"

const { Title, Text } = Typography
const { useToken } = theme
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
  const { token } = useToken()
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
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh",
        background: token.colorBgContainer
      }}>
        <Spin size="large" tip="Statistikani yuklash...">
          <div style={{ padding: 50, background: token.colorBgElevated, borderRadius: 12 }} />
        </Spin>
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ 
        maxWidth: 800, 
        margin: "40px auto",
        padding: "0 24px"
      }}>
        <Alert
          message="Xato"
          description={error.message || "Universitet statistikasini yuklashda xato yuz berdi. Iltimos, qayta urinib ko'ring."}
          type="error"
          showIcon
          closable
          style={{ 
            borderRadius: 12,
            boxShadow: token.boxShadowSecondary
          }}
        />
      </div>
    )
  }

  if (!tableData) {
    return null
  }

  // Card data configuration
  const statsCards = [
    {
      title: "Jami Talabalar",
      value: tableData.studentCount,
      icon: <TeamOutlined />,
      color: token.colorPrimary,
      background: token.geekblue1,
      span: 8
    },
    {
      title: "Shartnoma Talabalari",
      value: tableData.contractStudentCount,
      icon: <TeamOutlined />,
      color: token.cyan6,
      background: token.cyan1,
      span: 8
    },
    {
      title: "Jami Shartnoma Summasi",
      value: tableData.allStudentContractMustPaidAmount,
      icon: <DollarOutlined />,
      color: token.green6,
      background: token.green1,
      formatter: formatCurrency,
      span: 8
    },
    {
      title: "To'langan Summa",
      value: tableData.allStudentPaidAmount,
      icon: <DollarOutlined />,
      color: token.volcano6,
      background: token.volcano1,
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12
    },
    {
      title: "Qolgan Shartnoma Summasi",
      value: tableData.allStudentRemainContractAmount,
      icon: <DollarOutlined />,
      color: token.orange6,
      background: token.orange1,
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12
    },
    {
      title: "Jami Qarz Summasi",
      value: tableData.allStudentDebtAmount,
      icon: <FileTextOutlined />,
      color: token.red6,
      background: token.red1,
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12
    },
    {
      title: "Jami Chegirma Summasi",
      value: tableData.allDiscountAmount,
      icon: <PercentageOutlined />,
      color: token.purple6,
      background: token.purple1,
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12
    }
  ]

  return (
    <div style={{ 
      padding: screens.xs ? "16px" : "24px",
      background: token.colorBgContainer,
      minHeight: "100vh"
    }}>
      {/* Header Section */}
      <div style={{
        textAlign: "center",
        marginBottom: 40,
        padding: screens.md ? "0 40px" : "0 16px"
      }}>
        <Title 
          level={2} 
          style={{ 
            marginBottom: 8,
            color: token.colorTextHeading,
            fontWeight: 600,
            fontSize: screens.lg ? 32 : 24
          }}
        >
          {tableData.name} Statistikasi
        </Title>
        <Text 
          type="secondary" 
          style={{ 
            fontSize: screens.lg ? 16 : 14,
            color: token.colorTextSecondary
          }}
        >
          Oxirgi yangilanish: {new Date().toLocaleDateString()}
        </Text>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        maxWidth: 1400,
        margin: "0 auto",
        padding: screens.md ? "0 20px" : "0"
      }}>
        <Row gutter={[24, 24]}>
          {statsCards.map((card, index) => (
            <Col key={index} xs={24} sm={12} lg={card.span}>
              <Card 
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  background: card.background,
                  height: "100%",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  borderTop: `4px solid ${card.color}`,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }}
                bodyStyle={{ 
                  padding: "20px 24px",
                  height: "100%"
                }}
                hoverable
              >
                <div style={{ 
                  display: "flex",
                  flexDirection: "column",
                  height: "100%"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${card.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12
                    }}>
                      {React.cloneElement(card.icon, { 
                        style: { 
                          color: card.color,
                          fontSize: 18
                        } 
                      })}
                    </div>
                    <Text strong style={{ 
                      fontSize: 16,
                      color: token.colorTextSecondary
                    }}>
                      {card.title}
                    </Text>
                  </div>
                  <Statistic
                    value={card.value}
                    formatter={card.formatter ? (val) => card.formatter!(val) : undefined}
                    valueStyle={{ 
                      color: card.color,
                      fontSize: screens.lg ? 28 : 24,
                      fontWeight: 700,
                      lineHeight: 1.2
                    }}
                    style={{ marginTop: "auto" }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Summary Section */}
      {screens.lg && (
        <div style={{ 
          maxWidth: 1400,
          margin: "40px auto 0",
          padding: "0 20px"
        }}>
          <Card
            bordered={false}
            style={{ 
              borderRadius: 12,
              background: token.colorBgElevated,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px"
            }}>
              <Text strong style={{ fontSize: 16 }}>
                Umumiy statistika {new Date().getFullYear()} yil
              </Text>
              <Text type="secondary">
                {tableData.name} tomonidan taqdim etilgan
              </Text>
            </div>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        marginTop: 60,
        textAlign: "center",
        padding: "16px 0",
        borderTop: `1px solid ${token.colorBorderSecondary}`
      }}>
        
      </div>
    </div>
  )
}

export default Index