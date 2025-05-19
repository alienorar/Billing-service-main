import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, TablePaginationConfig, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetPaymentHistory } from "../hooks/queries";


/*******************************
 * Types
 *******************************/
export type PaymentState = "PAID" | "PENDING" | "FAILED" | "CANCELLED" | string;

export interface PaymentRecord {
  id: number;
  clickTransId: number;
  amount: number;
  amountWithCommission: number;
  pinfl: string;
  phone: string;
  firstName: string;
  lastName: string;
  group: string;
  speciality: string;
  studentIdNumber: string;
  action: string;
  provider: string;
  state: PaymentState;
  createdAt?: string;
  updatedAt?: string;
}

/*******************************
 * Utils
 *******************************/
const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
  ) as Record<string, string>;

/*******************************
 * Component
 ******************************/
const PaymentHistory: React.FC = () => {
  /* ---------- URL params ---------- */
  const [searchParams, setSearchParams] = useSearchParams();

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
  const { data: paymentHistory, isFetching } = useGetPaymentHistory({
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

  const [tableData, setTableData] = useState<PaymentRecord[]>([]);
  const [total, setTotal] = useState<number>(0);

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (paymentHistory?.data?.content) {
      setTableData(paymentHistory.data.content);
      setTotal(paymentHistory.data.paging?.totalItems ?? paymentHistory.data.content.length);
    }
  }, [paymentHistory]);

  /* ---------- Helpers ---------- */
  const updateParams = (changed: Record<string, string | undefined>) => {
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
    size: pageSize.toString() 
  });
};

  const getStatusTagColor = (s: PaymentState): string => {
    switch (s) {
      case "PAID":
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
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
      },
      {
        title: "Transaction ID",
        dataIndex: "clickTransId",
        key: "clickTransId",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => `${amount.toLocaleString()} UZS`,
      },
      {
        title: "Amount (with commission)",
        dataIndex: "amountWithCommission",
        key: "amountWithCommission",
        render: (amount: number) => `${amount.toLocaleString()} UZS`,
      },
      {
        title: "Student",
        key: "student",
        render: (record: PaymentRecord) => (
          <div>
            <div>{`${record.firstName} ${record.lastName}`}</div>
            <div className="text-xs text-gray-500">{record.studentIdNumber}</div>
          </div>
        ),
      },
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone"
      },
      {
        title: "Group",
        dataIndex: "group",
        key: "group"
      },
      {
        title: "Speciality",
        dataIndex: "speciality",
        key: "speciality"
      },
      {
        title: "Status",
        dataIndex: "state",
        key: "state",
        render: (state: PaymentState) => <Tag color={getStatusTagColor(state)}>{state}</Tag>,
      },
      {
        title: "Provider",
        dataIndex: "provider",
        key: "provider"
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
      },
    ],
    []
  );


  const stateOptions = [
    { value: "PAID", label: "Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "FAILED", label: "Failed" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

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
          placeholder="State"
          style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}

          options={stateOptions}
          value={state || undefined}
          onChange={(v) => updateParams({ state: v || undefined })}
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
      />
    </div>
  );
};

export default PaymentHistory;