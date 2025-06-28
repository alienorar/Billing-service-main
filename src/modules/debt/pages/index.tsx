// components/StudentDebtsTable.tsx
import { Table, Button, Tooltip, message, Switch } from "antd";
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGetDebtList } from "../hooks/queries";
import {  downloadDebtReason } from "../service";
import DebtsModal from "./modal";
import { useDeactivateDebt } from "../hooks/mutations";

interface StudentDebtsTableProps {
  studentId?: string; 
}

const StudentDebtsTable: React.FC<StudentDebtsTableProps> = ({ studentId }) => {
    const { data, isLoading } = useGetDebtList({ studentId });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [update, setUpdate] = useState<any | null>(null);
    const debts = data?.data?.content || [];
    const deactivateDebt = useDeactivateDebt()
    const showModal = () => setIsModalOpen(true);
    const handleClose = () => {
        setIsModalOpen(false);
        setUpdate(null);
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
            title: "Fayl",
            key: "download",
            render: (record: any) =>
                record.reasonFile && (
                    <Tooltip title="Yuklab olish">
                        <Button onClick={() => handleDownload(record.reasonFile)} loading={isDownloading}>
                            <DownloadOutlined />
                        </Button>
                    </Tooltip>
                ),
        },
        {
            title: "Amallar",
            key: "action",
            render: (record: any) => (
                <Tooltip title="Tahrirlash">
                    <Button onClick={() => { setUpdate(record); showModal(); }}>
                        <EditOutlined />
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <DebtsModal open={isModalOpen} handleClose={handleClose} studentId={studentId} update={update} />
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
                    pagination={false}
                />
            )}
        </>
    );
};

export default StudentDebtsTable;
