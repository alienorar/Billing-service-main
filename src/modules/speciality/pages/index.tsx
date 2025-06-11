import { useEffect, useState } from "react";
import { Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalTable } from "@components";
import { useGetSpeciality } from "../hooks/queries";
import { useBlockSpeciality, useUnblockSpeciality } from "../hooks/mutations";
import { AnyObject } from "antd/es/_util/type";

const Index = () => {
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const navigate = useNavigate();
  const { search } = useLocation();
  const blockSpeciality = useBlockSpeciality();
  const unblockSpeciality = useUnblockSpeciality();

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  });

  const { data: speciality, isFetching: isGetingSpeciality } = useGetSpeciality({
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

  const handleTableChange = (pagination: AnyObject) => {
    const { current, pageSize } = pagination;
    setParams({ size: pageSize, page: current });
    navigate(`?page=${current}&size=${pageSize}`);
  };

  const handleToggleVisibility = (id: number | string, isVisible: boolean) => {
    if (isVisible) {
      blockSpeciality.mutate(id);
    } else {
      unblockSpeciality.mutate(id);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Speciality Code", dataIndex: "code" },
    { title: "Speciality Name", dataIndex: "name", width: 340 },
    { title: "Education Type", dataIndex: "educationType" },
    {
      title: "Visible",
      dataIndex: "isVisible",
      sorter: false,
      render: (visible: boolean, record: any) => (
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
  ];

  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <GlobalTable
        loading={isGetingSpeciality}
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
    </div>
  );
};

export default Index;