import {FiDownload } from "react-icons/fi"
import { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig, Spin, Alert, Button, Input } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useExportStudentList } from "../hooks/mutations"; 
import { useGetStudents } from "../hooks/queries";
import { ArrowLeftOutlined,  } from "@ant-design/icons";

interface StudentRecord {
    id: number;
    pinfl: string;
    studentIdNumber: string;
    phone: string;
    fullName: string;
    educationType: string;
    educationForm: string;
    speciality: string;
    group: string;
    paymentGroup: string | null;
    level: string;
    paymentDetails: DebtAmout;
}

interface DebtAmout {
    studentDebtAmount?: number;
    studentMustPaidAmount?: number;
    studentContractAmount?: number;
    studentPaidAmount?: number;
    studentDiscountAmount?: number;
}


const GroupSinglePage: React.FC = () => {
    const exportStudentsMutation = useExportStudentList();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const groupId = id ? Number(id) : undefined;
    const phone = searchParams.get("phone") || "";
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const showDebt = searchParams.get("showDebt") || "";

    if (!groupId || isNaN(groupId)) {
        return (
            <Alert
                message="Invalid Group ID"
                description="Please provide a valid group ID."
                type="error"
                showIcon
                style={{ margin: "20px" }}
            />
        );
    }

    const { data: studentsByGroupId, isLoading, isError, error } = useGetStudents({
        page: page - 1,
        size,
        groupId,
        phone: phone ? Number(phone) : undefined,
        firstName,
        lastName,
        showDebt: true,

    });

    const [tableData, setTableData] = useState<StudentRecord[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        if (studentsByGroupId?.data?.content) {
            setTableData(studentsByGroupId.data.content);
            setTotal(studentsByGroupId.data.paging.totalItems ?? 0);
        }
    }, [studentsByGroupId]);


    const handleTableChange = (pagination: TablePaginationConfig) => {
        const { current = 1, pageSize = 10 } = pagination;
        setSearchParams({
            page: current.toString(),
            size: pageSize.toString(),
            phone,
            firstName,
            lastName,
            showDebt,
        });
    };

    const handleSearch = () => {
        setSearchParams({
            page: "1",
            size: size.toString(),
            phone,
            firstName,
            lastName,
            showDebt,
        });
    };

    const handleExportStudents = () => {
        const exportParams = {
            phone: phone ? Number(phone) : undefined,
            firstName,
            lastName,
            showDebt: true,
            groupId, 
        };

        
        const cleanParams = Object.fromEntries(
            Object.entries(exportParams).filter(([_, value]) => value !== undefined && value !== "")
        );

        exportStudentsMutation.mutate(cleanParams);
    };



    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a: StudentRecord, b: StudentRecord) => a.id - b.id,
            },
            {
                title: "Full Name",
                dataIndex: "fullName",
                key: "fullName",
                sorter: (a: StudentRecord, b: StudentRecord) => a.fullName.localeCompare(b.fullName),
            },


            {
                title: "Phone",
                dataIndex: "phone",
                key: "phone",
                sorter: (a: StudentRecord, b: StudentRecord) => a.phone.localeCompare(b.phone),
            },
            {
                title: "Speciality",
                dataIndex: "speciality",
                key: "speciality",
                sorter: (a: StudentRecord, b: StudentRecord) => a.speciality.localeCompare(b.speciality),
            },
            {
                title: "Group",
                dataIndex: "group",
                key: "group",
                sorter: (a: StudentRecord, b: StudentRecord) => a.group.localeCompare(b.group),
            },
            {
                title: "Level",
                dataIndex: "level",
                key: "level",
                sorter: (a: StudentRecord, b: StudentRecord) => a.level.localeCompare(b.level),
            },
            {
                title: "Qarzdorlik",
                key: "studentDebtAmount",
                sorter: (a: StudentRecord, b: StudentRecord) => {
                    const valA = a.paymentDetails?.studentDebtAmount ?? 0;
                    const valB = b.paymentDetails?.studentDebtAmount ?? 0;
                    return valA - valB;
                },
                render: (_: any, record: StudentRecord) => {
                    const amount = record.paymentDetails?.studentDebtAmount ?? 0;
                    return (
                        <span className={amount < 0 ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
                            {amount.toLocaleString()}
                        </span>
                    );
                },
            }



        ],
        []
    );

    if (isError) {
        return (
            <Alert
                message="Error"
                description={error instanceof Error ? error.message : "Failed to load students."}
                type="error"
                showIcon
                style={{ margin: "20px" }}
            />
        );
    }

    return (
        <div className="flex flex-col gap-4 px-5 py-4">
            <div className="flex gap-4 px-6 items-center justify-between">
                <Button className="text-green-500" type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Ortga
                </Button>
                <div className="flex items-center justify-between gap-3">
                    <Button
                        type="primary"
                        size="large"
                        icon={<FiDownload size={16} />}
                        style={{
                            maxWidth: 246,
                            minWidth: 80,
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                            color: "white",
                            height: 32,
                            paddingRight: "8px",
                            paddingLeft: "8px",
                        }}
                        className="text-[16px] mx-2"
                        onClick={handleExportStudents} 
                        loading={exportStudentsMutation.isPending} 
                        >
                        Studentlar ro'yhatini yuklash
                    </Button>


                    <Input
                        placeholder="Tel"
                        value={phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchParams({
                                page: "1",
                                size: size.toString(),
                                phone: e.target.value,
                                firstName,
                                lastName,
                                showDebt,
                            })
                        }
                        style={{
                            padding: "6px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px",
                        }}
                        className="w-[300px]"
                    />
                    <Input
                        placeholder="Ism"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchParams({
                                page: "1",
                                size: size.toString(),
                                phone,
                                firstName: e.target.value,
                                lastName,
                                showDebt,
                            })
                        }
                        style={{
                            padding: "6px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px",
                        }}
                        className="w-[300px]"
                    />
                    <Input
                        placeholder="Familiya"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchParams({
                                page: "1",
                                size: size.toString(),
                                phone,
                                firstName,
                                lastName: e.target.value,
                                showDebt,
                            })
                        }
                        style={{
                            padding: "6px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "6px",
                        }}
                        className="w-[300px]"
                    />



                    <Button
                        type="primary"
                        size="large"
                        style={{
                            maxWidth: 220,
                            minWidth: 80,
                            backgroundColor: "green",
                            color: "white",
                            height: 32,
                        }}
                        onClick={handleSearch}
                    >
                        Qidirish
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
                    onRow={(record: StudentRecord) => ({
                        onClick: () => navigate(`/super-admin-panel/students/${record.id}`),
                    })}
                />
            )}
        </div>
    );
};

export default GroupSinglePage;