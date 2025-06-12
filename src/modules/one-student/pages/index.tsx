import { useParams } from "react-router-dom";
import { useGetStudentById, useGetStudentsTrInfo } from "../hooks/queries";
import { Card, Descriptions, Image, Spin, Alert, Typography, Table } from "antd";

const { Title, Text } = Typography;



interface StudentDetails {
  studentIdNumber: string;
  pinfl: string;
  fullName: string;
  phone: string | null;
  birthDate: number;
  genderName: string;
  studentStatusName: string;
  levelName: string;
  specialtyName: string;
  groupName: string;
  educationTypeName: string;
  countryName: string;
  provinceName: string;
  districtName: string;
  image: string;
  universityName: string;
}

const StudentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: studentResponse, isLoading: isStudentLoading, error: studentError } = useGetStudentById(id);
  const student = studentResponse?.data;
  const studentIdNumber = student?.studentIdNumber;
  const pinfl = student?.pinfl;
  const { data: trInfoResponse, isLoading: isTrLoading, error: trError } = useGetStudentsTrInfo({ studentIdNumber,pinfl });

  if (isStudentLoading || isTrLoading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  if (studentError) {
    return <Alert message="Error fetching student data" description={studentError.message} type="error" showIcon />;
  }

  if (trError) {
    return <Alert message="Error fetching transaction data" description={trError.message} type="error" showIcon />;
  }

  if (!student) {
    return <Alert message="Student not found" type="warning" showIcon />;
  }

  const trInfo = trInfoResponse?.data;

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Contract Number",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: "Currency",
      dataIndex: "currencyCode",
      key: "currencyCode",
      render: (code: string) => (code === "860" ? "UZS" : code),
    },
  ];

  return (
    <Card
      style={{
        maxWidth: 1400,
        margin: "50px auto",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <Image
          width={100}
          height={120}
          src={student.image}
          style={{ borderRadius: "50%", border: "2px solid #050556" }}
          fallback="https://via.placeholder.com/100"
        />
        <div>
          <Title level={3} style={{ color: "#050556", margin: 0 }}>
            {student.fullName}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            {student.universityName}
          </Text>
        </div>
      </div>

      <Descriptions bordered column={2} size="middle" style={{ marginBottom: 20 }}>
        <Descriptions.Item label="Student ID">
          <Text strong style={{ color: "#050556" }}>{student.studentIdNumber}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="PINFL">
          <Text strong style={{ color: "#050556" }}>{student.pinfl}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Phone">{student.phone || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Birth Date">
          {new Date(student.birthDate * 1000).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          <Text strong style={{ color: "#050556" }}>{student.genderName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Text>{student.studentStatusName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Education Level">{student.levelName}</Descriptions.Item>
        <Descriptions.Item label="Specialty">{student.specialtyName}</Descriptions.Item>
        <Descriptions.Item label="Group">{student.groupName}</Descriptions.Item>
        <Descriptions.Item label="Education Type">{student.educationTypeName}</Descriptions.Item>
        <Descriptions.Item label="Country">{student.countryName}</Descriptions.Item>
        <Descriptions.Item label="Region">{student.provinceName}</Descriptions.Item>
        <Descriptions.Item label="District">{student.districtName}</Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ color: "#050556", marginBottom: 16 }}>
        Transaction History
      </Title>
      {trInfo?.transactions?.length ? (
        <>
          <Table
            columns={columns}
            dataSource={trInfo.transactions}
            rowKey="date"
            pagination={false}
            style={{ marginBottom: 16 }}
          />
          <Text strong style={{ fontSize: 16 }}>
            Total Paid: {trInfo.total.toLocaleString()} UZS
          </Text>
        </>
      ) : (
        <Text>No transactions found.</Text>
      )}
    </Card>
  );
};

export default StudentDetails;