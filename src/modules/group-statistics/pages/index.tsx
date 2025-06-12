import { useEffect, useMemo, useState } from "react";
import { TablePaginationConfig } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components"; // Assuming this is your custom Table component
import { useGetGroupStatistics } from "../hooks/queries";

interface GroupStatisticsRecord {
    id: number;
    name: string;
    speciality: string;
    studentCount: number;
    contractStudentCount: number;
    allStudentDebts: number | null;
    allStudentPaid: number | null;
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
    ) as Record<string, string>;

const Index: React.FC = () => {
    /* ---------- URL params ---------- */
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);

    /* ---------- Data ---------- */
    const { data: groupStatistics, isFetching } = useGetGroupStatistics({
        page: page - 1,
        size,
    });

    const [tableData, setTableData] = useState<GroupStatisticsRecord[]>([]);
    const [total, setTotal] = useState<number>(0);

    /* ---------- Effects ---------- */
    useEffect(() => {
        if (groupStatistics?.data?.content) {
            const normalized: GroupStatisticsRecord[] = groupStatistics.data.content.map(
                (item: any) => ({
                    id: item.id,
                    name: item.name,
                    speciality: item.speciality,
                    studentCount: item.studentCount,
                    contractStudentCount: item.contractStudentCount,
                    allStudentDebts: item.allStudentDebts,
                    allStudentPaid: item.allStudentPaid,
                })
            );
            setTableData(normalized);
            setTotal(groupStatistics.data.paging.totalItems ?? 0);
        }
    }, [groupStatistics]);

    /* ---------- Helpers ---------- */
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

    /* ---------- Row Click Handler ---------- */
    const handleRowClick = (record: GroupStatisticsRecord) => {
        navigate(`/super-admin-panel/group-statistics/${record.id}`);
    };

    /* ---------- Columns ---------- */
    const columns = useMemo(
        () => [
            {
                title: "ID",
                dataIndex: "id",
                key: "id",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) => a.id - b.id,
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.name.localeCompare(b.name),
                render: (text: string, record: GroupStatisticsRecord) => (
                    <a onClick={() => handleRowClick(record)} style={{ color: "#050556" }}>
                        {text}
                    </a>
                ), // Fallback: clickable name
            },
            {
                title: "Speciality",
                dataIndex: "speciality",
                key: "speciality",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.speciality.localeCompare(b.speciality),
            },
            {
                title: "Student Count",
                dataIndex: "studentCount",
                key: "studentCount",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.studentCount - b.studentCount,
            },
            {
                title: "Contract Student Count",
                dataIndex: "contractStudentCount",
                key: "contractStudentCount",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.contractStudentCount - b.contractStudentCount,
            },
            {
                title: "All Student Debts",
                dataIndex: "allStudentDebts",
                key: "allStudentDebts",
                render: (value: number | null) => (value ? value.toLocaleString() : "-"),
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    (a.allStudentDebts || 0) - (b.allStudentDebts || 0),
            },
            {
                title: "All Student Paid",
                dataIndex: "allStudentPaid",
                key: "allStudentPaid",
                render: (value: number | null) => (value ? value.toLocaleString() : "-"),
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    (a.allStudentPaid || 0) - (b.allStudentPaid || 0),
            },
        ],
        []
    );

    return (
        <div className="flex flex-col gap-4 px-5 py-4">
            <GlobalTable
                loading={isFetching}
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
                onRow={(record: GroupStatisticsRecord) => ({
                    onClick: () => handleRowClick(record), // Row click navigation
                })}
            />
        </div>
    );
};

export default Index;