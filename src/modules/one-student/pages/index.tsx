import { useNavigate, useParams } from "react-router-dom";
import { useGetStudentById, useGetStudentsDiscounts, useGetStudentsTrInfo } from "../hooks/queries";
import { Card, Descriptions, Image, Spin, Alert, Typography, Table, Button, Tabs } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
// import { useState } from "react";
// import DiscountsModal from "./modal";

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
  // const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: studentResponse, isLoading: isStudentLoading, error: studentError } = useGetStudentById(id);
  const student = studentResponse?.data;
  const studentIdNumber = student?.studentIdNumber;
  const pinfl = student?.pinfl;
  const { data: trInfoResponse, isLoading: isTrLoading, error: trError } = useGetStudentsTrInfo({ studentIdNumber, pinfl });
  const { data: studentsDiscounts, isLoading: isDiscountsLoading, error: discountsError } = useGetStudentsDiscounts({ studentIdNumber });

  if (isStudentLoading || isTrLoading || isDiscountsLoading) {
    return <Spin size="large" style={{ display: "block", margin: "50px auto" }} />;
  }

  if (studentError) {
    return <Alert message="Error fetching student data" description={studentError.message} type="error" showIcon />;
  }

  if (trError) {
    return <Alert message="Error fetching transaction data" description={trError.message} type="error" showIcon />;
  }

  if (discountsError) {
    return <Alert message="Error fetching discounts data" description={discountsError.message} type="error" showIcon />;
  }

  if (!student) {
    return <Alert message="Student not found" type="warning" showIcon />;
  }

  const trInfo = trInfoResponse?.data;
  const discounts = studentsDiscounts?.data?.content;

 
  // const showModal = () => setIsModalOpen(true)
  // const handleClose = () => {
  //   setIsModalOpen(false)
   
  // }



  const transactionColumns = [
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

  const discountColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString() + " UZS",
    },
    {
      title: "Student Level",
      dataIndex: "studentLevel",
      key: "studentLevel",
    },
  ];

  return (
    <>
      {/* <DiscountsModal
        open={isModalOpen}
        handleClose={handleClose} /> */}
            



      <div className="flex flex-col justify-center items-center py-10">
        <div className="max-w-2xl flex justify-end items-end w-full">
          <Button className="text-green-500 font-medium" type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Ortga
          </Button>
        </div>
        <Card
          style={{
            maxWidth: 1400,
            margin: "20px auto",
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
            <Descriptions.Item label="Tel">{student.phone || "N/A"}</Descriptions.Item>
            <Descriptions.Item label="To'g'ilgan sana">
              {new Date(student.birthDate * 1000).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="Jins">
              <Text strong style={{ color: "#050556" }}>{student.genderName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Text>{student.studentStatusName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ta'lim darajasi">{student.levelName}</Descriptions.Item>
            <Descriptions.Item label="Mutaxasisligi">{student.specialtyName}</Descriptions.Item>
            <Descriptions.Item label="Guruhi">{student.groupName}</Descriptions.Item>
            <Descriptions.Item label="Ta'lim shakli">{student.educationTypeName}</Descriptions.Item>
            <Descriptions.Item label="Mamlakat">{student.countryName}</Descriptions.Item>
            <Descriptions.Item label="Viloyat">{student.provinceName}</Descriptions.Item>
            <Descriptions.Item label="Tuman">{student.districtName}</Descriptions.Item>
          </Descriptions>

          <Tabs
            defaultActiveKey="transactions"
            items={[
              {
                key: "transactions",
                label: "Tranzaksiyalar tarixi",
                children: (
                  <>
                    {trInfo?.transactions?.length ? (
                      <>
                        <Table
                          columns={transactionColumns}
                          dataSource={trInfo.transactions}
                          rowKey="date"
                          pagination={false}
                          style={{ marginBottom: 16 }}
                        />
                        <Text strong style={{ fontSize: 16 }}>
                          Jami to'langan: {trInfo.total.toLocaleString()} UZS
                        </Text>
                      </>
                    ) : (
                      <Text>Tranzaksiyalar topilmadi</Text>
                    )}
                  </>
                ),
              },
              {
                key: "discounts",
                label: "Chegirmalar",
                children: (
                  <>
                    {discounts?.length ? (
                      <div>
                        {/* <Button
                          type="primary"
                          size="large"
                          style={{ maxWidth: 160, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}
                          onClick={showModal}
                        >
                          Create
                        </Button> */}
                        <Table
                          columns={discountColumns}
                          dataSource={discounts}
                          rowKey="id"
                          pagination={false}
                          style={{ marginBottom: 16 }}
                        />
                      </div>

                    ) : (
                      <Text>Chegirmalar topilmadi</Text>
                    )}
                  </>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </>

  );
};

export default StudentDetails;