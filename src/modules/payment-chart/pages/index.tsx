"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, Statistic, Progress, Row, Col, Select, Typography, Spin, InputNumber } from "antd"
import { ArrowUpOutlined, DollarOutlined, WarningOutlined, BarChartOutlined } from "@ant-design/icons"
import { Line } from "@ant-design/charts"
import { useGetPaymentChart, useGetPaymentStatistics } from "../hooks/queries"
import type { ProcessedData, PaymentItem } from "../types"
import { Button } from "antd"
import dayjs from "dayjs"

const { Option } = Select
const {  Text } = Typography

const PaymentDashboard = () => {
  const [year, setYear] = useState<"THIS_YEAR" | "LAST_YEAR">("THIS_YEAR")

  const getInitialFilterCount = (): number => {
    try {
      const params = new URLSearchParams(window.location.search)
      const countParam = params.get("limit")
      if (countParam) {
        const parsed = Number.parseInt(countParam, 10)
        if (!isNaN(parsed)) return parsed
      }
    } catch {
      // Handle error silently
    }
    return 10
  }

  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [filterType, setFilterType] = useState<string>("DAILY")
  const [filterCount, setFilterCount] = useState<number>(getInitialFilterCount())

  const { data: apiResponse, isLoading } = useGetPaymentChart({
    filterType,
    filterCount,
  })

  const { data: statisticsData } = useGetPaymentStatistics({
    filterType,
    filterCount,
  })

  useEffect(() => {
    if (statisticsData) {
      console.log("Statistika ma'lumotlari:", statisticsData)
    }
  }, [statisticsData])

  useEffect(() => {
    const maxLimit = getMaxLimit(filterType)
    if (tempFilterCount > maxLimit) {
      setTempFilterCount(maxLimit)
    }
  }, [filterType])

  useEffect(() => {
    if (apiResponse?.data) {
      setPayments(apiResponse.data)
    }
  }, [apiResponse])

  const getMaxLimit = (type: string): number => {
    switch (type) {
      case "DAILY":
        return 30
      case "MONTHLY":
        return 12
      case "WEEKLY":
        return 30
      case "YEARLY":
        return 10
      default:
        return 10
    }
  }

  const [tempFilterCount, setTempFilterCount] = useState<number>(filterCount)

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterCount(tempFilterCount)
    }, 1000)

    return () => {
      clearTimeout(handler)
    }
  }, [tempFilterCount])

  useEffect(() => {
    const maxLimit = getMaxLimit(filterType)
    let newCount = filterCount
    if (filterCount > maxLimit) newCount = maxLimit
    if (filterType === "WEEKLY" && filterCount < 1) newCount = 7

    if (newCount !== filterCount) setFilterCount(newCount)

    const params = new URLSearchParams(window.location.search)
    params.set("limit", newCount.toString())
    params.set("filterType", filterType)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, "", newUrl)
  }, [filterType, filterCount])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("limit", filterCount.toString())
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, "", newUrl)
  }, [filterCount])

  const processedData = (): ProcessedData | null => {
    if (!payments || payments.length === 0) return null

    const total = payments.reduce((sum, item) => sum + item.allPaymentAmount, 0)

    const providerStats: Record<string, number> = {}
    payments.forEach((item) => {
      item.providerStatistics.forEach((stat) => {
        providerStats[stat.provider] = (providerStats[stat.provider] || 0) + stat.sum
      })
    })

    const providers = Object.entries(providerStats).map(([provider, sum]) => ({
      provider,
      sum,
      percent: Math.round((sum / total) * 100) || 0,
    }))

    return {
      totalAmount: total,
      providers,
      paymentCount: payments.length,
    }
  }

  const [days, getDays] = useState<"TODAY" | "YESTERDAY">("TODAY")
  const [month, getMonth] = useState<"THIS_MONTH" | "LAST_MONTH">("THIS_MONTH")

  const { data: todayStats } = useGetPaymentStatistics({
    from: dayjs().format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  })

  const { data: yesterdayStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  })

  const { data: thisMonthStats } = useGetPaymentStatistics({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  })

  const { data: lastMonthStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
  })

  const { data: thisYearStats } = useGetPaymentStatistics({
    from: dayjs().startOf("year").format("YYYY-MM-DD"),
    to: dayjs().endOf("year").format("YYYY-MM-DD"),
  })

  const { data: lastYearStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "year").endOf("year").format("YYYY-MM-DD"),
  })

  const dashboardData = processedData()

  const chartData = useMemo(() => {
    if (!payments || payments.length === 0) return []

    const parseDate = (dateStr: string): Date => {
      const [d, m, y] = dateStr.split(" ")[0].split("-")
      return new Date(`${y}-${m}-${d}`)
    }

    const sortedPayments = [...payments].sort((a, b) => parseDate(a.from).getTime() - parseDate(b.from).getTime())

    const filteredPayments = sortedPayments.slice(-filterCount)

    return filteredPayments.map((item) => {
      const [d, m, y] = item.from.split(" ")[0].split("-")
      const formattedDate = `${d}.${m}.${y}`

      const amountInMillions =
        filterType == "DAILY" || filterType == "WEEKLY"
          ? Number((item.allPaymentAmount / 1000000).toFixed(2))
          : Number((item.allPaymentAmount / 1000000000).toFixed(3))
      return {
        date: formattedDate,
        amount: amountInMillions,
        rawAmount: `${item.allPaymentAmount} mln so'm`,
        rawData: item,
      }
    })
  }, [payments, filterCount])

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      BANK: "#1890ff",
      XAZNA: "#52c41a",
      CLICK: "#faad14",
      DEFAULT: "#722ed1",
    }
    return colors[provider] || colors.DEFAULT
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <DollarOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">To'lovlar Dashboard</h1>
            <p className="text-gray-600 mt-1">To'lovlar statistikasi va tahlili</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="p-2">
              <div className="flex justify-center mb-4">
                <Button.Group className="bg-gray-50 rounded-xl p-1">
                  <Button
                    type={days === "YESTERDAY" ? "primary" : "default"}
                    onClick={() => getDays("YESTERDAY")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      days === "YESTERDAY"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    Kecha
                  </Button>
                  <Button
                    type={days === "TODAY" ? "primary" : "default"}
                    onClick={() => getDays("TODAY")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      days === "TODAY"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    Bugun
                  </Button>
                </Button.Group>
              </div>
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    {days === "TODAY" ? "Bugungi to'lovlar" : "Kechagi to'lovlar"}
                  </span>
                }
                value={
                  days === "TODAY"
                    ? todayStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                    : yesterdayStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                }
                suffix="so'm"
                valueStyle={{ color: "#f97316", fontSize: "24px", fontWeight: "bold" }}
                prefix={<WarningOutlined />}
              />
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="p-2">
              <div className="flex justify-center mb-4">
                <Button.Group className="bg-gray-50 rounded-xl p-1">
                  <Button
                    type={month === "LAST_MONTH" ? "primary" : "default"}
                    onClick={() => getMonth("LAST_MONTH")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      month === "LAST_MONTH"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    O'tgan oy
                  </Button>
                  <Button
                    type={month === "THIS_MONTH" ? "primary" : "default"}
                    onClick={() => getMonth("THIS_MONTH")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      month === "THIS_MONTH"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    Bu oy
                  </Button>
                </Button.Group>
              </div>
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    {month === "THIS_MONTH" ? "Shu oy to'lovlari" : "O'tgan oy to'lovlari"}
                  </span>
                }
                value={
                  month === "THIS_MONTH"
                    ? thisMonthStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                    : lastMonthStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                }
                suffix="so'm"
                valueStyle={{ color: "#16a34a", fontSize: "24px", fontWeight: "bold" }}
                prefix={<ArrowUpOutlined />}
              />
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
            <div className="p-2">
              <div className="flex justify-center mb-4">
                <Button.Group className="bg-gray-50 rounded-xl p-1">
                  <Button
                    type={year === "LAST_YEAR" ? "primary" : "default"}
                    onClick={() => setYear("LAST_YEAR")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      year === "LAST_YEAR"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    O'tgan yil
                  </Button>
                  <Button
                    type={year === "THIS_YEAR" ? "primary" : "default"}
                    onClick={() => setYear("THIS_YEAR")}
                    className={`rounded-lg font-medium transition-all duration-200 px-3 ${
                      year === "THIS_YEAR"
                        ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white border-0 shadow-lg"
                        : "bg-transparent text-gray-600 border-0 hover:bg-gray-100"
                    }`}
                  >
                    Bu yil
                  </Button>
                </Button.Group>
              </div>
              <Statistic
                title={
                  <span className="text-gray-600 font-medium">
                    {year === "THIS_YEAR" ? "Bu yildagi to'lovlar" : "O'tgan yildagi to'lovlar"}
                  </span>
                }
                value={
                  year === "THIS_YEAR"
                    ? thisYearStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                    : lastYearStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                }
                suffix="so'm"
                valueStyle={{ color: "#7c3aed", fontSize: "24px", fontWeight: "bold" }}
                prefix={<BarChartOutlined />}
              />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Select
            style={{ width: 140 }}
            value={filterType}
            onChange={setFilterType}
            size="large"
            className="rounded-xl"
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
            style={{ width: 100 }}
            placeholder="Limit"
            className="rounded-xl"
          />
        </div>
      </div>

      {!dashboardData ? (
        <Card className="bg-white rounded-2xl shadow-lg border-0 text-center p-8">
          <Text type="warning" className="text-lg">
            Ma'lumot mavjud emas
          </Text>
        </Card>
      ) : (
        <>
          {/* Summary Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                <Statistic
                  title={<span className="text-gray-600 font-semibold">Jami To'lov Miqdori</span>}
                  value={dashboardData.totalAmount}
                  precision={0}
                  valueStyle={{ color: "#16a34a", fontSize: "28px", fontWeight: "bold" }}
                  prefix={<ArrowUpOutlined />}
                  suffix="so'm"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                <Statistic
                  title={<span className="text-gray-600 font-semibold">To'lovlar Soni</span>}
                  value={dashboardData.paymentCount}
                  valueStyle={{ color: "#2563eb", fontSize: "28px", fontWeight: "bold" }}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                <Statistic
                  title={<span className="text-gray-600 font-semibold">O'rtacha To'lov</span>}
                  value={Math.round(dashboardData.totalAmount / dashboardData.paymentCount) || 0}
                  valueStyle={{ color: "#0891b2", fontSize: "28px", fontWeight: "bold" }}
                  suffix="so'm"
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Chart */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <BarChartOutlined className="text-white text-sm" />
                </div>
                <span className="text-gray-800 font-bold">
                  {`${dashboardData.paymentCount} ${
                    filterType === "DAILY"
                      ? "Kunlik"
                      : filterType === "WEEKLY"
                        ? "Haftalik"
                        : filterType === "MONTHLY"
                          ? "Oylik"
                          : "Yillik"
                  } To'lovlar Grafigi ${filterType === "DAILY" || filterType === "WEEKLY" ? "Million" : "Milliard"} so'mda`}
                </span>
              </div>
            }
            className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden"
          >
            <Line
              data={chartData}
              xField="date"
              yField="amount"
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
                  text: filterType === "DAILY" ? "Kunlar" : filterType === "WEEKLY" ? "Haftalar" : "Oylar",
                },
              }}
              yAxis={{
                title: { text: "To'lov miqdori (so'm)" },
                label: {
                  formatter: (val: string) => `${(+val / 100).toFixed(1)}M`,
                },
              }}
            />
          </Card>

          {/* Provider Distribution */}
          <Card
            title={
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <DollarOutlined className="text-white text-sm" />
                </div>
                <span className="text-gray-800 font-bold">To'lov Turlari Bo'yicha Taqsimot</span>
              </div>
            }
            className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden"
          >
            <Row gutter={[16, 16]}>
              {dashboardData.providers.map((item, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card className="bg-gray-50 rounded-xl border-0 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <Text strong className="text-gray-800 text-lg">
                        {item.provider}
                      </Text>
                      <Text strong className="text-xl font-bold text-gray-700">
                        {item.percent}%
                      </Text>
                    </div>
                    <Progress
                      percent={item.percent}
                      strokeColor={getProviderColor(item.provider)}
                      trailColor="#e5e7eb"
                      showInfo={false}
                      strokeWidth={8}
                      className="mb-3"
                    />
                    <div className="text-right">
                      <Text className="text-gray-600 font-medium">{item.sum.toLocaleString()} so'm</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </>
      )}
    </div>
  )
}

export default PaymentDashboard
