"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, Card, Spin, Select, Input } from "antd";
import { useGetSpecialityStatistics } from "../hooks/queries";

// Types
interface Specialty {
    id: number;
    name: string;
    code: string;
    educationType: string;
    educationForm: string;
    specialityId: number;
    studentCount: number;
    contractStudentCount: number;
    allStudentContractMustPaid: number;
    allStudentRemainContractAmount: number;
    allStudentDebtAmount: number;
    allStudentPaidAmount: number;
    allDiscountAmount: number;
}

const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      result[key] = value;
    }
  });

  return result;
};


const Index = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const name = searchParams.get("name") ?? "";
    const educationForm = searchParams.get("educationForm") ?? "";
    const educationType = searchParams.get("educationType") ?? "";

    const [tableData, setTableData] = useState<Specialty[]>([]);
    const [total, setTotal] = useState<number>(0);

    const { data: statisticsData, isLoading } = useGetSpecialityStatistics({
        page: page - 1,
        size,
        name: name || undefined,
        educationForm: educationForm || undefined,
        educationType: educationType || undefined,
    });

    useEffect(() => {
        if (statisticsData?.data) {
            setTableData(statisticsData.data.content);
            setTotal(statisticsData.data.paging.totalItems);
        }
    }, [statisticsData]);

    const formatCurrency = (amount: number) => `${amount.toLocaleString()} UZS`;

    const updateParams = (changed: Record<string, string | undefined>) => {
        const merged = {
            ...Object.fromEntries(searchParams.entries()),
            ...changed,
        };
        if (!("page" in changed)) merged.page = "1";
        if (!("size" in merged)) merged.size = size.toString();
        setSearchParams(filterEmpty(merged));
    };

    const handleTableChange = (pagination: { current: number; pageSize: number }) => {
        updateParams({
            page: pagination.current.toString(),
            size: pagination.pageSize.toString(),
        });
    };

    const columns = useMemo(
        () => [
            {
                title: "Yo'nalish Nomi",
                dataIndex: "name",
                key: "name",
                sorter: (a: Specialty, b: Specialty) => a.name.localeCompare(b.name),
            },
            {
                title: "Kodi",
                dataIndex: "code",
                key: "code",
                sorter: (a: Specialty, b: Specialty) => a.code.localeCompare(b.code),
            },
            {
                title: "Ta'lim Turi",
                dataIndex: "educationType",
                key: "educationType",
                sorter: (a: Specialty, b: Specialty) => a.educationType.localeCompare(b.educationType),
            },
            {
                title: "Ta'lim Shakli",
                dataIndex: "educationForm",
                key: "educationForm",
                sorter: (a: Specialty, b: Specialty) => a.educationForm.localeCompare(b.educationForm),
            },
            {
                title: "Talabalar Soni",
                dataIndex: "studentCount",
                key: "studentCount",
                sorter: (a: Specialty, b: Specialty) => a.studentCount - b.studentCount,
            },
            {
                title: "Shartnoma Talabalari",
                dataIndex: "contractStudentCount",
                key: "contractStudentCount",
                sorter: (a: Specialty, b: Specialty) => a.contractStudentCount - b.contractStudentCount,
            },
            {
                title: "Jami Shartnoma",
                dataIndex: "allStudentContractMustPaid",
                key: "allStudentContractMustPaid",
                render: (value: number) => formatCurrency(value),
                sorter: (a: Specialty, b: Specialty) =>
                    a.allStudentContractMustPaid - b.allStudentContractMustPaid,
            },
            {
                title: "To‘langan",
                dataIndex: "allStudentPaidAmount",
                key: "allStudentPaidAmount",
                render: (value: number) => formatCurrency(value),
                sorter: (a: Specialty, b: Specialty) =>
                    a.allStudentPaidAmount - b.allStudentPaidAmount,
            },
            {
                title: "Qolgan",
                dataIndex: "allStudentRemainContractAmount",
                key: "allStudentRemainContractAmount",
                render: (value: number) => formatCurrency(value),
                sorter: (a: Specialty, b: Specialty) =>
                    a.allStudentRemainContractAmount - b.allStudentRemainContractAmount,
            },
            {
                title: "Qarz",
                dataIndex: "allStudentDebtAmount",
                key: "allStudentDebtAmount",
                render: (value: number) => formatCurrency(value),
                sorter: (a: Specialty, b: Specialty) =>
                    a.allStudentDebtAmount - b.allStudentDebtAmount,
            },
            {
                title: "Chegirma",
                dataIndex: "allDiscountAmount",
                key: "allDiscountAmount",
                render: (value: number) => formatCurrency(value),
                sorter: (a: Specialty, b: Specialty) =>
                    a.allDiscountAmount - b.allDiscountAmount,
            },
        ],
        [page, size]
    );

    const educationFormOptions = [
        { value: "", label: "Barchasi" },
        { value: "KUNDUZGI", label: "Kunduzgi" },
        { value: "SIRTQI", label: "Sirtqi" },
    ];

    const educationTypeOptions = [
        { value: "", label: "Barchasi" },
        { value: "BAKALAVR", label: "Bakalavr" },
        { value: "MAGISTR", label: "Magistr" },
    ];

    return (
        <div style={{ padding: 24 }}>
            {/* Filter controls with flex */}
            <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end"
            >
                <Input
                    placeholder="Yo'nalish nomi"
                    value={name}
                    onChange={(e) => updateParams({ name: e.target.value })}
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px",maxWidth:"200px" }}
                />
                <Select
                    allowClear
                    placeholder="Ta'lim shakli"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={educationForm || undefined}
                    options={educationFormOptions}
                    onChange={(value) => updateParams({ educationForm: value || undefined })}
                />
                <Select
                    allowClear
                    placeholder="Ta'lim turi"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={educationType || undefined}
                    options={educationTypeOptions}
                    onChange={(value) => updateParams({ educationType: value || undefined })}
                />
            </div>


            {/* Table */}
            {isLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" tip="Statistikani yuklash..." />
                </div>
            ) : (
                <Card bordered={false}>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={tableData}
                        pagination={{
                            current: page,
                            pageSize: size,
                            total,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                            onChange: (page, pageSize) =>
                                handleTableChange({ current: page, pageSize }),
                        }}
                        scroll={{ x: "max-content" }}
                    />
                </Card>
            )}
        </div>
    );
};

export default Index;
