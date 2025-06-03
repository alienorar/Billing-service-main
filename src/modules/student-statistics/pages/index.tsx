import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Typography, Descriptions } from "antd";
import { useGetStudentStatistics } from "../hooks/queries";
import type { TableColumnsType } from "antd";

const { Title } = Typography;

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
    { title: "Ta'lim turi", dataIndex: "type", key: "type" },
    { title: "Erkak", dataIndex: "male", key: "male" },
    { title: "Ayol", dataIndex: "female", key: "female" },
    { title: "Jami", dataIndex: "total", key: "total" },
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
    { title: "Yosh guruhi", dataIndex: "ageGroup", key: "ageGroup" },
    { title: "Erkak", dataIndex: "male", key: "male" },
    { title: "Ayol", dataIndex: "female", key: "female" },
    { title: "Jami", dataIndex: "total", key: "total" },
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
    { title: "To'lov turi", dataIndex: "type", key: "type" },
    { title: "Bakalavr", dataIndex: "bachelor", key: "bachelor" },
    { title: "Magistr", dataIndex: "master", key: "master" },
  ];

  const paymentData: PaymentTableData[] = [
    {
      key: "1",
      type: "To‘lov-shartnoma",
      bachelor: statisticData.payment["To‘lov-shartnoma"]?.Bakalavr ?? 0,
      master: statisticData.payment["To‘lov-shartnoma"]?.Magistr ?? 0,
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
    { title: "Viloyat", dataIndex: "region", key: "region" },
    { title: "Bakalavr", dataIndex: "bachelor", key: "bachelor" },
    { title: "Magistr", dataIndex: "master", key: "master" },
  ];

  const regionData: RegionTableData[] = Object.entries(statisticData.region).map(([region, data], index) => ({
    key: index,
    region,
    bachelor: data.Bakalavr,
    master: data.Magistr || 0,
  }));

  // Citizenship Data
  const citizenshipColumns: TableColumnsType<CitizenshipTableData> = [
    { title: "Fuqarolik turi", dataIndex: "type", key: "type" },
    { title: "Bakalavr", dataIndex: "bachelor", key: "bachelor" },
    { title: "Magistr", dataIndex: "master", key: "master" },
  ];

  const citizenshipData: CitizenshipTableData[] = Object.entries(statisticData.citizenship).map(([type, data], index) => ({
    key: String(index + 1),
    type,
    bachelor: data.Bakalavr,
    master: data.Magistr,
  }));

  // Accommodation Data
  const accommodationColumns: TableColumnsType<AccommodationTableData> = [
    { title: "Yashash turi", dataIndex: "type", key: "type" },
    { title: "Bakalavr", dataIndex: "bachelor", key: "bachelor" },
    { title: "Magistr", dataIndex: "master", key: "master" },
  ];

  const accommodationData: AccommodationTableData[] = Object.entries(statisticData.accommodation).map(([type, data], index) => ({
    key: String(index + 1),
    type,
    bachelor: data.Bakalavr,
    master: data.Magistr,
  }));

  // Education Form Data
  const educationFormColumns: TableColumnsType<EducationFormTableData> = [
    { title: "Ta'lim shakli", dataIndex: "form", key: "form" },
    { title: "Erkak", dataIndex: "male", key: "male" },
    { title: "Ayol", dataIndex: "female", key: "female" },
    { title: "Jami", dataIndex: "total", key: "total" },
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
    { title: "Kurs", dataIndex: "course", key: "course" },
    { title: "Ta'lim shakli", dataIndex: "form", key: "form" },
    { title: "Talabalar soni", dataIndex: "count", key: "count" },
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

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Talabalar statistikasi</Title>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Ta'lim turi bo'yicha statistikalar" bordered={false}>
            <Table columns={educationTypeColumns} dataSource={educationTypeData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Yosh guruhlari bo'yicha statistikalar" bordered={false}>
            <Table columns={ageColumns} dataSource={ageData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="To'lov turlari bo'yicha statistikalar" bordered={false}>
            <Table columns={paymentColumns} dataSource={paymentData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Ta'lim shakli bo'yicha statistikalar" bordered={false}>
            <Table columns={educationFormColumns} dataSource={educationFormData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Viloyatlar bo'yicha statistikalar" bordered={false}>
            <Table columns={regionColumns} dataSource={regionData} pagination={false} bordered scroll={{ x: true }} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Fuqarolik bo'yicha statistikalar" bordered={false}>
            <Table columns={citizenshipColumns} dataSource={citizenshipData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Yashash turi bo'yicha statistikalar" bordered={false}>
            <Table columns={accommodationColumns} dataSource={accommodationData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Kurslar bo'yicha statistikalar" bordered={false}>
            <Table columns={levelColumns} dataSource={levelData} pagination={false} bordered />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Qisqacha ma'lumot" bordered={false}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Jami talabalar">
                {statisticData.education_type.Jami.Erkak + statisticData.education_type.Jami.Ayol}
              </Descriptions.Item>
              <Descriptions.Item label="Bakalavrlar">
                {statisticData.education_type.Bakalavr.Erkak + statisticData.education_type.Bakalavr.Ayol}
              </Descriptions.Item>
              <Descriptions.Item label="Magistrlar">
                {statisticData.education_type.Magistr.Erkak + statisticData.education_type.Magistr.Ayol}
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshgacha talabalar">
                {statisticData.age.Bakalavr["30 yoshgacha"].Erkak +
                  statisticData.age.Bakalavr["30 yoshgacha"].Ayol +
                  statisticData.age.Magistr["30 yoshgacha"].Erkak +
                  statisticData.age.Magistr["30 yoshgacha"].Ayol}
              </Descriptions.Item>
              <Descriptions.Item label="30 yoshdan katta talabalar">
                {statisticData.age.Bakalavr["30 yoshdan katta"].Erkak +
                  statisticData.age.Bakalavr["30 yoshdan katta"].Ayol +
                  statisticData.age.Magistr["30 yoshdan katta"].Erkak +
                  statisticData.age.Magistr["30 yoshdan katta"].Ayol}
              </Descriptions.Item>
              <Descriptions.Item label="To‘lov-shartnoma asosida o'qiydiganlar">
                {statisticData.payment["To‘lov-shartnoma"]?.Bakalavr + statisticData.payment["To‘lov-shartnoma"]?.Magistr}
              </Descriptions.Item>
              <Descriptions.Item label="O‘zbekiston fuqarolari">
                {statisticData.citizenship["O‘zbekiston Respublikasi fuqarosi"].Bakalavr +
                  statisticData.citizenship["O‘zbekiston Respublikasi fuqarosi"].Magistr}
              </Descriptions.Item>
              <Descriptions.Item label="Talabalar turar joyida yashovchilar">
                {statisticData.accommodation["Talabalar turar joyida"].Bakalavr +
                  statisticData.accommodation["Talabalar turar joyida"].Magistr}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Index;