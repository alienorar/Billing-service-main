import { useParams } from "react-router-dom";
import { useGetStudentById } from "../hooks/queries";
import { Card, Descriptions, Image, Spin, Alert, Typography } from "antd";

const { Title, Text } = Typography;

const StudentDetails = () => {
  const { id } = useParams();
  const { data: response, isLoading, error } = useGetStudentById(id);

  if (isLoading) return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  if (error) return <Alert message="Error fetching student data" type="error" showIcon />;

  const student = response?.data;

  if (!student) return <Alert message="Student not found" type="warning" showIcon />;

  return (
    <Card
      style={{
        maxWidth: 800,
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

      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Student ID">
          <Text strong style={{ color: "#050556" }}>{student.studentIdNumber}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Pinfl">
          <Text strong style={{ color: "#050556" }}>{student.pinfl}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Phone">{student.phone || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Birth Date">
          {new Date(student.birthDate * 1000).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Gender">
          <Text strong style={{ color: "#050556" }}>{student.genderName}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status"><Text>{student.studentStatusName}</Text></Descriptions.Item>
        <Descriptions.Item label="Education Level">{student.levelName}</Descriptions.Item>
        <Descriptions.Item label="Specialty">{student.specialtyName}</Descriptions.Item>
        <Descriptions.Item label="Group">{student.groupName}</Descriptions.Item>
        <Descriptions.Item label="Education Type">{student.educationTypeName}</Descriptions.Item>
        <Descriptions.Item label="Country">{student.countryName}</Descriptions.Item>
        <Descriptions.Item label="Region">{student.provinceName}</Descriptions.Item>
        <Descriptions.Item label="District">{student.districtName}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StudentDetails;
