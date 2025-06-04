import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Typography, Descriptions, Divider } from "antd";
import { useGetStudentStatistics } from "../hooks/queries";
import type { TableColumnsType } from "antd";
import { Line } from "@ant-design/charts";

const { Title, Text } = Typography;

// Define interfaces for the data structure
interface EducationType {
  Bakalavr: { Erkak: number; Ayol: number };
  Magistr: { Erkak: number; Ayol: number };
  Jami: { Erkak: number; Ayol: number };
}

interface AgeData {
  Bakalavr: {
    "30 yoshgacha": { Erkak: number; Ayol: number };
    "30 yoshdan katta": { Erkak: number; Ayol: number };
    Jami: { Erkak: number; Ayol: number };
  };
  Magistr: {
    "30 yoshgacha": { Erkak: number; Ayol: number };
    "30 yoshdan katta": { Erkak: number; Ayol: number };
    Jami: { Erkak: number; Ayol: number };
  };
}

interface PaymentData {
  [key: string]: { Bakalavr: number; Magistr: number };
}

interface RegionData {
  [key: string]: { Bakalavr: number; Magistr?: number };
}

interface CitizenshipData {
  [key: string]: { Bakalavr: number; Magistr: number };
}

interface AccommodationData {
  [key: string]: { Bakalavr: number; Magistr: number };
}

interface EducationForm {
  [key: string]: { Erkak: number; Ayol: number };
}

interface LevelData {
  [key: string]: {
    [key: string]: { [key: string]: number };
  };
}

interface StatisticData {
  education_type: EducationType;
  age: AgeData;
  payment: PaymentData;
  region: RegionData;
  citizenship: CitizenshipData;
  accommodation: AccommodationData;
  education_form: { Bakalavr: EducationForm; Magistr: EducationForm };
  level: LevelData;
}

interface EducationTypeTableData {
  key: string;
  type: string;
  male: number;
  female: number;
  total: number;
}

interface AgeTableData {
  key: string;
  ageGroup: string;
  male: number;
  female: number;
  total: number;
}

interface PaymentTableData {
  key: string;
  type: string;
  bachelor: number;
  master: number;
}

interface RegionTableData {
  key: number;
  region: string;
  bachelor: number;
  master: number;
}

interface CitizenshipTableData {
  key: string;
  type: string;
  bachelor: number;
  master: number;
}

interface AccommodationTableData {
  key: string;
  type: string;
  bachelor: number;
  master: number;
}

interface EducationFormTableData {
  key: string;
  form: string;
  male: number;
  female: number;
  total: number;
}

interface LevelTableData {
  key: string;
  course: string;
  form: string;
  count: number;
}

// Custom styling
const cardStyle = {
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(5, 5, 86, 0.1)",
  border: "1px solid #f0f0f0",
};

const headerStyle = {
  color: "#050556",
  fontWeight: 600,
};

const tableHeaderStyle = {
  backgroundColor: "#050556",
  color: "white",
  fontWeight: "bold",
};

const highlightStyle = {
  backgroundColor: "#f0f5ff",
  fontWeight: "bold",
};

const Index = () => {
  const [statisticData, setStatisticData] = useState<StatisticData | null>(null);
  const { data: studentStatistics } = useGetStudentStatistics();

  useEffect(() => {
    if (studentStatistics?.data?.data) {
      setStatisticData(studentStatistics.data.data);
    }
  }, [studentStatistics]);

  if (!statisticData) {
    return <div>Loading...</div>;
  }

  // Education Type Data
  const educationTypeColumns: TableColumnsType<EducationTypeTableData> = [
    { 
      title: "Ta'lim turi", 
      dataIndex: "type", 
      key: "type",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
      onCell: (record) => ({
        style: record.type === "Jami" ? highlightStyle : {},
      }),
    },
    { 
      title: "Erkak", 
      dataIndex: "male", 
      key: "male",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Ayol", 
      dataIndex: "female", 
      key: "female",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Jami", 
      dataIndex: "total", 
      key: "total",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
      onCell: (record) => ({
        style: record.type === "Jami" ? highlightStyle : {},
      }),
    },
  ];

  const educationTypeData: EducationTypeTableData[] = [
    {
      key: "1",
      type: "Bakalavr",
      male: statisticData.education_type.Bakalavr.Erkak,
      female: statisticData.education_type.Bakalavr.Ayol,
      total: statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol,
    },
    {
      key: "2",
      type: "Magistr",
      male: statisticData.education_type.Magistr.Erkak,
      female: statisticData.education_type.Magistr.Ayol,
      total: statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol,
    },
    {
      key: "3",
      type: "Jami",
      male: statisticData.education_type.Jami.Erkak,
      female: statisticData.education_type.Jami.Ayol,
      total: statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol,
    },
  ];

  // Age Data
  const ageColumns: TableColumnsType<AgeTableData> = [
    { 
      title: "Yosh guruhi", 
      dataIndex: "ageGroup", 
      key: "ageGroup",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Erkak", 
      dataIndex: "male", 
      key: "male",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Ayol", 
      dataIndex: "female", 
      key: "female",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Jami", 
      dataIndex: "total", 
      key: "total",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const ageData: AgeTableData[] = [
    {
      key: "1",
      ageGroup: "30 yoshgacha (Bakalavr)",
      male: statisticData.age.Bakalavr["30 yoshgacha"].Erkak,
      female: statisticData.age.Bakalavr["30 yoshgacha"].Ayol,
      total: statisticData.age.Bakalavr["30 yoshgacha"].Erkak + statisticData.age.Bakalavr["30 yoshgacha"].Ayol,
    },
    {
      key: "2",
      ageGroup: "30 yoshdan katta (Bakalavr)",
      male: statisticData.age.Bakalavr["30 yoshdan katta"].Erkak,
      female: statisticData.age.Bakalavr["30 yoshdan katta"].Ayol,
      total: statisticData.age.Bakalavr["30 yoshdan katta"].Erkak + statisticData.age.Bakalavr["30 yoshdan katta"].Ayol,
    },
    {
      key: "3",
      ageGroup: "30 yoshgacha (Magistr)",
      male: statisticData.age.Magistr["30 yoshgacha"].Erkak,
      female: statisticData.age.Magistr["30 yoshgacha"].Ayol,
      total: statisticData.age.Magistr["30 yoshgacha"].Erkak + statisticData.age.Magistr["30 yoshgacha"].Ayol,
    },
    {
      key: "4",
      ageGroup: "30 yoshdan katta (Magistr)",
      male: statisticData.age.Magistr["30 yoshdan katta"].Erkak,
      female: statisticData.age.Magistr["30 yoshdan katta"].Ayol,
      total: statisticData.age.Magistr["30 yoshdan katta"].Erkak + statisticData.age.Magistr["30 yoshdan katta"].Ayol,
    },
  ];

  // Payment Data
  const paymentColumns: TableColumnsType<PaymentTableData> = [
    { 
      title: "To'lov turi", 
      dataIndex: "type", 
      key: "type",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Bakalavr", 
      dataIndex: "bachelor", 
      key: "bachelor",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Magistr", 
      dataIndex: "master", 
      key: "master",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const paymentData: PaymentTableData[] = [
    {
      key: "1",
      type: "To'lov-shartnoma",
      bachelor: statisticData.payment["To'lov-shartnoma"]?.Bakalavr ?? 0,
      master: statisticData.payment["To'lov-shartnoma"]?.Magistr ?? 0,
    },
    {
      key: "2",
      type: "Davlat granti",
      bachelor: statisticData.payment["Davlat granti"]?.Bakalavr ?? 0,
      master: statisticData.payment["Davlat granti"]?.Magistr ?? 0,
    },
  ];

  // Region Data
  const regionColumns: TableColumnsType<RegionTableData> = [
    { 
      title: "Viloyat", 
      dataIndex: "region", 
      key: "region",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Bakalavr", 
      dataIndex: "bachelor", 
      key: "bachelor",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Magistr", 
      dataIndex: "master", 
      key: "master",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const regionData: RegionTableData[] = Object.entries(statisticData.region).map(([region, data], index) => ({
    key: index,
    region,
    bachelor: data.Bakalavr,
    master: data.Magistr || 0,
  }));

  // Citizenship Data
  const citizenshipColumns: TableColumnsType<CitizenshipTableData> = [
    { 
      title: "Fuqarolik turi", 
      dataIndex: "type", 
      key: "type",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Bakalavr", 
      dataIndex: "bachelor", 
      key: "bachelor",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Magistr", 
      dataIndex: "master", 
      key: "master",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const citizenshipData: CitizenshipTableData[] = Object.entries(statisticData.citizenship).map(([type, data], index) => ({
    key: String(index + 1),
    type,
    bachelor: data.Bakalavr,
    master: data.Magistr,
  }));

  // Accommodation Data
  const accommodationColumns: TableColumnsType<AccommodationTableData> = [
    { 
      title: "Yashash turi", 
      dataIndex: "type", 
      key: "type",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Bakalavr", 
      dataIndex: "bachelor", 
      key: "bachelor",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Magistr", 
      dataIndex: "master", 
      key: "master",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const accommodationData: AccommodationTableData[] = Object.entries(statisticData.accommodation).map(([type, data], index) => ({
    key: String(index + 1),
    type,
    bachelor: data.Bakalavr,
    master: data.Magistr,
  }));

  // Education Form Data
  const educationFormColumns: TableColumnsType<EducationFormTableData> = [
    { 
      title: "Ta'lim shakli", 
      dataIndex: "form", 
      key: "form",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Erkak", 
      dataIndex: "male", 
      key: "male",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Ayol", 
      dataIndex: "female", 
      key: "female",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Jami", 
      dataIndex: "total", 
      key: "total",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const educationFormData: EducationFormTableData[] = [
    {
      key: "1",
      form: "Kunduzgi (Bakalavr)",
      male: statisticData.education_form.Bakalavr.Kunduzgi.Erkak,
      female: statisticData.education_form.Bakalavr.Kunduzgi.Ayol,
      total: statisticData.education_form.Bakalavr.Kunduzgi.Erkak + statisticData.education_form.Bakalavr.Kunduzgi.Ayol,
    },
    {
      key: "2",
      form: "Sirtqi (Bakalavr)",
      male: statisticData.education_form.Bakalavr.Sirtqi.Erkak,
      female: statisticData.education_form.Bakalavr.Sirtqi.Ayol,
      total: statisticData.education_form.Bakalavr.Sirtqi.Erkak + statisticData.education_form.Bakalavr.Sirtqi.Ayol,
    },
    {
      key: "3",
      form: "Kunduzgi (Magistr)",
      male: statisticData.education_form.Magistr.Kunduzgi.Erkak,
      female: statisticData.education_form.Magistr.Kunduzgi.Ayol,
      total: statisticData.education_form.Magistr.Kunduzgi.Erkak + statisticData.education_form.Magistr.Kunduzgi.Ayol,
    },
  ];

  // Level Data
  const levelColumns: TableColumnsType<LevelTableData> = [
    { 
      title: "Kurs", 
      dataIndex: "course", 
      key: "course",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Ta'lim shakli", 
      dataIndex: "form", 
      key: "form",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
    { 
      title: "Talabalar soni", 
      dataIndex: "count", 
      key: "count",
      onHeaderCell: () => ({ style: tableHeaderStyle }),
    },
  ];

  const levelData: LevelTableData[] = [];
  ["Bakalavr", "Magistr"].forEach((type) => {
    Object.entries(statisticData.level[type]).forEach(([course, forms]) => {
      Object.entries(forms).forEach(([form, count]) => {
        if (count > 0) {
          levelData.push({
            key: `${type}-${course}-${form}`,
            course: `${course} (${type})`,
            form,
            count,
          });
        }
      });
    });
  });

  // Prepare data for line chart (Education Type)
  const educationTypeChartData = [
    { type: 'Bakalavr', gender: 'Erkak', value: statisticData.education_type.Bakalavr.Erkak },
    { type: 'Bakalavr', gender: 'Ayol', value: statisticData.education_type.Bakalavr.Ayol },
    { type: 'Magistr', gender: 'Erkak', value: statisticData.education_type.Magistr.Erkak },
    { type: 'Magistr', gender: 'Ayol', value: statisticData.education_type.Magistr.Ayol },
  ];

  const educationTypeChartConfig = {
    data: educationTypeChartData,
    xField: 'type',
    yField: 'value',
    seriesField: 'gender',
    color: ['#050556', '#ff6b6b'],
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    point: {
      size: 4,
      shape: 'diamond',
    },
    legend: {
      position: 'top',
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // Prepare data for payment type chart
  const paymentChartData = [
    { type: "To'lov-shartnoma", level: 'Bakalavr', value: statisticData.payment["To'lov-shartnoma"]?.Bakalavr ?? 0 },
    { type: "To'lov-shartnoma", level: 'Magistr', value: statisticData.payment["To'lov-shartnoma"]?.Magistr ?? 0 },
    { type: "Davlat granti", level: 'Bakalavr', value: statisticData.payment["Davlat granti"]?.Bakalavr ?? 0 },
    { type: "Davlat granti", level: 'Magistr', value: statisticData.payment["Davlat granti"]?.Magistr ?? 0 },
  ];

  const paymentChartConfig = {
    data: paymentChartData,
    xField: 'type',
    yField: 'value',
    seriesField: 'level',
    color: ['#050556', '#7cb5ec'],
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f7fa" }}>
      <Title level={2} style={{ color: "#050556", marginBottom: "24px", textAlign: "center" }}>
        Talabalar statistikasi
      </Title>
      
      <Row gutter={[24, 24]}>
        {/* Summary Cards */}
        <Col span={8}>
          <Card 
            style={{ ...cardStyle, borderTop: "4px solid #050556" }}
            bodyStyle={{ padding: "16px" }}
          >
            <Title level={4} style={headerStyle}>
              Jami talabalar
            </Title>
            <Text style={{ fontSize: "28px", fontWeight: "bold", color: "#050556" }}>
              {statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol}
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <Row>
              <Col span={12}>
                <Text strong>Erkak:</Text> {statisticData.education_type.Jami.Erkak}
              </Col>
              <Col span={12}>
                <Text strong>Ayol:</Text> {statisticData.education_type.Jami.Ayol}
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card 
            style={{ ...cardStyle, borderTop: "4px solid #7cb5ec" }}
            bodyStyle={{ padding: "16px" }}
          >
            <Title level={4} style={headerStyle}>
              Bakalavrlar
            </Title>
            <Text style={{ fontSize: "28px", fontWeight: "bold", color: "#050556" }}>
              {statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol}
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <Row>
              <Col span={12}>
                <Text strong>Erkak:</Text> {statisticData.education_type.Bakalavr.Erkak}
              </Col>
              <Col span={12}>
                <Text strong>Ayol:</Text> {statisticData.education_type.Bakalavr.Ayol}
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card 
            style={{ ...cardStyle, borderTop: "4px solid #ff6b6b" }}
            bodyStyle={{ padding: "16px" }}
          >
            <Title level={4} style={headerStyle}>
              Magistrlar
            </Title>
            <Text style={{ fontSize: "28px", fontWeight: "bold", color: "#050556" }}>
              {statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol}
            </Text>
            <Divider style={{ margin: "12px 0" }} />
            <Row>
              <Col span={12}>
                <Text strong>Erkak:</Text> {statisticData.education_type.Magistr.Erkak}
              </Col>
              <Col span={12}>
                <Text strong>Ayol:</Text> {statisticData.education_type.Magistr.Ayol}
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Education Type Section */}
        <Col span={24}>
          <Card 
            title="Ta'lim turi bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Row gutter={24}>
              <Col span={16}>
                <Table 
                  columns={educationTypeColumns} 
                  dataSource={educationTypeData} 
                  pagination={false} 
                  bordered 
                  size="middle"
                />
              </Col>
              <Col span={8}>
                <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
                  <Title level={5} style={{ marginBottom: "16px", color: "#050556" }}>
                    Ta'lim turi bo'yicha grafik
                  </Title>
                  <Line {...educationTypeChartConfig} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Age Data Section */}
        <Col span={24}>
          <Card 
            title="Yosh guruhlari bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={ageColumns} 
              dataSource={ageData} 
              pagination={false} 
              bordered 
              size="middle"
            />
          </Card>
        </Col>

        {/* Payment and Education Form Section */}
        <Col span={12}>
          <Card 
            title="To'lov turlari bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Table 
                  columns={paymentColumns} 
                  dataSource={paymentData} 
                  pagination={false} 
                  bordered 
                  size="middle"
                />
              </Col>
              <Col span={24} style={{ marginTop: "24px" }}>
                <div style={{ padding: "16px", backgroundColor: "#fff", borderRadius: "8px" }}>
                  <Title level={5} style={{ marginBottom: "16px", color: "#050556" }}>
                    To'lov turlari bo'yicha grafik
                  </Title>
                  <Line {...paymentChartConfig} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title="Ta'lim shakli bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={educationFormColumns} 
              dataSource={educationFormData} 
              pagination={false} 
              bordered 
              size="middle"
            />
          </Card>
        </Col>

        {/* Region Data Section */}
        <Col span={24}>
          <Card 
            title="Viloyatlar bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={regionColumns} 
              dataSource={regionData} 
              pagination={false} 
              bordered 
              size="middle"
              scroll={{ x: true }}
            />
          </Card>
        </Col>

        {/* Citizenship and Accommodation Section */}
        <Col span={12}>
          <Card 
            title="Fuqarolik bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={citizenshipColumns} 
              dataSource={citizenshipData} 
              pagination={false} 
              bordered 
              size="middle"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title="Yashash turi bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={accommodationColumns} 
              dataSource={accommodationData} 
              pagination={false} 
              bordered 
              size="middle"
            />
          </Card>
        </Col>

        {/* Level Data Section */}
        <Col span={24}>
          <Card 
            title="Kurslar bo'yicha statistikalar" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Table 
              columns={levelColumns} 
              dataSource={levelData} 
              pagination={false} 
              bordered 
              size="middle"
            />
          </Card>
        </Col>

        {/* Summary Section */}
        <Col span={24}>
          <Card 
            title="Qisqacha ma'lumot" 
            bordered={false} 
            style={cardStyle}
            headStyle={{ ...headerStyle, borderBottom: "1px solid #f0f0f0" }}
          >
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Jami talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Bakalavrlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Magistrlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshgacha talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.age.Bakalavr["30 yoshgacha"].Erkak +
                    statisticData.age.Bakalavr["30 yoshgacha"].Ayol +
                    statisticData.age.Magistr["30 yoshgacha"].Erkak +
                    statisticData.age.Magistr["30 yoshgacha"].Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshdan katta talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.age.Bakalavr["30 yoshdan katta"].Erkak +
                    statisticData.age.Bakalavr["30 yoshdan katta"].Ayol +
                    statisticData.age.Magistr["30 yoshdan katta"].Erkak +
                    statisticData.age.Magistr["30 yoshdan katta"].Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="To'lov-shartnoma asosida o'qiydiganlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.payment["To'lov-shartnoma"]?.Bakalavr + statisticData.payment["To'lov-shartnoma"]?.Magistr}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="O'zbekiston fuqarolari" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.citizenship["O'zbekiston Respublikasi fuqarosi"]?.Bakalavr +
                    statisticData.citizenship["O'zbekiston Respublikasi fuqarosi"]?.Magistr}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Talabalar turar joyida yashovchilar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong style={{ color: "#050556" }}>
                  {statisticData.accommodation["Talabalar turar joyida"].Bakalavr +
                    statisticData.accommodation["Talabalar turar joyida"].Magistr}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Index;