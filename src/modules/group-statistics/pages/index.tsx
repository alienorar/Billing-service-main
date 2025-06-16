import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, TablePaginationConfig } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
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
    const name = searchParams.get("name") ?? "";
    const educationLang = searchParams.get("educationLang") ?? "";
    const educationForm = searchParams.get("educationForm") ?? "";
    const educationType = searchParams.get("educationType") ?? "";
    const active = searchParams.get("active") ?? "";

    /* ---------- Data ---------- */
    const { data: groupStatistics, isFetching } = useGetGroupStatistics({
        page: page - 1,
        size,
        name: name || undefined,
        educationLang: educationLang || undefined,
        educationForm: educationForm || undefined,
        educationType: educationType || undefined,
        active: active || undefined,
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
                title: "Nomi",
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
                title: "Mutaxasisligi",
                dataIndex: "speciality",
                key: "speciality",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.speciality.localeCompare(b.speciality),
            },
            {
                title: "Studentlar soni",
                dataIndex: "studentCount",
                key: "studentCount",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.studentCount - b.studentCount,
            },
            {
                title: "Kontrakt studentlar soni",
                dataIndex: "contractStudentCount",
                key: "contractStudentCount",
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    a.contractStudentCount - b.contractStudentCount,
            },
            {
                title: "Qarzdorlik summasi",
                dataIndex: "allStudentDebts",
                key: "allStudentDebts",
                render: (value: number | null) => (value ? value.toLocaleString() : "-"),
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    (a.allStudentDebts || 0) - (b.allStudentDebts || 0),
            },
            {
                title: "Jami to'langan summa",
                dataIndex: "allStudentPaid",
                key: "allStudentPaid",
                render: (value: number | null) => (value ? value.toLocaleString() : "-"),
                sorter: (a: GroupStatisticsRecord, b: GroupStatisticsRecord) =>
                    (a.allStudentPaid || 0) - (b.allStudentPaid || 0),
            },
        ],
        []
    );

    /* ---------- Options ---------- */
  const educationLangOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "UZB", label: "Uzbek" },
  ];

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
        <div className="flex flex-col gap-4 px-5 py-4">
              {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
          <Input
            placeholder="Guruh nomi"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ name: e.target.value })}
          />
          <Select
            allowClear
            placeholder="Ta'lim tili"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={educationLangOptions}
            value={educationLang || undefined}
            onChange={(value: string | undefined) => updateParams({ educationLang: value || undefined })}
          />
          <Select
            allowClear
            placeholder="Ta'lim shakli"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={educationFormOptions}
            value={educationForm || undefined}
            onChange={(value: string | undefined) => updateParams({ educationForm: value || undefined })}
          />
          <Select
            allowClear
            placeholder="Ta'lim turi"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={educationTypeOptions}
            value={educationType || undefined}
            onChange={(value: string | undefined) => updateParams({ educationType: value || undefined })}
          />
          <Select
            allowClear
            placeholder="Aktivligi"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={activeOptions}
            value={active || undefined}
            onChange={(value: string | undefined) => updateParams({ active: value || undefined })}
          />
          <Button
            type="primary"
            loading={isFetching}
            className="bg-green-700 text-white w-full md:w-auto"
            onClick={() => updateParams({})}
          >
           Qidirish
          </Button>
        </div>

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