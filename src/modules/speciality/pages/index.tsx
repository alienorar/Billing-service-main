import { useEffect, useState } from "react";
import { Button,  Space, Tooltip, Switch } from "antd";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetSpeciality } from "../hooks/queries";
import { useBlockSpeciality, useUnblockSpeciality } from "../hooks/mutations";
import SpecialityDrawer from "./modal";
import { AnyObject } from "antd/es/_util/type";

const Index = () => {
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState(null);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const { search } = useLocation();
  const blockSpeciality = useBlockSpeciality();
  const unblockSpeciality = useUnblockSpeciality();

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  });

  const { data: speciality } = useGetSpeciality({
    size: params.size,
    page: params.page - 1,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(search);
    let page = Number(queryParams.get("page")) || 1;
    let size = Number(queryParams.get("size")) || 10;
    setParams({ size, page });
  }, [search]);

  useEffect(() => {
    if (speciality?.data?.data?.content) {
      setTableData(speciality?.data?.data?.content);
      setTotal(speciality?.data?.data?.paging?.totalItems);
    }
  }, [speciality]);

  const openModal = (record = null) => {
    setUpdateData(record);
    setIsModalOpen(true);
  };

  const handleTableChange = (pagination:AnyObject) => {
    const { current, pageSize } = pagination;
    setParams({ size: pageSize, page: current });
    navigate(`?page=${current}&size=${pageSize}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUpdateData(null);
  };

  const handleToggleVisibility = (id:number|string, isVisible:boolean) => {
    if (isVisible) {
      blockSpeciality.mutate(id);
    } else {
      unblockSpeciality.mutate(id);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Speciality Code", dataIndex: "specialityCode" },
    { title: "Speciality Name", dataIndex: "specialityName",width:340 },
    { title: "Contract Cost", dataIndex: "contractCost", render: (cost:string|number) => cost || "N/A" },
    { title: "Contract Cost (In Letters)", dataIndex: "contractCostInLetters", render: (costInLetters:string) => costInLetters || "N/A" },
    { title: "Duration", dataIndex: "duration", render: (duration:string|number) => duration || "N/A" },
    { title: "Education Form", dataIndex: "educationForm" },
    { title: "Education Type", dataIndex: "educationType" },
    { title: "Education Language", dataIndex: "educationLang" },
    {
      title: "Visible",
      dataIndex: "isVisible",
      sorter:false,
      render: (visible:boolean, record:any) => (
        <Switch
          checked={visible}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggleVisibility(record.id, visible)}
          style={{
            backgroundColor: visible ? "#050556" : "#ababab",
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record:any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button onClick={() => openModal(record)}>
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <>
      <SpecialityDrawer open={isModalOpen} handleClose={closeModal} update={updateData} />
      <div className="flex flex-col gap-4 px-5 py-4 ">
        <Button type="primary" size="large" onClick={() => openModal()} style={{ maxWidth: 80, minWidth: 80, backgroundColor: "#050556", color: "white", height: 40 }}>
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