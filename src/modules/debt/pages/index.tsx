
// components/StudentDebtsTable.tsx
import { Table, Button, Tooltip, message, Switch, Space } from "antd";
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useGetDebtList } from "../hooks/queries";
import { downloadDebtReason } from "../service";
import DebtsModal from "./modal";
import { useDeactivateDebt } from "../hooks/mutations";
import { openNotification } from "@utils";
import { FiEye } from "react-icons/fi";
import AuditModal from "./auditModal";

interface StudentDebtsTableProps {
    studentId?: string;
}

const StudentDebtsTable: React.FC<StudentDebtsTableProps> = ({ studentId }) => {


    //Pagination
    const [searchParams, setSearchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(() => {
        const page = parseInt(searchParams.get("page") || "1", 10);
        return isNaN(page) || page < 1 ? 1 : page;
    });
    const [pageSize, setPageSize] = useState(() => {
        const size = parseInt(searchParams.get("size") || "10", 10);
        return isNaN(size) || ![10, 20, 50].includes(size) ? 10 : size;
    });
    const { data, isLoading, error } = useGetDebtList({
        studentId,
        page: currentPage - 1,
        size: pageSize,
    });

    error?.message ? openNotification("error", "Xatolik yuz berdi", error.message) : ""
    const [audetModalOpen, setAudetModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [update, setUpdate] = useState<any | null>(null);
    const debts = data?.data?.content || [];
    const deactivateDebt = useDeactivateDebt()

    const showModal = () => setIsModalOpen(true);
    const handleClose = () => {
        setIsModalOpen(false);
        setUpdate(null);
    };
    const showAuditModal = () => {
        setAudetModalOpen(true)
    }





    const totalItems = data?.data?.paging?.totalItems || 0;


    useEffect(() => {
        setSearchParams({ page: currentPage.toString(), size: pageSize.toString() });
    }, [currentPage, pageSize, setSearchParams]);

    useEffect(() => {
        if (totalItems > 0 && currentPage > Math.ceil(totalItems / pageSize)) {
            setCurrentPage(1);
        }
    }, [totalItems, currentPage, pageSize]);

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };




    const { mutate: downloadFile, isPending: isDownloading } = useMutation({
        mutationFn: downloadDebtReason,
        onSuccess: (data, reasonFile) => {
            const url = window.URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.download = `debt_reason_${reasonFile}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success({ content: "Fayl yuklab olindi!", key: "download" });
        },
        onError: (error: any) => {
            console.error(error);
            message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" });
        },
    });
    const handleToggleVisibility = (id: number | string, isVisible: boolean) => {
        if (isVisible) {
            deactivateDebt.mutate(id);
        } else {
            deactivateDebt.mutate(id);
        }
    };

    const handleDownload = (reasonFile: string) => {
        if (reasonFile) downloadFile(reasonFile);
        else message.error({ content: "Fayl ID topilmadi!", key: "download" });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        {
            title: "Talaba",
            key: "studentFullName",
            render: (record: any) => record.student?.fullName || "—",
        },
        {
            title: "Guruh",
            key: "studentGroup",
            render: (record: any) => record.student?.group || "—",
        },
        { title: "Tarif", dataIndex: "description", key: "description" },
        { title: "Turi", dataIndex: "debtType", key: "debtType" },
        {
            title: "Miqdori",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => <span className="text-red-500">{amount.toLocaleString()} UZS</span>,
        },
        {

            title: "Active",
            dataIndex: "active",
            // sorter: false,
            render: (visible: boolean, record: any) => (
                <Switch
                    checked={visible}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    onChange={() => handleToggleVisibility(record.id, visible)}
                    style={{
                        backgroundColor: visible ? "green" : "#999",
                    }}
                />
            ),
        },

        {
            title: "Amallar",
            key: "actions",
            render: (record: any) => (
                <Space>
                    {record.reasonFile && (
                        <Tooltip title="Yuklab olish">
                            <Button
                                onClick={() => handleDownload(record.reasonFile)}
                                loading={isDownloading}
                                icon={<DownloadOutlined />}
                            />
                        </Tooltip>
                    )}
                    <Tooltip title="Tahrirlash">
                        <Button
                            onClick={() => {
                                setUpdate(record);
                                showModal();
                            }}
                            icon={<EditOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Ko'rish">
                        <Button
                            onClick={() => {
                                setSelectedRecord(record);
                                showAuditModal();
                            }}
                        >
                            <FiEye size={18} />
                        </Button>
                    </Tooltip>
                </Space>
            ),
        }

    ];

    return (
        <>
            <DebtsModal open={isModalOpen} handleClose={handleClose} studentId={studentId} update={update} />
            <AuditModal
                audetModalOpen={audetModalOpen}
                setAudetModalOpen={setAudetModalOpen}
                record={selectedRecord}
            />
            <div className="flex justify-end py-4">
                <Button type="primary" onClick={showModal} style={{
                    maxWidth: 80,
                    minWidth: 80,
                    backgroundColor: "#050556",
                    color: "white",
                    height: 40,
                }}>Yaratish</Button>
            </div>
            {isLoading ? (
                <div className="text-center py-8">Yuklanmoqda...</div>
            ) : debts?.length === 0 ? (
                <div className="text-center text-gray-500 py-8">Qarzdorliklar topilmadi</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={debts}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalItems,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50"],
                        showTotal: (total) => `Jami: ${total} qarzdorlik`,
                        onChange: (page, pageSize) => handleTableChange({ current: page, pageSize }),
                    }}
                />

            )}
        </>
    );
};

export default StudentDebtsTable;

