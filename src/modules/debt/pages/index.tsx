import { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig, Spin, Button, Input, Select, Space, Tooltip, Switch, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetDebtList } from "../hooks/queries";
import { CheckOutlined, CloseOutlined, DownloadOutlined, EditOutlined } from "@ant-design/icons";
import DebtsModal from "./modal";
import { useDeactivateDebt } from "../hooks/mutations";
import { useMutation } from "@tanstack/react-query";
import { downloadDebtReason } from "../service";

interface DebtRecord {
    id: number;
    studentId: number;
    description: string;
    reasonFile: string;
    debtType: string;
    percentRate: number | null;
    studentLevel: number;
    amount: number;
    active: boolean;
}

const Index: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const educationForm = searchParams.get("educationForm") || "";
    const educationType = searchParams.get("educationType") || "";
    const pinfl = searchParams.get("pinfl") || "";
    const active = searchParams.get("active") || "";
    const deactivateDebt = useDeactivateDebt()
    const { data: debtList, isLoading } = useGetDebtList({
        page: page - 1,
        size,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        pinfl: pinfl || undefined,
        educationForm: educationForm || undefined,
        educationType: educationType || undefined,
    });

    const [tableData, setTableData] = useState<DebtRecord[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [update, setUpdate] = useState<any | null>(null);

    useEffect(() => {
        if (debtList?.data?.content) {
            setTableData(debtList.data.content);
            setTotal(debtList.data.paging?.totalItems ?? 0);
        }
    }, [debtList]);


    const showModal = () => setIsModalOpen(true);
    const handleClose = () => {
        setIsModalOpen(false);
        setUpdate(null);
    };

    const editData = (item: any) => {
        setUpdate(item);
        showModal();
    };




    const handleTableChange = (pagination: TablePaginationConfig) => {
        const { current = 1, pageSize = 10 } = pagination;
        setSearchParams({
            page: current.toString(),
            size: pageSize.toString(),
            firstName,
            lastName,
            educationForm,
            educationType,
            pinfl,
            active,
        });
    };

    const { mutate: downloadFile, isPending: isDownloading } = useMutation({
        mutationFn: downloadDebtReason,
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
                // message.error({ content: "Tizimga kirish uchun token topilmadi! Iltimos, qayta kiring.", key: "download" });
                navigate("/login");
            } else if (error.message === "target must be an object") {
                // message.error({ content: "Faylni yuklashda xato: Noto'g'ri so'rov formati!", key: "download" });
            } else {
                // message.error({ content: "Faylni yuklashda xatolik yuz berdi!", key: "download" });
            }
        },
    });

    const handleDownload = (reasonFile: string) => {
        console.log("[handleDownload] Download button clicked for reasonFile:", reasonFile);
        if (reasonFile) {
            downloadFile(reasonFile);
        } else {
            console.error("[handleDownload] No reasonFile provided");
            message.error({ content: "Fayl ID topilmadi!", key: "download" });
        }
    };


    const handleToggleVisibility = (id: number | string, isVisible: boolean) => {
        if (isVisible) {
            deactivateDebt.mutate(id);
        } else {
            deactivateDebt.mutate(id);
        }
    };
    const handleSearch = () => {
        setSearchParams({
            page: "1",
            size: size.toString(),
            firstName,
            lastName,
            educationForm,
            educationType,
            pinfl,
            active,
        });
    };

    const updateParams = (params: {
        firstName?: string;
        lastName?: string;
        educationForm?: string;
        educationType?: string;
        pinfl?: string;
        active?: string;
    }) => {
        setSearchParams({
            page: "1",
            size: size.toString(),
            firstName: params.firstName !== undefined ? params.firstName : firstName,
            lastName: params.lastName !== undefined ? params.lastName : lastName,
            educationForm: params.educationForm !== undefined ? params.educationForm : educationForm,
            educationType: params.educationType !== undefined ? params.educationType : educationType,
            pinfl: params.pinfl !== undefined ? params.pinfl : pinfl,
            active: params.active !== undefined ? params.active : active,
        });
    };

    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a: DebtRecord, b: DebtRecord) => a.id - b.id,
            },
            {
                title: "Student ID",
                dataIndex: "studentId",
                key: "studentId",
                sorter: (a: DebtRecord, b: DebtRecord) => a.studentId - b.studentId,
            },
            {
                title: "Tarifi",
                dataIndex: "description",
                key: "description",
                sorter: (a: DebtRecord, b: DebtRecord) =>
                    a.description.localeCompare(b.description),
            },
            {
                title: "Qarzdorlik turi",
                dataIndex: "debtType",
                key: "debtType",
                sorter: (a: DebtRecord, b: DebtRecord) =>
                    a.debtType.localeCompare(b.debtType),
            },
            {
                title: "Student kursi",
                dataIndex: "studentLevel",
                key: "studentLevel",
                sorter: (a: DebtRecord, b: DebtRecord) => a.studentLevel - b.studentLevel,
            },
            {
                title: "Qarzdorlik miqdori",
                dataIndex: "amount",
                key: "amount",
                sorter: (a: DebtRecord, b: DebtRecord) => a.amount - b.amount,
                render: (_: any, record: DebtRecord) => (
                    <span
                        className={
                            record.amount > 0
                                ? "text-red-500 font-semibold"
                                : "text-green-500 font-semibold"
                        }
                    >
                        {record.amount.toLocaleString()}
                    </span>
                ),
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
                title: "Qarzdorlik sababi",
                key: "download",
                render: (record: any) => (
                    <Space size="middle">
                        {record.reasonFile && (
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
                    </Space>
                ),
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
        ],
        []
    );

    const educationFormOptions: { value: string; label: string }[] = [
        { value: "", label: "All" },
        { value: "SIRTQI", label: "Sirtqi" },
    ];

    const educationTypeOptions: { value: string; label: string }[] = [
        { value: "", label: "All" },
        { value: "BAKALAVR", label: "Bakalavr" },
        { value: "MAGISTR", label: "Magistr" },
    ];

    const activeOptions: { value: string; label: string }[] = [
        { value: "", label: "All" },
        { value: "true", label: "Aktiv" },
        { value: "false", label: "Aktiv emas" },
    ];


    return (
        <>
            <DebtsModal
                open={isModalOpen}
                handleClose={handleClose}
                // studentId={id}
                update={update}
            />
            <div className="flex flex-col gap-4 px-5 py-4">
                <div className="flex gap-4 px-6 items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Input
                            placeholder="Ism orqali qidirish"
                            value={firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateParams({ firstName: e.target.value })
                            }
                            className="w-[300px]"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                        />
                        <Input
                            placeholder="Familiya orqali qidirish"
                            value={lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateParams({ lastName: e.target.value })
                            }
                            className="w-[300px]"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                        />
                        <Input
                            placeholder="PINFL orqali qidirish"
                            value={pinfl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                updateParams({ pinfl: e.target.value })
                            }
                            className="w-[300px]"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                        />
                        <Select
                            allowClear
                            placeholder="Ta'lim shakli"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                            options={educationFormOptions}
                            value={educationForm}
                            onChange={(value: string | undefined) =>
                                updateParams({ educationForm: value })
                            }
                        />
                        <Select
                            allowClear
                            placeholder="Ta'lim turi"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                            options={educationTypeOptions}
                            value={educationType}
                            onChange={(value: string | undefined) =>
                                updateParams({ educationType: value })
                            }
                        />
                        <Select
                            allowClear
                            placeholder="Aktivlik holati"
                            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                            options={activeOptions}
                            value={active || undefined}
                            onChange={(value: string | undefined) =>
                                updateParams({ active: value || undefined })
                            }
                        />
                        <Button
                            type="primary"
                            size="large"
                            style={{
                                maxWidth: 220,
                                minWidth: 80,
                                backgroundColor: "#050556",
                                color: "white",
                                height: 32,
                            }}
                            onClick={handleSearch}
                        >
                            Qidirish
                        </Button>

                        <Button
                            type="primary"
                            size="large"
                            onClick={showModal}
                            style={{
                                maxWidth: 220,
                                minWidth: 80,
                                backgroundColor: "green",
                                color: "white",
                                height: 32,
                            }}
                        >
                            Yaratish
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <Spin style={{ display: "block", margin: "20px auto" }} />
                ) : (
                    <GlobalTable
                        loading={isLoading}
                        data={tableData}
                        columns={columns}
                        handleChange={handleTableChange}
                        pagination={{
                            current: page,
                            pageSize: size,
                            total: total,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                        }}

                    />
                )}
            </div></>
    );
};

export default Index;