import { useEffect, useState } from "react";
import { Button} from "antd";
import { useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetPmtGroupList } from "../hooks/queries";
import "antd/dist/reset.css";

// Define interfaces
interface PaymentGroup {
  id: number;
  name: string;
  duration: number;
  contractAmounts: Record<string, number>;
  groupIds: number[];
}


interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
}

const Index = () => {
  const [tableData, setTableData] = useState<PaymentGroup[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const name = searchParams.get("name") || "";

  // Fetch data
  const { data: pmGroupList, isFetching } = useGetPmtGroupList();

  useEffect(() => {
    if (pmGroupList?.data) {
      setTableData(pmGroupList.data);
      setTotal(pmGroupList.data.paging?.totalItems || 0);
    }
  }, [pmGroupList]);

  // Handle table pagination and size change
  const handleTableChange = (pagination: TablePagination) => {
    const { current, pageSize } = pagination;
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      name,
    });
  };

  // Handle search
  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      name,
    });
  };

 

  // Define columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center" as const,
      className: "text-center font-semibold text-gray-700 ",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      className: "text-gray-800",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      align: "center" as const,
      className: "text-center text-gray-700",
    },
    {
      title: "Contract Amounts",
      dataIndex: "contractAmounts",
      key: "contractAmounts",
      render: (contractAmounts: Record<string, number>) => (
        <div className="flex flex-wrap gap-2">
          {Object.entries(contractAmounts).map(([year, amount]) => (
            <span
              key={year}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full sm:px-1.5 sm:py-0.5 sm:text-xs"
            >
              Year {year}: {amount.toLocaleString()} UZS
            </span>
          ))}
        </div>
      ),
      className: "text-gray-800",
    },

  
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
  
          <Button
            type="primary"
            size="large"
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white h-10 px-6"
          >
          Create
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <GlobalTable
          loading={isFetching}
          data={tableData}
          columns={columns}
          handleChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: size,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["1", "2", "5", "10"],
          }}
        
          className="font-inter"
          rowClassName={(_: PaymentGroup, index: number) =>
            index % 2 === 0
              ? "bg-white hover:bg-blue-50"
              : "bg-gray-50 hover:bg-blue-50"
          }
        />
      </div>
    </div>
  );
};

export default Index;