/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, Input, Space, Tooltip, Popconfirm, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components";
import { AdminType } from "@types";
import { FiEye } from "react-icons/fi";
import UploadStudentDataModal from "./modal";
import { useGetStudents, useSyncGetStudents } from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { syncStudent } from "../service";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState<AdminType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const phone = searchParams.get("phone") || "";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";

  // Fetch students data
  const { data: students } = useGetStudents({
    size,
    page: page - 1,
    phone: phone ? Number(phone) : undefined,
    firstName,
    lastName,
  });

  // Sync students data (disabled by default)
  const { data: syncData, isFetching: isSyncing } = useSyncGetStudents({
    enabled: false, // Prevent automatic fetching
  });

  useEffect(() => {
    if (students?.data?.content) {
      setTableData(students.data.content);
      setTotal(students.data.paging.totalItems || 0);
    }
  }, [students]);

  useEffect(() => {
    if (syncData?.data) {
      setTableData(syncData.data.content || []);
      setTotal(syncData.data.paging?.totalItems || 0);
    }
  }, [syncData]);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      phone,
      firstName,
      lastName,
    });
  };

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      phone,
      firstName,
      lastName,
    });
  };

  const handleView = (id: number | undefined) => {
    navigate(`/super-admin-panel/students/${id}`);
  };

  const showModal = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleSync = async () => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["students"],
        queryFn: () => syncStudent(), 
      });
      message.success("Students synced successfully!");
      if (data?.data) {
        setTableData(data.data.content || []);
        setTotal(data.data.paging?.totalItems || 0);
      }
    } catch (error) {
      message.error("Failed to sync students");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Student ID",
      dataIndex: "studentIdNumber",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button onClick={() => handleView(record.id.toString())}>
              <FiEye size={18} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Search by phone"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone: e.target.value,
                firstName,
                lastName,
              })
            }
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            className="w-[300px]"
          />
          <Input
            placeholder="Search by first name"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName: e.target.value,
                lastName,
              })
            }
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            className="w-[300px]"
          />
          <Input
            placeholder="Search by last name"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName: e.target.value,
              })
            }
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            className="w-[300px]"
          />
          <Button
            type="primary"
            size="large"
            style={{ maxWidth: 160, minWidth: 80, backgroundColor: "green", color: "white", height: 36 }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <div>
          <Popconfirm
            title="Are you sure you want to upload students?"
            onConfirm={showModal}
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
              style: { backgroundColor: "red", borderColor: "red", color: "white", padding: "6px 16px" },
            }}
          >
            <Button
              type="primary"
              size="large"
              style={{ maxWidth: 80, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}
              className="text-[16px] mx-4"
            >
              Sync Exel
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            size="large"
            style={{ maxWidth: 80, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}
            className="text-[16px]"
            onClick={handleSync}
            loading={isSyncing}
          >
            Sync Hemis
          </Button>
        </div>
      </div>

      <GlobalTable
        loading={isSyncing}
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
        onRow={(record) => ({
          onClick: () => handleView(record.id),
        })}
      />

      <UploadStudentDataModal open={isModalOpen} onClose={handleClose} />
    </>
  );
};

export default Index;