import { useEffect, useState, useMemo } from "react";
import { Button, Popconfirm, Space, Tooltip, message } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TablePaginationConfig } from "antd";
import { GlobalTable } from "@components";
import { PaymentGroup, } from "@types";
import { useGetPmtGroupList, } from "../hooks/queries";
import PmtGroupModal from "./modal";
import "antd/dist/reset.css";
import { useDeletePmtGroupList } from "../hooks/mutations";
import { FiEye } from "react-icons/fi";
import { openNotification } from "@utils";

const Index = () => {
  const [tableData, setTableData] = useState<PaymentGroup[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState<PaymentGroup | null>(null);
  const { mutate: deletePmtGroup, isPending: isDeleting } = useDeletePmtGroupList();
  const navigate = useNavigate();

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  // Temporary search state
  // const [tempSearchParams, setTempSearchParams] = useState({ name });

  // Fetch payment groups with parameters
  const { data: pmGroupList, isFetching, error } = useGetPmtGroupList({
    size,
    page: page - 1, // Adjust for 0-based API

  });

  // Update table data and log response
  useEffect(() => {
    console.log("Payment Groups Response:", pmGroupList);
    console.log("API Error:", error);
    if (pmGroupList?.data?.content) {
      setTableData(pmGroupList.data.content);
      setTotal(pmGroupList.data.paging?.totalItems || 0);
    } else {
      setTableData([]);
      setTotal(0);
    }
  }, [pmGroupList]);

  // Handle table pagination and size change
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = pagination;
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),

    });
  };

  // Handle search
  // const handleSearch = () => {
  //   setSearchParams({
  //     page: "1",
  //     size: size.toString(),

  //   });
  // };

  // Modal handlers
  const showModal = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate(null);
  };

  // Edit handler
  const editData = (item: PaymentGroup) => {
    setUpdate(item);
    showModal();
  };

  // Delete handler
  const deleteData = (id: number) => {
    if (id == null) {
      openNotification("error","Error","Invalid payment group ID");
      return;
    }
    deletePmtGroup(id);
  };

  const handleView = (id: number | undefined) => {
    navigate(`/super-admin-panel/pmgroup-controller/${id}`);
  };



  // Define columns with memoization
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        width: 80,
        align: "center" as const,
        className: "text-center font-semibold text-gray-700",
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
        render: (contractAmounts: Record<string, number> = {}) => (
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
      {
        title: "Action",
        key: "action",
        render: (_: any, record: any) => (
          <Space size="middle">
            <Tooltip title="Edit">
              <Button onClick={() => editData(record)}>
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Popconfirm
                title="Are you sure you want to delete this payment group?"
                onConfirm={() => deleteData(record.id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{
                  style: {
                    backgroundColor: "green",
                    borderColor: "green",
                    marginLeft: "10px",
                    padding: "6px 16px",
                  },
                }}
                cancelButtonProps={{
                  style: {
                    backgroundColor: "red",
                    borderColor: "red",
                    color: "white",
                    padding: "6px 16px",
                  },
                }}
              >
                <Button loading={isDeleting}>
                  <DeleteOutlined className="text-red-400 text-[18px]" />
                </Button>
              </Popconfirm>
            </Tooltip>
            <Tooltip title="view">
              <Button onClick={() => handleView(record.id.toString())}>
                <FiEye size={18} />
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [editData, isDeleting]
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">

      <PmtGroupModal open={isModalOpen} handleClose={handleClose} update={update} />
      <div className="flex flex-col gap-4 mb-6">
    
        <Button
          type="primary"
          size="large"
          onClick={showModal}
          style={{ maxWidth: 80, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}
        >
          Create
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <GlobalTable
          loading={isFetching}
          data={tableData || []}
          columns={columns}
          handleChange={handleTableChange}
          pagination={{
            current: page,
            pageSize: size,
            total,
            showSizeChanger: true,
            pageSizeOptions: ["2", "10", "50", "100"],
          }}
          className="font-inter"
          rowClassName={(_: PaymentGroup) => {
            return "bg-white hover:bg-blue-50";
          }}
        />
      </div>
    </div>
  );
};

export default Index;