import { useEffect, useState } from "react";
import { Button, Input, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetPaymentHistory } from "../hooks/queries";

const Index = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL and search parameters - changed 'studentId' to 'studentIdNumber'
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const phone = searchParams.get("phone") || "";
  const studentIdNumber = searchParams.get("studentIdNumber") || ""; // Changed parameter name

  const { data: paymentHistory } = useGetPaymentHistory({
    size,
    page: page - 1,
    phone,
    studentIdNumber, // Now matches the URL parameter
  });

  useEffect(() => {
    if (paymentHistory?.data?.content) {
      setTableData(paymentHistory.data.content);
      setTotal(paymentHistory.data.paging.totalItems || 0);
    }
  }, [paymentHistory]);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      phone,
      studentIdNumber, // Updated to match
    });
  };

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      phone,
      studentIdNumber, // Updated to match
    });
  };

  const getStatusTagColor = (state: string) => {
    switch (state) {
      case "PAID":
        return "green";
      case "PENDING":
        return "orange";
      case "FAILED":
        return "red";
      default:
        return "blue";
    }
  };

  const columns = [
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
      title: "Student",
      key: "student",
      render: (record: any) => (
        <div>
          <div>{`${record.firstName} ${record.lastName}`}</div>
          <div className="text-xs text-gray-500">{record.studentIdNumber}</div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Speciality",
      dataIndex: "speciality",
      key: "speciality",
    },
    {
      title: "Status",
      dataIndex: "state",
      key: "state",
      render: (state: string) => (
        <Tag color={getStatusTagColor(state)}>{state}</Tag>
      ),
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search by phone"
          value={phone}
          onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
            setSearchParams({
              page: "1",
              size: size.toString(),
              phone: e.target.value,
              studentIdNumber, // Updated to match
            })
          }
          style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
        />
        <Input
          placeholder="Search by student ID"
          value={studentIdNumber} // Updated to match
          onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
            setSearchParams({
              page: "1",
              size: size.toString(),
              phone,
              studentIdNumber: e.target.value, // Updated to match
            })
          }
          style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
        />
        <Button type="primary" onClick={handleSearch} className="bg-green-700 text-white w-[200px]">
          Search
        </Button>
      </div>

      <GlobalTable
        data={tableData}
        columns={columns}
        handleChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: size,
          total: total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </div>
  );
};

export default Index;