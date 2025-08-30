"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, Row, Col, Statistic, Spin, Alert, Typography, Grid, Select, Button, Table, TablePaginationConfig, InputNumber } from "antd"
import { TeamOutlined, DollarOutlined, FileTextOutlined, PercentageOutlined, BankOutlined, BarChartOutlined } from "@ant-design/icons"
import { Line } from "@ant-design/charts"
import { useGetUniversityStatistics, useGetDebtRate } from "../hooks/queries"


const { Title, Text } = Typography
const { useBreakpoint } = Grid
const { Option } = Select

interface UniversityStatistics {
  count: number
  contractAmount: number
  additionalDebtAmount: number
  calculatedDebtAmount: number
  paidAmount: number
  discountAmount: number
  debtRate: number
}

interface DebtRate {
  from: string
  to: string
  debtRates: number[] // Assuming debtRates could contain numbers for charting
}



const Index: React.FC = () => {
  const screens = useBreakpoint()
  const [tableData, setTableData] = useState<UniversityStatistics | null>(null)
  const [debtRateData, setDebtRateData] = useState<DebtRate[]>([])
  const [totalDebtRates, setTotalDebtRates] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterType, setFilterType] = useState<string>("DAILY")
  const [filterCount, setFilterCount] = useState<number>(10)
  const [tempFilterCount, setTempFilterCount] = useState<number>(filterCount)

  // URL search parameters for debt rate
  const timeUnit = searchParams.get("timeUnit") || "DAILY"
  const count = Number(searchParams.get("count")) || 10

  const { data: statisticsData, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useGetUniversityStatistics()
  const { data: debtRateResponse, isLoading: isDebtRateLoading } = useGetDebtRate({
    timeUnit,
    count,
  })

  useEffect(() => {
    if (statisticsData?.data) {
      setTableData(statisticsData.data)
    }
  }, [statisticsData])

  useEffect(() => {
    if (debtRateResponse?.data) {
      setDebtRateData(debtRateResponse.data)
      setTotalDebtRates(debtRateResponse.data.length)
    }
  }, [debtRateResponse])

  useEffect(() => {
    setFilterType(timeUnit)
    setFilterCount(count)
    setTempFilterCount(count)
  }, [timeUnit, count])

  useEffect(() => {
    const maxLimit = getMaxLimit(filterType)
    if (tempFilterCount > maxLimit) {
      setTempFilterCount(maxLimit)
    }
  }, [filterType])

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterCount(tempFilterCount)
    }, 1000)
    return () => clearTimeout(handler)
  }, [tempFilterCount])

  useEffect(() => {
    const maxLimit = getMaxLimit(filterType)
    let newCount = filterCount
    if (filterCount > maxLimit) newCount = maxLimit
    if (newCount !== filterCount) setFilterCount(newCount)

    setSearchParams({
      timeUnit: filterType,
      count: newCount.toString(),
    })
  }, [filterType, filterCount])

  const getMaxLimit = (type: string): number => {
    switch (type) {
      case "DAILY": return 30
      case "WEEKLY": return 30
      case "MONTHLY": return 12
      case "YEARLY": return 10
      default: return 10
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} UZS`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
  }

  const chartData = useMemo(() => {
    if (!debtRateData || debtRateData.length === 0) return []

    const parseDate = (dateStr: string): Date => {
      return new Date(dateStr)
    }

    const sortedData = [...debtRateData].sort((a, b) => parseDate(a.from).getTime() - parseDate(b.from).getTime())

    const filteredData = sortedData.slice(-filterCount)

    return filteredData.map((item) => {
      const formattedDate = formatDate(item.from)
      // Assuming debtRates is an array with at least one number; using first value or 0 if empty
      const debtRateValue = item.debtRates.length > 0 ? item.debtRates[0] : 0
      return {
        date: formattedDate,
        debtRate: Number(debtRateValue.toFixed(2)),
        rawData: item,
      }
    })
  }, [debtRateData, filterCount])

  const statsCards = [
    {
      title: "Jami Talabalar",
      value: tableData?.count ?? 0,
      icon: <TeamOutlined />,
      color: "#1890ff",
      background: "from-blue-50 to-cyan-50",
      span: 8,
    },
    {
      title: "Jami Shartnoma Summasi",
      value: tableData?.contractAmount ?? 0,
      icon: <DollarOutlined />,
      color: "#fa8c16",
      background: "from-orange-50 to-amber-50",
      formatter: formatCurrency,
      span: 8,
    },
    {
      title: "To'langan Summa",
      value: tableData?.paidAmount ?? 0,
      icon: <BankOutlined />,
      color: "#13c2c2",
      background: "from-cyan-50 to-teal-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Qarz Summasi",
      value: tableData?.calculatedDebtAmount ?? 0,
      icon: <FileTextOutlined />,
      color: "#f5222d",
      background: "from-red-50 to-pink-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Qo'shimcha Qarz",
      value: tableData?.additionalDebtAmount ?? 0,
      icon: <FileTextOutlined />,
      color: "#eb2f96",
      background: "from-pink-50 to-rose-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Jami Chegirma Summasi",
      value: tableData?.discountAmount ?? 0,
      icon: <PercentageOutlined />,
      color: "#722ed1",
      background: "from-purple-50 to-indigo-50",
      formatter: formatCurrency,
      span: screens.lg ? 6 : 12,
    },
    {
      title: "Qarz Foizi",
      value: tableData?.debtRate ?? 0,
      icon: <PercentageOutlined />,
      color: "#52c41a",
      background: "from-green-50 to-emerald-50",
      formatter: formatPercentage,
      span: screens.lg ? 6 : 12,
    },
  ]

  const debtRateColumns = [
    {
      title: <span className="font-semibold text-gray-700">Boshlanish sanasi</span>,
      dataIndex: "from",
      render: (value?: string) => <span className="text-gray-800">{value ? formatDate(value) : "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Tugash sanasi</span>,
      dataIndex: "to",
      render: (value?: string) => <span className="text-gray-800">{value ? formatDate(value) : "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Qarz foizlari</span>,
      dataIndex: "debtRates",
      render: (value?: number[]) => (
        <span className="text-gray-800">{value && value.length > 0 ? value.join(", ") : "-"}</span>
      ),
    },
  ]

  const handleTableChange = (pagination: TablePaginationConfig) => {
    // const current = pagination.current ?? 1
    const pageSize = pagination.pageSize ?? 10
    setSearchParams({
      timeUnit: filterType,
      count: pageSize.toString(),
    })
  }

  const handleSearch = () => {
    setSearchParams({
      timeUnit: filterType,
      count: filterCount.toString(),
    })
  }

  if (isStatsLoading) {
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

  if (isStatsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Alert
            message="Xato"
            description={
              statsError?.message || "Statistikani yuklashda xato yuz berdi. Iltimos, qayta urinib ko'ring."
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
              Universitet Statistikasi
            </Title>
            <Text className="text-lg text-gray-600">Oxirgi yangilanish: {new Date().toLocaleDateString()}</Text>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto mb-8">
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
                    // formatter={card.formatter}
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

      {/* Debt Rate Filter and Chart */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <PercentageOutlined className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Qarz Foizlari Grafigi</h2>
              <p className="text-gray-600 mt-1">Vaqt oralig'idagi qarz foizlarini ko'ring</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select
              placeholder="Vaqt birligi"
              value={filterType}
              onChange={setFilterType}
              className="h-10 rounded-xl"
              size="large"
            >
              <Option value="DAILY">Kunlik</Option>
              <Option value="WEEKLY">Haftalik</Option>
              <Option value="MONTHLY">Oylik</Option>
              <Option value="YEARLY">Yillik</Option>
            </Select>
            <InputNumber
              min={1}
              max={getMaxLimit(filterType)}
              value={tempFilterCount}
              onChange={(val) => {
                if (!val) return
                const maxLimit = getMaxLimit(filterType)
                const newVal = val > maxLimit ? maxLimit : val
                setTempFilterCount(newVal)
              }}
              size="large"
              className="h-10 rounded-xl"
              placeholder="Soni"
            />
            <Button
              type="primary"
              onClick={handleSearch}
              className="h-10 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              icon={<BarChartOutlined />}
            >
              Qidirish
            </Button>
          </div>
        </div>
        <Card
          title={
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
                <BarChartOutlined className="text-white text-sm" />
              </div>
              <span className="text-gray-800 font-bold">
                {`${filterCount} ${
                  filterType === "DAILY" ? "Kunlik" :
                  filterType === "WEEKLY" ? "Haftalik" :
                  filterType === "MONTHLY" ? "Oylik" : "Yillik"
                } Qarz Foizlari Grafigi (%)`}
              </span>
            </div>
          }
          className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden mb-6"
        >
          {chartData.length === 0 ? (
            <Text type="warning" className="text-lg block text-center p-8">
              Ma'lumot mavjud emas
            </Text>
          ) : (
            <Line
              data={chartData}
              xField="date"
              yField="debtRate"
              point={{
                size: 6,
                shape: "circle",
                style: {
                  fill: "#0ea5e9",
                  stroke: "#fff",
                  lineWidth: 3,
                },
              }}
              color="#0ea5e9"
              smooth
              xAxis={{
                title: {
                  text: filterType === "DAILY" ? "Kunlar" :
                        filterType === "WEEKLY" ? "Haftalar" :
                        filterType === "MONTHLY" ? "Oylar" : "Yillar",
                },
              }}
              yAxis={{
                title: { text: "Qarz foizi (%)" },
                label: {
                  formatter: (val: string) => `${(+val).toFixed(2)}%`,
                },
              }}
            />
          )}
        </Card>
      </div>

      {/* Debt Rate Table */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-scroll">
          <Table
            loading={isDebtRateLoading}
            dataSource={debtRateData}
            columns={debtRateColumns}
            rowKey="from"
            pagination={{
              current: 1,
              pageSize: filterCount,
              total: totalDebtRates,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              showQuickJumper: true,
              showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} dan ${total} ta natija`,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Summary Section */}
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
          <div className="flex justify-between items-center p-6">
            <div>
              <Text strong className="text-lg text-gray-800">
                Umumiy statistika {new Date().getFullYear()} yil
              </Text>
              <div className="text-gray-600 mt-1">Universitet tomonidan taqdim etilgan</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal-600">
                {formatPercentage(tableData.debtRate)}
              </div>
              <div className="text-sm text-gray-500">Qarz foizi</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Index