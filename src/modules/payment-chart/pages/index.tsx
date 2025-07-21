import { useEffect, useState } from "react";
import { Card, Statistic, Progress, Row, Col, Select, Space, Typography, Spin } from "antd";
import { ArrowUpOutlined,} from "@ant-design/icons";
import { useGetPaymentChart } from "../hooks/queries";

const { Option } = Select;
const { Title, Text } = Typography;

interface ProviderStat {
    provider: string;
    sum: number;
}

interface PaymentItem {
    providerStatistics: ProviderStat[];
    allPaymentAmount: number;
}

interface ProcessedData {
    totalAmount: number;
    providers: {
        provider: string;
        sum: number;
        percent: number;
    }[];
    paymentCount: number;
}

const PaymentDashboard = () => {
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [filterType, setFilterType] = useState<string>("DAILY");

    // API so'rovini amalga oshiramiz
    const { data: apiResponse, isLoading } = useGetPaymentChart({
        filterType,
        filterCount: 7
    });

    // API ma'lumotlarini state ga saqlaymiz
    useEffect(() => {
        if (apiResponse?.data) {
            setPayments(apiResponse.data);
        }
    }, [apiResponse]);

    // Ma'lumotlarni ishlab chiqamiz
    const processedData = (): ProcessedData | null => {
        if (!payments || payments.length === 0) return null;

        const total = payments.reduce((sum, item) => sum + item.allPaymentAmount, 0);

        // Providerlar bo'yicha statistikani hisoblaymiz
        const providerStats: Record<string, number> = {};
        payments.forEach(item => {
            item.providerStatistics.forEach(stat => {
                providerStats[stat.provider] = (providerStats[stat.provider] || 0) + stat.sum;
            });
        });

        // Foizlarni hisoblaymiz
        const providers = Object.entries(providerStats).map(([provider, sum]) => ({
            provider,
            sum,
            percent: Math.round((sum / total) * 100) || 0
        }));

        return {
            totalAmount: total,
            providers,
            paymentCount: payments.length
        };
    };

    const dashboardData = processedData();

    // Providerlar uchun ranglar
    const getProviderColor = (provider: string): string => {
        const colors: Record<string, string> = {
            BANK: '#1890ff',
            XAZNA: '#52c41a',
            CLICK: '#faad14',
            DEFAULT: '#722ed1'
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
                {/* Sarlavha va filter */}
                <Card bordered={false}>
                    <div className="flex justify-between items-center">
                        <Title level={3} className="mb-0">To'lovlar Monitoringi</Title>
                        <Select<string>
                            style={{ width: 180 }}
                            value={filterType}
                            onChange={setFilterType}
                            size="large"
                        >
                            <Option value="DAILY">Kunlik</Option>
                            <Option value="WEEKLY">Haftalik</Option>
                            <Option value="MONTHLY">Oylik</Option>
                        </Select>
                    </div>
                </Card>

                {!dashboardData ? (
                    <Card bordered={false}>
                        <Text type="warning">Ma'lumot mavjud emas</Text>
                    </Card>
                ) : (
                    <>
                        {/* Asosiy statistikalar */}
                        <Row gutter={16}>
                            <Col xs={24} sm={12} lg={8}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="Jami To'lov Miqdori"
                                        value={dashboardData.totalAmount}
                                        precision={0}
                                        valueStyle={{ color: '#52c41a' }}
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
                                        valueStyle={{ color: '#1890ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={8}>
                                <Card bordered={false}>
                                    <Statistic
                                        title="O'rtacha To'lov"
                                        value={Math.round(dashboardData.totalAmount / dashboardData.paymentCount) || 0}
                                        valueStyle={{ color: '#13c2c2' }}
                                        suffix="so'm"
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Providerlar bo'yicha taqsimot */}
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