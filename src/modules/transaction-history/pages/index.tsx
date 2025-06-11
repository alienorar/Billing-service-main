
import { useEffect, useMemo, useState } from "react";
import { Button, DatePicker, Input, Select, TablePaginationConfig, Tag } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetTransactionHistory } from "../hooks/queries";
import { RangePickerTimeProps } from "antd/es/time-picker";

const { RangePicker } = DatePicker;

/*************************************
 * Types
 *************************************/
export type TransactionState =
    | "PAID"
    | "PENDING"
    | "FAILED"
    | "CANCELLED"
    | "SUCCESS"
    | string;

export interface TransactionRecord {
    id: number;
    identifier: string;
    amount: number;
    currencyCode: string;
    pinfl: string;
    contractDate: string;
    contractNumber: string;
    docNumber: string;
    status: TransactionState;
    provider: string;
    
    phone: string;
    firstName: string;
    lastName: string;
    group: string;
    speciality: string;
    studentIdNumber: string;
    /* Dates */
    createdAt: string;
    updatedAt: string;
    createdDate: number;
    /* New field */
    existIn1C: boolean;
}

/*************************************
 * Utils
 *************************************/
const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
    Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
    ) as Record<string, string>;

/*************************************
 * Component
 *************************************/
const TransactionHistory: React.FC = () => {
    /* ---------- URL params ---------- */
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const page = Number(searchParams.get("page") ?? 1);
    const size = Number(searchParams.get("size") ?? 10);
    const phone = searchParams.get("phone") ?? "";
    const firstName = searchParams.get("firstName") ?? "";
    const lastName = searchParams.get("lastName") ?? "";
    const pinfl = searchParams.get("pinfl") ?? "";
    const studentIdNumber = searchParams.get("studentIdNumber") ?? "";
    const provider = searchParams.get("provider") ?? "";
    const state = searchParams.get("state") ?? "";
    const from = searchParams.get("from") ?? "";
    const to = searchParams.get("to") ?? "";

    /* ---------- Data ---------- */
    const { data: transactionHistory, isFetching } = useGetTransactionHistory({
        page: page - 1,
        size,
        phone: phone || undefined,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        pinfl: pinfl || undefined,
        studentIdNumber: studentIdNumber || undefined,
        provider: provider || undefined,
        state: state || undefined,
        from: from ? Number(from) : undefined,
        to: to ? Number(to) : undefined,
    });

    const [tableData, setTableData] = useState<TransactionRecord[]>([]);
    const [total, setTotal] = useState<number>(0); // Renamed from setTableData to setTotal

    /* ---------- Effects ---------- */
    useEffect(() => {
        if (transactionHistory?.data?.items) {
            const normalized: TransactionRecord[] = (transactionHistory.data.items as any[]).map(
                (item) => {
                    const student = item.student ?? {};
                    return {
                        id: item.id,
                        identifier: item.identifier,
                        amount: item.amount,
                        currencyCode: item.currencyCode,
                        pinfl: item.pinfl,
                        contractDate: item.contractDate,
                        contractNumber: item.contractNumber,
                        docNumber: item.docNumber,
                        status: item.status,
                        provider: item.provider,
                        phone: student.phone ?? "",
                        firstName: student.firstName ?? "",
                        lastName: student.lastName ?? "",
                        group: student.group ?? "",
                        speciality: student.speciality ?? "",
                        studentIdNumber: student.studentIdNumber ?? "",
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                        createdDate: dayjs(item.createdAt, "DD-MM-YYYY HH:mm:ss").valueOf(),
                        existIn1C: item.existIn1C ?? false, // Ensure existIn1C is boolean, default to false
                    } as TransactionRecord;
                }
            );
            setTableData(normalized);
            setTotal(transactionHistory.data.paging.totalItems ?? 0); // Updated to use setTotal
        }
    }, [transactionHistory]);

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
        const { current = 1, pageSize = 10 } = pagination; // Defaults: page 1, size 10
        updateParams({
            page: current.toString(),
            size: pageSize.toString(),
        });
    };

    const handleDateChange: RangePickerTimeProps<Dayjs>["onChange"] = (dates, _dateStrings) => {
        if (dates && dates[0] && dates[1]) {
            updateParams({
                from: dates[0].startOf("day").valueOf().toString(),
                to: dates[1].endOf("day").valueOf().toString(),
            });
        } else {
            updateParams({ from: undefined, to: undefined });
        }
    };

    const getStatusTagColor = (s: TransactionState): string => {
        switch (s) {
            case "PAID":
            case "SUCCESS":
                return "green";
            case "PENDING":
                return "orange";
            case "FAILED":
                return "red";
            case "CANCELLED":
                return "volcano";
            default:
                return "blue";
        }
    };

    /* ---------- Columns ---------- */
    const columns = useMemo(
        () => [
            {
                title: "Date",
                dataIndex: "createdDate",
                key: "date",
                render: (ts: number): string => dayjs(ts).format("DD-MM-YYYY HH:mm"),
            },
            { title: "Transaction ID", dataIndex: "id", key: "id" },
            {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
                render: (amount: number): string => `${amount.toLocaleString()} UZS`,
            },
            {
                title: "Student",
                key: "student",
                render: (record: TransactionRecord): JSX.Element => (
                    <div>
                        <div>{`${record.firstName} ${record.lastName}`}</div>
                        <div className="text-xs text-gray-500">{record.pinfl}</div>
                    </div>
                ),
            },
            { title: "Phone", dataIndex: "phone", key: "phone" },
            { title: "Group", dataIndex: "group", key: "group" },
            { title: "Speciality", dataIndex: "speciality", key: "speciality" },
            {
                title: "Status",
                dataIndex: "status",
                key: "status",
                render: (s: TransactionState): JSX.Element => <Tag color={getStatusTagColor(s)}>{s}</Tag>,
            },
            { title: "Provider", dataIndex: "provider", key: "provider" },
            {
                title: "Action",
                key: "action",
                render: (record: TransactionRecord): JSX.Element | null =>
                    record.provider !== "BANK" ? (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => navigate(`/super-admin-panel/transaction-history/${record.id}`)}
                            style={{ backgroundColor: "#050556", borderColor: "#050556", color: "white", paddingRight: "2px", paddingLeft: "2px" }}
                        >
                            Check
                        </Button>
                    ) : null,
            },
        ],
        [navigate]
    );

    /* ---------- Options ---------- */
    const providerOptions = [
        { value: "", label: "All" },
        { value: "PAYME", label: "Payme" },
        { value: "CLICK", label: "Click" },
        { value: "UPAY", label: "Upay" },
        { value: "BANK", label: "Bank" },
    ];

    const stateOptions = [
        { value: "SUCCESS", label: "Success" },
        { value: "PENDING", label: "Pending" },
        { value: "FAILED", label: "Failed" },
        { value: "CANCELLED", label: "Cancelled" },
    ];

    /** ------------------- Render ------------------ */
    return (
        <div className="flex flex-col gap-4 px-5 py-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
                <Input
                    placeholder="Phone"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ phone: e.target.value })}
                />
                <Input
                    placeholder="Student ID"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={studentIdNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ studentIdNumber: e.target.value })}
                />
                <Input
                    placeholder="First Name"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ firstName: e.target.value })}
                />
                <Input
                    placeholder="Last Name"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ lastName: e.target.value })}
                />
                <Input
                    placeholder="PINFL"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    value={pinfl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ pinfl: e.target.value })}
                />
                <Select
                    allowClear
                    placeholder="Provider"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    options={providerOptions}
                    value={provider || undefined}
                    onChange={(v) => updateParams({ provider: v || undefined })}
                />
                <Select
                    allowClear
                    placeholder="State"
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    options={stateOptions}
                    value={state || undefined}
                    onChange={(v) => updateParams({ state: v || undefined })}
                />
                <RangePicker
                    style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    className="w-full"
                    format="DD-MM-YYYY"
                    value={from && to ? [dayjs(Number(from)), dayjs(Number(to))] : undefined}
                    onChange={handleDateChange}
                    allowClear
                />
                <Button
                    type="primary"
                    loading={isFetching}
                    className="bg-green-700 text-white w-full md:w-auto"
                    onClick={() => updateParams({})}
                >
                    Search
                </Button>
            </div>

            {/* Table */}
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
                rowClassName={(record: TransactionRecord) =>
                    record.provider !== "BANK" ? (record.existIn1C ? "bg-green-300" : "bg-red-400") : ""
                }
            />
        </div>
    );
};

export default TransactionHistory;
