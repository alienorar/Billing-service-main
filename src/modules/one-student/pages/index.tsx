import { useNavigate, useParams } from "react-router-dom";
import { useGetStudentById, useGetStudentsDiscounts, useGetStudentsTrInfo } from "../hooks/queries";
import { useToggleDebtActive } from "../hooks/mutations";
import { Card, Descriptions, Image, Typography, Table, Button, Tabs, Space, Tooltip, message, Switch } from "antd";
import { ArrowLeftOutlined, EditOutlined, DownloadOutlined, CheckOutlined, CloseOutlined, } from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiEye } from "react-icons/fi";
import { downloadDiscountReason } from "../service";
import DiscountsModal from "./modal";
import StudentDebtsTable from "../../debt/pages";
import AuditModal from "./auditModal";

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
  //audit modal
  const [audetModalOpen, setAudetModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const { mutate: toggleActive } = useToggleDebtActive();

  const handleToggle = (id: string | number) => {
    toggleActive(id); 
  };


  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: studentResponse } = useGetStudentById(id);
  const student = studentResponse?.data;

  const { data: trInfoResponse } = useGetStudentsTrInfo({ id });
  const { data: studentsDiscounts } = useGetStudentsDiscounts({ studentId: id });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState<any | null>(null);

  const trInfo = trInfoResponse?.data;

  console.log(trInfoResponse?.data.paymentDetails);
  
  const discounts = studentsDiscounts?.data?.content;

  // console.log("[StudentDetails] Component rendered, id:", id);
  // console.log("[StudentDetails] Discounts data:", discounts);

  const showModal = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate(null);
  };

  const editData = (item: any) => {
    setUpdate(item);
    showModal();
  };

  const audetModal: () => void = () => {
  setAudetModalOpen(true);
}


  // Mutation for downloading the discount reason file
  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: downloadDiscountReason,
    onMutate: (reasonFile) => {
      console.log("[useMutation] Initiating download for reasonFile:", reasonFile);
      message.loading({ content: "Fayl yuklanmoqda...", key: "download" });
    },
    onSuccess: (data, reasonFile) => {
      console.log("[useMutation] Download successful for reasonFile:", reasonFile);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `discount_reason_${reasonFile}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success({ content: "Fayl yuklab olindi!", key: "download" });
    },
    onError: (error: any) => {
      console.error("[useMutation] Download failed:", {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : "No response",
      });
      if (error.message === "Authentication token not found") {
        message.error({ content: "Tizimga kirish uchun token topilmadi! Iltimos, qayta kiring.", key: "download" });
        navigate("/login");
      } else if (error.message === "target must be an object") {
        message.error({ content: "Faylni yuklashda xato: Noto'g'ri so'rov formati!", key: "download" });
      } else {
        message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" });
      }
    },
  });


const handleBack = () => {
    const queryParams = new URLSearchParams(location.search);
    const page = queryParams.get("page") || "1";
    const size = queryParams.get("size") || "10";
    const backUrl = `/super-admin-panel/students?page=${page}&size=${size}`;
    console.log("[handleBack] Navigating to:", backUrl);
    navigate(backUrl);
  };

  const handleDownload = (reasonFile: string) => {
    console.log("[handleDownload] Download button clicked for reasonFile:", reasonFile);
    if (reasonFile) {
      downloadFile(reasonFile);
    } else {
      console.error("[handleDownload] No reasonFile provided");
      message.error({ content: "Fayl ID topilmadi!", key: "download" });
    }
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
      title: "Chegirma tarifi",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chegirma turi",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Miqdori",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString() + " UZS",
    },
    {
      title: "Talaba kursi",
      dataIndex: "studentLevel",
      key: "studentLevel",
    },

    {
      title: "Active",
      dataIndex: "active",
      render: (active: boolean, record: any) => (
        <Switch
          checked={active}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggle(record.id)} 
          style={{
            backgroundColor: active ? "green" : "#999",
          }}
        />
      ),
    },
    {
      title: "Amallar",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          
          <Tooltip title="Tahrirlash">
            <Button onClick={() => editData(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>

          
          {record?.reasonFile && (
            <Tooltip title="Faylni yuklab olish">
              <Button
                onClick={() => {
                  console.log("[Button] Download button clicked for record:", record);
                  handleDownload(record?.reasonFile);
                }}
                loading={isDownloading}
                disabled={isDownloading}
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          )}
          {record?.id && (
            <Tooltip title="Ko'rish">
              <Button
                onClick={() => {
                  setSelectedRecord(record);
                  audetModal();
                }}
              >
                <FiEye size={18} />
              </Button>
            </Tooltip>
          )}

          
        </Space>
      ),
    }

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
                  onClick={handleBack}
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
            <Descriptions.Item label="To'g'ilgan sanasi">
              {(() => {
                const date = new Date(student?.birthDate * 1000);
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = String(date.getDate()).padStart(2, "0");
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
                  {trInfo?.paymentDetails.studentContractAmount ? Number(trInfo?.paymentDetails.studentContractAmount).toLocaleString() : "0"} UZS
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
                  {trInfo?.paymentDetails.studentDiscountAmount ? Number(trInfo?.paymentDetails.studentDiscountAmount).toLocaleString() : "0"} UZS
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
                  {trInfo?.paymentDetails.studentPaidAmount ? Number(trInfo?.paymentDetails.studentPaidAmount).toLocaleString() : "0"} UZS
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
                <span className={Number(trInfo?.paymentDetails.studentDebtAmount) < 0 ? "text-sm font-bold text-red-600" : "text-sm font-bold text-green-600"}>
                  {Number(trInfo?.paymentDetails.studentDebtAmount) > 0 ? "+" : ""}{trInfo ? Number(trInfo?.paymentDetails.studentDebtAmount).toLocaleString() : "0"} UZS
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
                  "Qo'shimcha qarzdorlik"
                </span>
                <span className={Number(trInfo?.paymentDetails.studentAdditionalDebtAmount) >  0 ? "text-sm font-bold text-red-600" : "text-sm font-bold text-green-600"}>
                  {Number(trInfo?.paymentDetails.studentAdditionalDebtAmount) > 0 ? "-" : ""}{trInfo ? Number(trInfo?.paymentDetails.studentAdditionalDebtAmount).toLocaleString() : "0"} UZS
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
                          Jami to'langan: {(Number(trInfo?.paymentDetails.studentPaidAmount) || 0).toLocaleString()} UZS
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
              {
                key: "debts",
                label: "Qarzdorlik",
                children: <StudentDebtsTable studentId={id} />
              }
            ]}
          />
        </Card>
      </div>
      <AuditModal
        audetModalOpen={audetModalOpen}
        setAudetModalOpen={setAudetModalOpen}
        record={selectedRecord}
      />
    </>
  );
};

export default StudentDetails;