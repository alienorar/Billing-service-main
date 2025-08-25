"use client"

import { useEffect, useState } from "react"
import { Card, Row, Col, Table, Typography, Descriptions, Divider } from "antd"
import { useGetStudentStatistics } from "../hooks/queries"
import type { TableColumnsType } from "antd"
import { Line } from "@ant-design/charts"
import { UserOutlined, BarChartOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

interface EducationType {
  Bakalavr: { Erkak: number; Ayol: number }
  Magistr: { Erkak: number; Ayol: number }
  Jami: { Erkak: number; Ayol: number }
}

interface AgeData {
  Bakalavr: {
    "30 yoshgacha": { Erkak: number; Ayol: number }
    "30 yoshdan katta": { Erkak: number; Ayol: number }
    Jami: { Erkak: number; Ayol: number }
  }
  Magistr: {
    "30 yoshgacha": { Erkak: number; Ayol: number }
    "30 yoshdan katta": { Erkak: number; Ayol: number }
    Jami: { Erkak: number; Ayol: number }
  }
}

interface PaymentData {
  [key: string]: { Bakalavr: number; Magistr: number }
}

interface RegionData {
  [key: string]: { Bakalavr: number; Magistr?: number }
}

interface CitizenshipData {
  [key: string]: { Bakalavr: number; Magistr: number }
}

interface AccommodationData {
  [key: string]: { Bakalavr: number; Magistr: number }
}

interface EducationForm {
  [key: string]: { Erkak: number; Ayol: number }
}

interface LevelData {
  [key: string]: {
    [key: string]: { [key: string]: number }
  }
}

interface StatisticData {
  education_type: EducationType
  age: AgeData
  payment: PaymentData
  region: RegionData
  citizenship: CitizenshipData
  accommodation: AccommodationData
  education_form: { Bakalavr: EducationForm; Magistr: EducationForm }
  level: LevelData
}

interface EducationTypeTableData {
  key: string
  type: string
  male: number
  female: number
  total: number
}

interface AgeTableData {
  key: string
  ageGroup: string
  male: number
  female: number
  total: number
}

interface PaymentTableData {
  key: string
  type: string
  bachelor: number
  master: number
}

interface RegionTableData {
  key: number
  region: string
  bachelor: number
  master: number
}

interface CitizenshipTableData {
  key: string
  type: string
  bachelor: number
  master: number
}

interface AccommodationTableData {
  key: string
  type: string
  bachelor: number
  master: number
}

interface EducationFormTableData {
  key: string
  form: string
  male: number
  female: number
  total: number
}

interface LevelTableData {
  key: string
  course: string
  form: string
  count: number
}

const cardStyle = "bg-white rounded-2xl shadow-lg border border-gray-100"
const headerStyle = "text-teal-700 font-bold text-lg"

const Index = () => {
  const [statisticData, setStatisticData] = useState<StatisticData | null>(null)
  const { data: studentStatistics } = useGetStudentStatistics()

  useEffect(() => {
    if (studentStatistics?.data?.data) {
      setStatisticData(studentStatistics.data.data)
    }
  }, [studentStatistics])

  if (!statisticData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-12 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  const educationTypeColumns: TableColumnsType<EducationTypeTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Ta'lim turi</span>,
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <span className={record.type === "Jami" ? "font-bold text-teal-700" : "text-gray-800"}>{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Erkak</span>,
      dataIndex: "male",
      key: "male",
      render: (text, record) => (
        <span className={record.type === "Jami" ? "font-bold text-teal-700" : "text-gray-800"}>{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Ayol</span>,
      dataIndex: "female",
      key: "female",
      render: (text, record) => (
        <span className={record.type === "Jami" ? "font-bold text-teal-700" : "text-gray-800"}>{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Jami</span>,
      dataIndex: "total",
      key: "total",
      render: (text, record) => (
        <span className={record.type === "Jami" ? "font-bold text-teal-700" : "text-gray-800"}>{text}</span>
      ),
    },
  ]

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
  ]

  const ageColumns: TableColumnsType<AgeTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Yosh guruhi</span>,
      dataIndex: "ageGroup",
      key: "ageGroup",
    },
    {
      title: <span className="font-semibold text-gray-700">Erkak</span>,
      dataIndex: "male",
      key: "male",
    },
    {
      title: <span className="font-semibold text-gray-700">Ayol</span>,
      dataIndex: "female",
      key: "female",
    },
    {
      title: <span className="font-semibold text-gray-700">Jami</span>,
      dataIndex: "total",
      key: "total",
    },
  ]

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
  ]

  const paymentColumns: TableColumnsType<PaymentTableData> = [
    {
      title: <span className="font-semibold text-gray-700">To'lov turi</span>,
      dataIndex: "type",
      key: "type",
    },
    {
      title: <span className="font-semibold text-gray-700">Bakalavr</span>,
      dataIndex: "bachelor",
      key: "bachelor",
    },
    {
      title: <span className="font-semibold text-gray-700">Magistr</span>,
      dataIndex: "master",
      key: "master",
    },
  ]

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
  ]

  const regionColumns: TableColumnsType<RegionTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Viloyat</span>,
      dataIndex: "region",
      key: "region",
    },
    {
      title: <span className="font-semibold text-gray-700">Bakalavr</span>,
      dataIndex: "bachelor",
      key: "bachelor",
    },
    {
      title: <span className="font-semibold text-gray-700">Magistr</span>,
      dataIndex: "master",
      key: "master",
    },
  ]

  const regionData: RegionTableData[] = Object.entries(statisticData.region).map(([region, data], index) => ({
    key: index,
    region,
    bachelor: data.Bakalavr,
    master: data.Magistr || 0,
  }))

  const citizenshipColumns: TableColumnsType<CitizenshipTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Fuqarolik turi</span>,
      dataIndex: "type",
      key: "type",
    },
    {
      title: <span className="font-semibold text-gray-700">Bakalavr</span>,
      dataIndex: "bachelor",
      key: "bachelor",
    },
    {
      title: <span className="font-semibold text-gray-700">Magistr</span>,
      dataIndex: "master",
      key: "master",
    },
  ]

  const citizenshipData: CitizenshipTableData[] = Object.entries(statisticData.citizenship).map(
    ([type, data], index) => ({
      key: String(index + 1),
      type,
      bachelor: data.Bakalavr,
      master: data.Magistr,
    }),
  )

  const accommodationColumns: TableColumnsType<AccommodationTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Yashash turi</span>,
      dataIndex: "type",
      key: "type",
    },
    {
      title: <span className="font-semibold text-gray-700">Bakalavr</span>,
      dataIndex: "bachelor",
      key: "bachelor",
    },
    {
      title: <span className="font-semibold text-gray-700">Magistr</span>,
      dataIndex: "master",
      key: "master",
    },
  ]

  const accommodationData: AccommodationTableData[] = Object.entries(statisticData.accommodation).map(
    ([type, data], index) => ({
      key: String(index + 1),
      type,
      bachelor: data.Bakalavr,
      master: data.Magistr,
    }),
  )

  const educationFormColumns: TableColumnsType<EducationFormTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
      dataIndex: "form",
      key: "form",
    },
    {
      title: <span className="font-semibold text-gray-700">Erkak</span>,
      dataIndex: "male",
      key: "male",
    },
    {
      title: <span className="font-semibold text-gray-700">Ayol</span>,
      dataIndex: "female",
      key: "female",
    },
    {
      title: <span className="font-semibold text-gray-700">Jami</span>,
      dataIndex: "total",
      key: "total",
    },
  ]

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
  ]

  const levelColumns: TableColumnsType<LevelTableData> = [
    {
      title: <span className="font-semibold text-gray-700">Kurs</span>,
      dataIndex: "course",
      key: "course",
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
      dataIndex: "form",
      key: "form",
    },
    {
      title: <span className="font-semibold text-gray-700">Talabalar soni</span>,
      dataIndex: "count",
      key: "count",
    },
  ]

  const levelData: LevelTableData[] = []
  ;["Bakalavr", "Magistr"].forEach((type) => {
    Object.entries(statisticData.level[type]).forEach(([course, forms]) => {
      Object.entries(forms).forEach(([form, count]) => {
        if (count > 0) {
          levelData.push({
            key: `${type}-${course}-${form}`,
            course: `${course} (${type})`,
            form,
            count,
          })
        }
      })
    })
  })

  const educationTypeChartData = [
    { type: "Bakalavr", gender: "Erkak", value: statisticData.education_type.Bakalavr.Erkak },
    { type: "Bakalavr", gender: "Ayol", value: statisticData.education_type.Bakalavr.Ayol },
    { type: "Magistr", gender: "Erkak", value: statisticData.education_type.Magistr.Erkak },
    { type: "Magistr", gender: "Ayol", value: statisticData.education_type.Magistr.Ayol },
  ]

  const educationTypeChartConfig = {
    data: educationTypeChartData,
    xField: "type",
    yField: "value",
    seriesField: "gender",
    color: ["#1890ff", "#ff6b6b"],
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    point: {
      size: 4,
      shape: "diamond",
    },
    legend: {
      position: "top",
    },
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  }

  const paymentChartData = [
    {
      type: "To'lov-shartnoma",
      level: "Bakalavr",
      value: statisticData.payment["To'lov-shartnoma"]?.Bakalavr ?? 0,
    },
    { type: "To'lov-shartnoma", level: "Magistr", value: statisticData.payment["To'lov-shartnoma"]?.Magistr ?? 0 },
    { type: "Davlat granti", level: "Bakalavr", value: statisticData.payment["Davlat granti"]?.Bakalavr ?? 0 },
    { type: "Davlat granti", level: "Magistr", value: statisticData.payment["Davlat granti"]?.Magistr ?? 0 },
  ]

  const paymentChartConfig = {
    data: paymentChartData,
    xField: "type",
    yField: "value",
    seriesField: "level",
    color: ["#1890ff", "#7cb5ec"],
    yAxis: {
      label: {
        formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 1000,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChartOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={1} className="!text-3xl !font-bold !text-gray-800 !mb-2">
              Talabalar statistikasi
            </Title>
            <Text className="text-lg text-gray-600">Talabalar bo'yicha batafsil statistik ma'lumotlar</Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Summary Cards */}
        <Col span={8}>
          <Card className={`${cardStyle} border-t-4 border-t-teal-500`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-teal-600 text-xl" />
              </div>
              <div>
                <Title level={4} className="!text-teal-700 !mb-0">
                  Jami talabalar
                </Title>
              </div>
            </div>
            <Text className="text-3xl font-bold text-teal-600 block mb-4">
              {statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol}
            </Text>
            <Divider className="my-3" />
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
          <Card className={`${cardStyle} border-t-4 border-t-blue-500`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-blue-600 text-xl" />
              </div>
              <div>
                <Title level={4} className="!text-blue-700 !mb-0">
                  Bakalavrlar
                </Title>
              </div>
            </div>
            <Text className="text-3xl font-bold text-blue-600 block mb-4">
              {statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol}
            </Text>
            <Divider className="my-3" />
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
          <Card className={`${cardStyle} border-t-4 border-t-purple-500`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserOutlined className="text-purple-600 text-xl" />
              </div>
              <div>
                <Title level={4} className="!text-purple-700 !mb-0">
                  Magistrlar
                </Title>
              </div>
            </div>
            <Text className="text-3xl font-bold text-purple-600 block mb-4">
              {statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol}
            </Text>
            <Divider className="my-3" />
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
          <Card title={<span className={headerStyle}>Ta'lim turi bo'yicha statistikalar</span>} className={cardStyle}>
            <Row gutter={24}>
              <Col span={16}>
                <Table
                  columns={educationTypeColumns}
                  dataSource={educationTypeData}
                  pagination={false}
                  bordered
                  size="middle"
                  className="rounded-xl overflow-hidden"
                />
              </Col>
              <Col span={8}>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <Title level={5} className="!mb-4 !text-teal-700">
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
            title={<span className={headerStyle}>Yosh guruhlari bo'yicha statistikalar</span>}
            className={cardStyle}
          >
            <Table
              columns={ageColumns}
              dataSource={ageData}
              pagination={false}
              bordered
              size="middle"
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        {/* Payment and Education Form Section */}
        <Col span={12}>
          <Card
            title={<span className={headerStyle}>To'lov turlari bo'yicha statistikalar</span>}
            className={cardStyle}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Table
                  columns={paymentColumns}
                  dataSource={paymentData}
                  pagination={false}
                  bordered
                  size="middle"
                  className="rounded-xl overflow-hidden"
                />
              </Col>
              <Col span={24} className="mt-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <Title level={5} className="!mb-4 !text-teal-700">
                    To'lov turlari bo'yicha grafik
                  </Title>
                  <Line {...paymentChartConfig} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span className={headerStyle}>Ta'lim shakli bo'yicha statistikalar</span>} className={cardStyle}>
            <Table
              columns={educationFormColumns}
              dataSource={educationFormData}
              pagination={false}
              bordered
              size="middle"
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        {/* Region Data Section */}
        <Col span={24}>
          <Card title={<span className={headerStyle}>Viloyatlar bo'yicha statistikalar</span>} className={cardStyle}>
            <Table
              columns={regionColumns}
              dataSource={regionData}
              pagination={false}
              bordered
              size="middle"
              scroll={{ x: true }}
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        {/* Citizenship and Accommodation Section */}
        <Col span={12}>
          <Card title={<span className={headerStyle}>Fuqarolik bo'yicha statistikalar</span>} className={cardStyle}>
            <Table
              columns={citizenshipColumns}
              dataSource={citizenshipData}
              pagination={false}
              bordered
              size="middle"
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title={<span className={headerStyle}>Yashash turi bo'yicha statistikalar</span>} className={cardStyle}>
            <Table
              columns={accommodationColumns}
              dataSource={accommodationData}
              pagination={false}
              bordered
              size="middle"
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        {/* Level Data Section */}
        <Col span={24}>
          <Card title={<span className={headerStyle}>Kurslar bo'yicha statistikalar</span>} className={cardStyle}>
            <Table
              columns={levelColumns}
              dataSource={levelData}
              pagination={false}
              bordered
              size="middle"
              className="rounded-xl overflow-hidden"
            />
          </Card>
        </Col>

        {/* Summary Section */}
        <Col span={24}>
          <Card title={<span className={headerStyle}>Qisqacha ma'lumot</span>} className={cardStyle}>
            <Descriptions bordered column={2} size="middle" className="rounded-xl overflow-hidden">
              <Descriptions.Item label="Jami talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-teal-600">
                  {statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Bakalavrlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-blue-600">
                  {statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Magistrlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-purple-600">
                  {statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshgacha talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-green-600">
                  {statisticData.age.Bakalavr["30 yoshgacha"].Erkak +
                    statisticData.age.Bakalavr["30 yoshgacha"].Ayol +
                    statisticData.age.Magistr["30 yoshgacha"].Erkak +
                    statisticData.age.Magistr["30 yoshgacha"].Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshdan katta talabalar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-orange-600">
                  {statisticData.age.Bakalavr["30 yoshdan katta"].Erkak +
                    statisticData.age.Bakalavr["30 yoshdan katta"].Ayol +
                    statisticData.age.Magistr["30 yoshdan katta"].Erkak +
                    statisticData.age.Magistr["30 yoshdan katta"].Ayol}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="To'lov-shartnoma asosida o'qiydiganlar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-red-600">
                  {statisticData.payment["To'lov-shartnoma"]?.Bakalavr +
                    statisticData.payment["To'lov-shartnoma"]?.Magistr}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="O'zbekiston fuqarolari" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-indigo-600">
                  {statisticData.citizenship["O'zbekiston Respublikasi fuqarosi"]?.Bakalavr +
                    statisticData.citizenship["O'zbekiston Respublikasi fuqarosi"]?.Magistr}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Talabalar turar joyida yashovchilar" labelStyle={{ fontWeight: "bold" }}>
                <Text strong className="text-cyan-600">
                  {statisticData.accommodation["Talabalar turar joyida"].Bakalavr +
                    statisticData.accommodation["Talabalar turar joyida"].Magistr}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Index
