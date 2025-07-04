import { Button, Table, Tooltip, Space } from "antd";
import {  DownloadOutlined } from "@ant-design/icons";
import { useMutation,  } from "@tanstack/react-query";
import { message } from "antd";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetStudentsDiscounts } from "../hooks/queries";
import { downloadDiscountReason } from "../service";
// import DiscountsModal from "./modal";

interface DiscountType {
  id: string;
  studentId: string;
  description: string;
  discountType: string;
  studentLevel: string;
  amount: number;
  reasonFile?: string;
}

const DiscountsSection = () => {
  const { id: studentId } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  // const queryClient = useQueryClient();

  // Initialize pagination from query parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(page) || page < 1 ? 1 : page;
  });
  const [pageSize, setPageSize] = useState(() => {
    const size = parseInt(searchParams.get("size") || "10", 10);
    return isNaN(size) || ![10, 20, 50].includes(size) ? 10 : size;
  });

  // Fetch discounts with pagination
  const { data: studentsDiscounts, isLoading, error } = useGetStudentsDiscounts({
    studentId,
    page: currentPage - 1, 
    size: pageSize,
  });

  // Extract discounts and pagination data
  const discounts = studentsDiscounts?.data?.content || [];
  const totalItems = studentsDiscounts?.data?.paging?.totalItems || 0;
  const totalPages = studentsDiscounts?.data?.paging?.totalPages || 0;

  // Debug API response
  useEffect(() => {
    console.log("[useGetStudentsDiscounts] Response:", {
      studentsDiscounts,
      discounts,
      totalItems,
      totalPages,
      currentPage,
      pageSize,
      queryParams: { page: currentPage - 1, size: pageSize },
    });
  }, [studentsDiscounts, discounts, totalItems, totalPages, currentPage, pageSize]);

  useEffect(() => {
    setSearchParams({ page: currentPage.toString(), size: pageSize.toString() });
  }, [currentPage, pageSize, setSearchParams]);

  useEffect(() => {
    if (totalItems > 0 && totalPages > 0 && currentPage > totalPages) {
      console.log(
        `[Pagination] Resetting currentPage from ${currentPage} to 1 due to totalPages: ${totalPages}, totalItems: ${totalItems}, pageSize: ${pageSize}`
      );
      setCurrentPage(1);
    }
  }, [totalItems, totalPages, currentPage, pageSize]);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [update, setUpdate] = useState<DiscountType | null>(null);

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
      } else if (error.message === "target must be an object") {
        message.error({ content: "Faylni yuklashda xato: Noto'g'ri so'rov formati!", key: "download" });
      } else {
        message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" });
      }
    },
  });

  const handleDownload = (reasonFile: string | undefined) => {
    console.log("[handleDownload] Download button clicked for reasonFile:", reasonFile);
    if (reasonFile) {
      downloadFile(reasonFile);
    } else {
      console.error("[handleDownload] No reasonFile provided");
      message.error({ content: "Fayl ID topilmadi!", key: "download" });
    }
  };

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleClose = () => {
  //   setIsModalOpen(false);
  //   setUpdate(null);
  //   queryClient.invalidateQueries({ queryKey: ["studentsDiscounts", studentId] });
  // };

  // const editData = (item: DiscountType) => {
  //   setUpdate(item);
  //   showModal();
  // };

  const handleTableChange = (pagination: any) => {
    console.log("[handleTableChange] Pagination:", pagination);
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const discountColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Talaba",
      key: "studentName",
      render: (record: any) => record.student?.fullName || "-",
    },
    {
      title: "Guruh",
      key: "group",
      render: (record: any) => record.student?.group || "-",
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
      title: "Chegirma Sababi",
      key: "download",
      render: (record: DiscountType) => (
        <Space size="middle">
          {record.reasonFile && (
            <Tooltip title="Faylni yuklab olish">
              <Button
                onClick={() => {
                  console.log("[Button] Download button clicked for record:", record);
                  handleDownload(record.reasonFile);
                }}
                loading={isDownloading}
                disabled={isDownloading}
              >
                <DownloadOutlined />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (record: DiscountType) => (
    //     <Space size="middle">
    //       <Tooltip title="Tahrirlash">
    //         <Button onClick={() => editData(record)}>
    //           <EditOutlined />
    //         </Button>
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
  ];

  if (error) {
    return <text type="danger">Ma'lumotlarni yuklashda xatolik: {error.message}</text>;
  }

  return (
    <>
      {/* <DiscountsModal
        open={isModalOpen}
        handleClose={handleClose}
        studentId={studentId}
        update={update}
      /> */}
      {/* <div className="flex w-full items-center justify-end py-4">
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
      </div> */}
      {discounts?.length ? (
        <div>
          <Table
            columns={discountColumns}
            dataSource={discounts}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalItems,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
              showTotal: (total) => `Jami: ${total} chegirma`,
              onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
            }}
            loading={isLoading}
            style={{ marginBottom: 16 }}
          />
        </div>
      ) : (
        <h2>Chegirmalar topilmadi</h2>
      )}
    </>
  );
};

export default DiscountsSection;