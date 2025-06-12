import { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Space, TablePaginationConfig, Tag, Tooltip } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GlobalTable } from "@components"; // Assuming this is your custom Table component
import { useGetStudentById } from "../hooks/queries";
import { GroupListUpdate } from "@types";
import { EditOutlined } from "@ant-design/icons";
import GroupModal from "./modal";

// Define the interface for group data
interface GroupRecord {
  id: number;
  hemisId: number;
  name: string;
  educationLang: string;
  educationForm: string;
  educationType: string;
  curriculum: number;
  active: boolean;
  specialityFormId: number;
  paymentGroupId: number | null;
  level: number | null;
}

// Define the interface for query parameters
interface QueryParams {
  page: number;
  size: number;
  name?: string;
  educationLang?: string;
  educationForm?: string;
  active?: string;
}

// Define the interface for the API response
interface GroupResponse {
  data: {
    content: GroupRecord[];
    paging: {
      totalItems: number;
    };
  };
}


const filterEmpty = (obj: Record<string, string | undefined>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== "" && v !== undefined)
  ) as Record<string, string>;


const GroupList: React.FC = () => {
  /* ---------- URL params ---------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [update, setUpdate] = useState<GroupListUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const page = Number(searchParams.get("page") ?? 1);
  const size = Number(searchParams.get("size") ?? 10);
  const name = searchParams.get("name") ?? "";
  const educationLang = searchParams.get("educationLang") ?? "";
  const educationForm = searchParams.get("educationForm") ?? "";
  const active = searchParams.get("active") ?? "";

  /* ---------- Data ---------- */
  const { data: groupData, isFetching } = useGetStudentById({
    page: page - 1,
    size,
    name: name || undefined,
    educationLang: educationLang || undefined,
    educationForm: educationForm || undefined,
    active: active || undefined,
  } as QueryParams);

  const [tableData, setTableData] = useState<GroupRecord[]>([]);
  const [total, setTotal] = useState<number>(0);

  /* ---------- Effects ---------- */
  useEffect(() => {
    if (groupData?.data?.content) {
      const normalized: GroupRecord[] = groupData.data.content.map(
        (item: GroupRecord) => ({
          id: item.id,
          hemisId: item.hemisId,
          name: item.name,
          educationLang: item.educationLang,
          educationForm: item.educationForm,
          educationType: item.educationType,
          curriculum: item.curriculum,
          active: item.active,
          specialityFormId: item.specialityFormId,
          paymentGroupId: item.paymentGroupId,
          level: item.level,
        })
      );
      setTableData(normalized);
      setTotal(groupData.data.paging.totalItems ?? 0);
    }
  }, [groupData]);

  /* ---------- Helpers ---------- */
  const updateParams = (changed: Record<string, string | undefined>): void => {
    const merged: Record<string, string | undefined> = {
      ...Object.fromEntries(searchParams.entries()),
      ...changed,
    };
    if (!("page" in changed)) merged.page = "1";
    if (!("size" in merged)) merged.size = size.toString();
    setSearchParams(filterEmpty(merged));
  };

  const handleTableChange = (pagination: TablePaginationConfig): void => {
    const { current = 1, pageSize = 10 } = pagination;
    updateParams({
      page: current.toString(),
      size: pageSize.toString(),
    });
  };


  // Modal handlers
  const showModal = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    setUpdate(null);
  };

  // Edit handler
  const editData = (item: GroupListUpdate) => {
    setUpdate(item);
    showModal();
  };




  /* ---------- Columns ---------- */
  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        sorter: (a: GroupRecord, b: GroupRecord) => a.id - b.id,
      },
      {
        title: "Hemis ID",
        dataIndex: "hemisId",
        key: "hemisId",
        sorter: (a: GroupRecord, b: GroupRecord) => a.hemisId - b.hemisId,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a: GroupRecord, b: GroupRecord) => a.name.localeCompare(b.name),
      },
      {
        title: "Education Language",
        dataIndex: "educationLang",
        key: "educationLang",
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationLang.localeCompare(b.educationLang),
      },
      {
        title: "Education Form",
        dataIndex: "educationForm",
        key: "educationForm",
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationForm.localeCompare(b.educationForm),
      },
      {
        title: "Education Type",
        dataIndex: "educationType",
        key: "educationType",
        sorter: (a: GroupRecord, b: GroupRecord) => a.educationType.localeCompare(b.educationType),
      },
      {
        title: "Curriculum",
        dataIndex: "curriculum",
        key: "curriculum",
        sorter: (a: GroupRecord, b: GroupRecord) => a.curriculum - b.curriculum,
      },
      {
        title: "Active",
        dataIndex: "active",
        key: "active",
        render: (active: boolean) => (
          <Tag color={active ? "green" : "red"}>{active ? "Active" : "Inactive"}</Tag>
        ),
        sorter: (a: GroupRecord, b: GroupRecord) => Number(a.active) - Number(b.active),
      },
      {
        title: "Speciality Form ID",
        dataIndex: "specialityFormId",
        key: "specialityFormId",
        sorter: (a: GroupRecord, b: GroupRecord) => a.specialityFormId - b.specialityFormId,
      },
      {
        title: "Payment Group ID",
        dataIndex: "paymentGroupId",
        key: "paymentGroupId",
        render: (value: number | null) => (value ? value : "N/A"),
        sorter: (a: GroupRecord, b: GroupRecord) => (a.paymentGroupId || 0) - (b.paymentGroupId || 0),
      },
      {
        title: "Level",
        dataIndex: "level",
        key: "level",
        render: (value: number | null) => (value ? value : "N/A"),
        sorter: (a: GroupRecord, b: GroupRecord) => (a.level || 0) - (b.level || 0),
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
          </Space>
        ),
      },
    ],
    [navigate]
  );

  /* ---------- Options ---------- */
  const educationLangOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "UZB", label: "Uzbek" },
  ];

  const educationFormOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "SIRTQI", label: "Sirtqi" },
  ];

  const activeOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  /* ---------- Render ---------- */
  return (
    <>
      <GroupModal
        open={isModalOpen}
        handleClose={handleClose}
        update={update} />
      <div className="flex flex-col gap-4 px-5 py-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-end">
          <Input
            placeholder="Group Name"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateParams({ name: e.target.value })}
          />
          <Select
            allowClear
            placeholder="Education Language"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={educationLangOptions}
            value={educationLang || undefined}
            onChange={(value: string | undefined) => updateParams({ educationLang: value || undefined })}
          />
          <Select
            allowClear
            placeholder="Education Form"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={educationFormOptions}
            value={educationForm || undefined}
            onChange={(value: string | undefined) => updateParams({ educationForm: value || undefined })}
          />
          <Select
            allowClear
            placeholder="Active Status"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            options={activeOptions}
            value={active || undefined}
            onChange={(value: string | undefined) => updateParams({ active: value || undefined })}
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
            total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
        />
      </div>
    </>

  );
};

export default GroupList;