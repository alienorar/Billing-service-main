import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Statistic,
  Progress,
  Row,
  Col,
  Select,
  Space,
  Typography,
  Spin,
  InputNumber,
} from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/charts";
import { useGetPaymentChart, useGetPaymentStatistics } from "../hooks/queries";
import { ProcessedData, PaymentItem} from "../types";
import dayjs from "dayjs";
import { Button } from "antd";

const { Option } = Select;
const { Title, Text } = Typography;

const PaymentDashboard = () => {
    
  // We create a state limit initialized with 10
  
  const [year, setYear] = useState<"THIS_YEAR" | "LAST_YEAR">("THIS_YEAR");


  const getInitialFilterCount = (): number => {
    Title
    try {
      const params = new URLSearchParams(window.location.search);
      const countParam = params.get("limit");
      if (countParam) {
        const parsed = parseInt(countParam, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch {
      
    }
    return 10;
  };

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [filterType, setFilterType] = useState<string>("WEEKLY");
  const [filterCount, setFilterCount] = useState<number>(getInitialFilterCount());

  const { data: apiResponse, isLoading } = useGetPaymentChart({
    filterType,
    filterCount,
  });


  const { data: statisticsData } = useGetPaymentStatistics({
    filterType,
    filterCount
  });
  

  useEffect(() => {
    if (statisticsData) {
      console.log("Statistika ma'lumotlari:", statisticsData);
    }
  }, [statisticsData]);

  
  

  useEffect(() => {
    if (apiResponse?.data) {
      setPayments(apiResponse.data);
    }
  }, [apiResponse]);

  const getMaxLimit = (type: string): number => {
    switch (type) {
        case "DAILY":
            return 30;
        case "MONTHLY":
            return 12;
        case "WEEKLY":
            return 15;
        case "YEARLY":
            return 5;
        default:
            return 10;
        }
    };
  const [tempFilterCount, setTempFilterCount] = useState<number>(filterCount)

    useEffect(() => {
        const handler = setTimeout(() => {
            
            setFilterCount(tempFilterCount);
        }, 1000);

        
        return () => {
            clearTimeout(handler);
        };
    }, [tempFilterCount]);

  // Update URL whenever filterType or filterCount changes

  useEffect(() => {
    const maxLimit = getMaxLimit(filterType);
    let newCount = filterCount;

    if (filterCount > maxLimit) newCount = maxLimit;
    if (filterType === "WEEKLY" && filterCount < 1) newCount = 7;

    if (newCount !== filterCount) setFilterCount(newCount);

    // URL update limit param
    const params = new URLSearchParams(window.location.search);
    params.set("limit", newCount.toString());
    params.set("filterType", filterType);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [filterType, filterCount]);

  // Set initial value from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("limit", filterCount.toString());
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [filterCount]);

  const processedData = (): ProcessedData | null => {
    if (!payments || payments.length === 0) return null;

    const total = payments.reduce((sum, item) => sum + item.allPaymentAmount, 0);

    const providerStats: Record<string, number> = {};
    payments.forEach((item) => {
      item.providerStatistics.forEach((stat) => {
        providerStats[stat.provider] = (providerStats[stat.provider] || 0) + stat.sum;
      });
    });

    const providers = Object.entries(providerStats).map(([provider, sum]) => ({
      provider,
      sum,
      percent: Math.round((sum / total) * 100) || 0,
    }));

    return {
      totalAmount: total,
      providers,
      paymentCount: payments.length,
    };
  };

  const [days, getDays] = useState<"TODAY" | "YESTERDAY">("TODAY");
  const [month, getMonth] = useState<"THIS_MONTH" | "LAST_MONTH">("THIS_MONTH");


  const { data: todayStats } = useGetPaymentStatistics({
    from: dayjs().format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const { data: yesterdayStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  });

  const { data: thisMonthStats } = useGetPaymentStatistics({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  });

  const { data: lastMonthStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD"),
  });
  const { data: thisYearStats } = useGetPaymentStatistics({
    from: dayjs().startOf("year").format("YYYY-MM-DD"),
    to: dayjs().endOf("year").format("YYYY-MM-DD"),
  });

  const { data: lastYearStats } = useGetPaymentStatistics({
    from: dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
    to: dayjs().subtract(1, "year").endOf("year").format("YYYY-MM-DD"),
  });





  const dashboardData = processedData();

  const chartData = useMemo(() => {
    
    if (!payments || payments.length === 0) return [];

    

    const parseDate = (dateStr: string): Date => {
      const [d, m, y] = dateStr.split(" ")[0].split("-");
      return new Date(`${y}-${m}-${d}`);
    };

    const sortedPayments = [...payments].sort(
      (a, b) => parseDate(a.from).getTime() - parseDate(b.from).getTime()
    );

    const filteredPayments = sortedPayments.slice(-filterCount);

    return filteredPayments.map((item) => {
      const fromDate = item.from.split(" ")[0]; 
      const toDate = item.to.split(" ")[0];  

      const formatDate = (dateStr: string) => {
        const [day, month] = dateStr.split("-");
        return `${day}-${month}`;
      };

      return {
        date: `${formatDate(fromDate)} - ${formatDate(toDate)}`, 
        amount: item.allPaymentAmount,
        rawData: item 
      };
    });
  }, [payments, filterCount]);

  const getProviderColor = (provider: string): string => {
    const colors: Record<string, string> = {
      BANK: "#1890ff",
      XAZNA: "#52c41a",
      CLICK: "#faad14",
      DEFAULT: "#722ed1",
    };
    return colors[provider] || colors.DEFAULT;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Space direction="vertical" size="large" className="w-full">
        
        <Card bordered={false}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="flex-1">
              <Row gutter={[16, 16]}>
                <Col xs={5} md={8}>
                  <Card style={{ background: "#fdfdfd", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Button.Group>
                      <Button
                        type={days === "YESTERDAY" ? "primary" : "default"}
                        onClick={() => getDays("YESTERDAY")}
                        style={{
                          borderRadius: "6px 0 0 6px",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        Kecha
                      </Button>
                      <Button
                        type={days === "TODAY" ? "primary" : "default"}
                        onClick={() => getDays("TODAY")}
                        style={{
                          borderRadius: "0 6px 6px 0",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        Bugun
                      </Button>
                    </Button.Group>


                    <div style={{ marginTop: 20 }}>
                      <Statistic
                        title={days === "TODAY" ? "Bugungi to‘lovlar" : "Kechagi to‘lovlar"}
                        value={
                          days === "TODAY"
                            ? todayStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                            : yesterdayStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                        }
                        suffix="so'm"
                        valueStyle={{ color: "#fa541c" }}
                      />
                    </div>
                  </Card>
                </Col>
                <Col xs={5} md={8} >
                  <Card style={{ background: "#fdfdfd", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Button.Group>
                      <Button
                        type={month === "LAST_MONTH" ? "primary" : "default"}
                        onClick={() => getMonth("LAST_MONTH")}
                        style={{
                          borderRadius: "6px 0 0 6px",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        O‘tgan oy
                      </Button>
                      <Button
                        type={month === "THIS_MONTH" ? "primary" : "default"}
                        onClick={() => getMonth("THIS_MONTH")}
                        style={{
                          borderRadius: "0 6px 6px 0",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        Bu oy
                      </Button>
                    </Button.Group>


                    <div style={{ marginTop: 20 }}>
                      <Statistic
                    

                        title={month === "THIS_MONTH" ? "Shu oy to'lovlari" : "O‘tgan oy to'lovlari"}
                        value={
                          month === "THIS_MONTH"
                            ? thisMonthStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                            : lastMonthStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                        }
                        suffix="so'm"
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </div>
                  </Card>
                </Col>

                <Col xs={5} md={8}>
                  <Card  style={{ background: "#fdfdfd", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <Button.Group>
                      <Button
                        type={year === "LAST_YEAR" ? "primary" : "default"}
                        onClick={() => setYear("LAST_YEAR")}
                        style={{
                          borderRadius: "6px 0 0 6px",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        O‘tgan yil
                      </Button>
                      <Button
                        type={year === "THIS_YEAR" ? "primary" : "default"}
                        onClick={() => setYear("THIS_YEAR")}
                        style={{
                          borderRadius: "0 6px 6px 0",
                          fontWeight: 500,
                          padding: "4px 16px"
                        }}
                      >
                        Bu yil
                      </Button>
                    </Button.Group>

                    <div style={{ marginTop: 20 }}>
                      <Statistic
                        title={year === "THIS_YEAR" ? "Bu yildagi to‘lovlar" : "O‘tgan yildagi to‘lovlar"}
                        value={
                          year === "THIS_YEAR"
                            ? thisYearStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                            : lastYearStats?.data?.allPaymentAmount?.toLocaleString("en-US")
                        }
                        suffix="so'm"
                        valueStyle={{ color: "#722ed1" }}
                      />
                    </div>
                  </Card>
                </Col>
                
              </Row>


            </div>

            
            {/* Filtrlash qismi */}
            <Space size="middle" className="mt-4 md:mt-0">
              <Select<string>
                style={{ width: 140 }}
                value={filterType}
                onChange={setFilterType}
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
                  if (!val) return;
                  const maxLimit = getMaxLimit(filterType);
                  const newVal = val > maxLimit ? maxLimit : val;
                  setTempFilterCount(newVal);
                }}
                size="large"
                style={{ width: 100 }}
                placeholder="Limit"
              />
            </Space>
          </div>
        </Card>

        {!dashboardData ? (
          <Card bordered={false}>
            <Text type="warning">Ma'lumot mavjud emas</Text>
          </Card>
        ) : (
          <>
            <Row gutter={16}>
              <Col xs={24} sm={12} lg={8}>
                <Card bordered={false}>
                  <Statistic
                    title="Jami To'lov Miqdori"
                    value={dashboardData.totalAmount}
                    precision={0}
                    valueStyle={{ color: "#52c41a" }}
                    prefix={<ArrowUpOutlined />}
                    suffix="so'm"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card bordered={false}>
                  <Statistic
                    title="To'lovlar Soni"
                    value={dashboardData.paymentCount}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Card bordered={false}>
                  <Statistic
                    title="O'rtacha To'lov"
                    value={Math.round(dashboardData.totalAmount / dashboardData.paymentCount) || 0}
                    valueStyle={{ color: "#13c2c2" }}
                    suffix="so'm"
                  />
                </Card>
              </Col>
            </Row>

            <Card title={`${filterType} To'lovlar Grafigi`} bordered={false}>
              <Line
                data={chartData}
                xField="date"
                yField="amount"
                point={{ 
                  size: 5, 
                  shape: "circle",
                  style: {
                    fill: "#1890ff",
                    stroke: "#fff",
                    lineWidth: 2
                  }
                }}
                color="#1890ff"
                smooth
                xAxis={{ 
                  title: { 
                    text: filterType === "DAILY" ? "Kunlar" : 
                          filterType === "WEEKLY" ? "Haftalar" : "Oylar" 
                  },
                  label: {
                    autoRotate: true,
                  }
                }}
                yAxis={{
                  title: { text: "To'lov miqdori (so'm)" },
                  label: {
                    formatter: (val: string) => `${Number(val).toLocaleString('en-US')}`,
                  },
                  grid: {
                    line: {
                      style: {
                        stroke: "#f0f0f0",
                        lineDash: [4, 4]
                      }
                    }
                  }
                }}
                label={{
                  formatter: (datum: any) => ({
                    content: `${datum.amount.toLocaleString('en-US')}`,
                    style: {
                      fill: '#333',
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      textBaseline: 'bottom',
                      shadowColor: '#fff',
                      shadowBlur: 4
                    },
                  }),
                  position: 'top',
                  offsetY: -10
                }}
                

              />
            </Card>

            <Card title="To'lov Turlari Bo'yicha Taqsimot" bordered={false}>
              <Row gutter={[16, 16]}>
                {dashboardData.providers.map((item, index) => (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <Card bordered={false}>
                      <div className="flex justify-between mb-2">
                        <Text strong>{item.provider}</Text>
                        <Text strong>{item.percent}%</Text>
                      </div>
                      <Progress
                        percent={item.percent}
                        strokeColor={getProviderColor(item.provider)}
                        trailColor="#f0f0f0"
                        showInfo={false}
                      />
                      <div className="mt-2 text-right">
                        <Text type="secondary">{item.sum.toLocaleString()} so'm</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        )}
      </Space>
    </div>
  );
};

export default PaymentDashboard;
