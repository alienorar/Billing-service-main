import { useNavigate, useParams } from "react-router-dom";
import { useGetStudentById, useGetStudentsDiscounts, useGetStudentsTrInfo } from "../hooks/queries";
import { Card, Descriptions, Image,  Typography, Table, Button, Tabs, Space, Tooltip } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import DiscountsModal from "./modal";

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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    data: studentResponse,
  } = useGetStudentById(id);
  const student = studentResponse?.data;

  const {
    data: trInfoResponse,

  } = useGetStudentsTrInfo({ id });
  const {
    data: studentsDiscounts,

  } = useGetStudentsDiscounts({ studentId: id });

  // const { data: trInfoResponse, isLoading: isTrLoading } = useGetStudentsTrInfo({ id });
  // const { data: studentsDiscounts, isLoading: isDiscountsLoading, error: discountsError } = useGetStudentsDiscounts({ studentId: id });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState<any | null>(null);



  const trInfo = trInfoResponse?.data;
  const discounts = studentsDiscounts?.data?.content;
  const showModal = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate(null);
  };

  const editData = (item: any) => {
    setUpdate(item);
    showModal();
  };
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
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Tooltip title="Tahrirlash">
            <Button onClick={() => editData(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>


        </Space>
      ),
    },
  ];

  return (
    <>
      <DiscountsModal
        open={isModalOpen}
        handleClose={handleClose}
        studentId={id}
        update={update}
      />

      <div className="flex flex-col justify-center items-center py-10">
        <div className="max-w-3xl flex justify-end items-end w-full">
          <Button
            className="text-green-500 font-medium"
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
          >
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
          <div className="flex items-center gap-5 mb-5">
            <Image
              width={100}
              height={120}
              src={student?.image}
              style={{ borderRadius: "50%", border: "2px solid #050556" }}
              fallback="https://via.placeholder.com/100"
            />
            <div>
              <Title level={3} style={{ color: "#050556", margin: 0 }}>
                {student?.fullName}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {student?.universityName}
              </Text>
            </div>
          </div>

          <Descriptions
            bordered
            column={2}
            size="middle"
            style={{ marginBottom: 20 }}
          >
            <Descriptions.Item label="Student ID">

              <Text strong style={{ color: "#050556" }}>
                {student?.studentIdNumber}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="PINFL">
              <Text strong style={{ color: "#050556" }}>
                {student?.pinfl || "-"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tel">
              {student?.phone || "-"}
            </Descriptions.Item>



            <Descriptions.Item label="To'g'ilgan sana">
              {(() => {
                const date = new Date(student?.birthDate * 1000);
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = String(date?.getDate()).padStart(2, "0");

                const monthNames = [
                  "yanvar",
                  "fevral",
                  "mart",
                  "aprel",
                  "may",
                  "iyun",
                  "iyul",
                  "avgust",
                  "sentyabr",
                  "oktyabr",
                  "noyabr",
                  "dekabr",
                ];

                return `${year}-yil ${day}-${monthNames[month]}`;
              })()}
            </Descriptions.Item>


            <Descriptions.Item label="Kursi">{student?.levelName}</Descriptions.Item>
            <Descriptions.Item label="Mutaxasisligi">{student?.specialtyName}</Descriptions.Item>
            <Descriptions.Item label="Guruhi">{student?.groupName}</Descriptions.Item>
            <Descriptions.Item label="Ta'lim shakli">{student?.educationTypeName}</Descriptions.Item>
            <Descriptions.Item label="Mamlakat">{student?.countryName}</Descriptions.Item>
            <Descriptions.Item label="Viloyat">{student?.provinceName}</Descriptions.Item>
            <Descriptions.Item label="Tuman">{student?.districtName}</Descriptions.Item>

          </Descriptions>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Moliyaviy Hisobot
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Shartnoma summasi :
                </span>
                <span className="text-sm font-bold text-gray-800">


                  {trInfo?.totalContractAmount ? Number(trInfo?.totalContractAmount).toLocaleString() : "0"} UZS

                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  Chegirma summasi
                </span>
                <span className="text-sm font-bold text-green-600">


                  {trInfo?.totalDiscountAmount ? Number(trInfo?.totalDiscountAmount).toLocaleString() : "0"} UZS

                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a5 5 0 00-10 0v2m8 8H9a4 4 0 01-4-4V9h14v4a4 4 0 01-4 4z"
                    ></path>
                  </svg>
                  To'langan summa
                </span>
                <span className="text-sm font-bold text-blue-600">


                  {trInfo?.totalPaidAmount ? Number(trInfo?.totalPaidAmount).toLocaleString() : "0"} UZS

                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Qarzdorlik
                </span>
                
                <span className={Number(trInfo?.totalDebtAmount) < 0 ?"text-sm font-bold text-red-600":"text-sm font-bold text-green-600"}>
                  {Number(trInfo?.totalDebtAmount) > 0?"+":""}{trInfo ? Number(trInfo?.totalDebtAmount).toLocaleString() : "0"} UZS
                </span>
              </div>
            </div>
          </div>
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
                          Jami to'langan: {trInfo?.total.toLocaleString()} UZS
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
                    <div className="flex w-full items-center justify-end py-4">
                      <Button
                        type="primary"
                        size="large"
                        onClick={showModal}
                        style={{
                          maxWidth: 80,
                          minWidth: 80,
                          backgroundColor: "#050556",
                          color: "white",
                          height: 40,
                        }}
                      >
                        Yaratish
                      </Button>
                    </div>
                    {discounts?.length ? (
                      <div>
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
