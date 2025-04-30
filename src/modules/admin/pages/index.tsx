import { useEffect, useState } from "react";
import { Button, Input, Popconfirm, Space, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { GlobalTable } from "@components";
import { AdminType } from "@types";
import { useGetAdmins, useGetRoles } from "../hooks/queries";
import AdminsModal from "./modal";
import { useDeleteAdmins } from "../hooks/mutations";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [update, setUpdate] = useState<AdminType | null>(null);
  const [tableData, setTableData] = useState<AdminType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [rolesL, setRolesL] = useState([]);
  const navigate = useNavigate();
  const { search } = useLocation();
  const { mutate } = useDeleteAdmins();

  const [tempSearchParams, setTempSearchParams] = useState({
    phone: "",
    firstName: "",
    lastName: "",
  });
  const [searchParams, setSearchParams] = useState({
    phone: "",
    firstName: "",
    lastName: "",
  });

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  });

  const { data: roles } = useGetRoles();
  useEffect(() => {
    if (roles) {
      setRolesL(roles?.data?.data?.content);
    }
  }, [roles]);

  const { data: admins } = useGetAdmins({
    size: params.size,
    page: params.page - 1,
    phone: searchParams.phone ? Number(searchParams.phone) : undefined,
    firstName: searchParams.firstName,
    lastName: searchParams.lastName,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(queryParams.get("page")) || 1;
    let size = Number(queryParams.get("size")) || 10;
    setParams({ size, page });
  }, [search]);

  useEffect(() => {
    if (admins?.data?.content) {
      setTableData(admins.data.content);
      setTotal(admins.data.paging.totalItems || 0);
    }
  }, [admins]);

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    setParams({ size: pageSize, page: current });
    navigate(`?page=${current}&size=${pageSize}`);
  };

  const handleSearch = () => {
    setSearchParams(tempSearchParams);
    navigate(
      `?page=1&size=${params.size}&phone=${tempSearchParams.phone}&firstName=${tempSearchParams.firstName}&lastName=${tempSearchParams.lastName}`
    );
  };

  const showModal = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate(null);
  };

  const editData = (item: AdminType) => {
    setUpdate(item);
    showModal();
  };

  const deleteData = async (id: number) => {
    mutate(id);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button onClick={() => editData(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="delete">
            <Popconfirm
              title="Are you sure you want to upload students?"
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
              <Button>
                <DeleteOutlined className='text-red-400 text-[18px]' />
              </Button>

            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AdminsModal open={isModalOpen} handleClose={handleClose} update={update} roles={rolesL} />
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between ">
          <Input
            placeholder="Search by phone"
            value={tempSearchParams.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearchParams({ ...tempSearchParams, phone: e.target.value })}
            className="w-[300px]"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}

          />

          <Input
            placeholder="Search by first name"
            value={tempSearchParams.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearchParams({ ...tempSearchParams, firstName: e.target.value })}
            className="w-[300px]"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}

          />

          <Input
            placeholder="Search by last name"
            value={tempSearchParams.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearchParams({ ...tempSearchParams, lastName: e.target.value })}
            className="w-[300px]"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}

          />

          <Button type="primary" size="large" onClick={handleSearch} style={{ maxWidth: 160, minWidth: 80, backgroundColor: "green", color: "white", height: 36 }}>Search</Button>
        </div>
        <Button type="primary" size="large" onClick={showModal} style={{ maxWidth: 80, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}>
          Create
        </Button>
      </div>
      <GlobalTable
        data={tableData}
        columns={columns}
        handleChange={handleTableChange}
        pagination={{
          current: params.page,
          pageSize: params.size,
          total: total || 0,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
      />
    </>
  );
};

export default Index;
