import { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig, Spin, Alert, Button } from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetStudents } from "../hooks/queries";
import { ArrowLeftOutlined } from "@ant-design/icons";

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
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
    ) as Record<string, string>;

const GroupSinglePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const groupId = id ? Number(id) : undefined;

    // Handle invalid groupId
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
    });

    const [tableData, setTableData] = useState<StudentRecord[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        if (studentsByGroupId?.data?.content) {
            setTableData(studentsByGroupId.data.content);
            setTotal(studentsByGroupId.data.paging.totalItems ?? 0);
        }
    }, [studentsByGroupId]);

    const updateParams = (changed: Record<string, string | undefined>): void => {
        const merged = {
            ...Object.fromEntries(searchParams.entries()),
            ...changed,
        } as Record<string, string | undefined>;
        if (!("page" in changed)) merged.page = "1";
        if (!("size" in merged)) merged.size = size.toString();
        setSearchParams(filterEmpty(merged));
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        const { current = 1, pageSize = 10 } = pagination;
        updateParams({
            page: current.toString(),
            size: pageSize.toString(),
        });
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
                title: "PINFL",
                dataIndex: "pinfl",
                key: "pinfl",
                sorter: (a: StudentRecord, b: StudentRecord) => a.pinfl.localeCompare(b.pinfl),
            },
            {
                title: "Student ID",
                dataIndex: "studentIdNumber",
                key: "studentIdNumber",
                sorter: (a: StudentRecord, b: StudentRecord) => a.studentIdNumber.localeCompare(b.studentIdNumber),
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
            <div className="flex gap-7 px-6 items-center justify-between">
                <h1 className="text-green-500">Studentlar guruhi IDsi: {id}</h1>
                <Button className="text-green-500" type="default" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                    Ortga
                </Button>
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