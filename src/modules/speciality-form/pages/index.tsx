"use client"

import { useParams } from "react-router-dom"
import { Spin, Table, Switch, Tag } from "antd"
import { CheckOutlined, CloseOutlined, BookOutlined } from "@ant-design/icons"
import { useBlockSpeciality, useUnblockSpeciality } from "../../speciality/hooks/mutations"
import { useGetSpecialityForm } from "../hooks/queries"
// import { useBlockSpeciality, useUnblockSpeciality } from "../hooks/mutations"

// Define types based on API response
interface Speciality {
  id: number
  specialityId: number
  code: string
  name: string
  educationType: string
  educationForm: string
  active: boolean
}




// // ============ GET SPECIALITY FORM HOOK ===========
// export function useGetSpecialityForm(params: ParamsType) {
//   return useQuery<ApiResponse, Error>({
//     queryKey: ["speciality-form", params],
//     queryFn: () => getSpecialityForm(params),
//   })
// }

const Index = () => {
  const { id } = useParams<{ id: string }>() // Explicitly type id as string
  const blockSpeciality = useBlockSpeciality()
  const unblockSpeciality = useUnblockSpeciality()

  // Fetch speciality data using the hook
  const { data, isLoading, isError, error } = useGetSpecialityForm({ specialityId:id })

  // Extract content data from response
  const tableData: Speciality[] = data?.data?.content || []

  // Handle toggle visibility (active/inactive)
  const handleToggleVisibility = (specialityId: number, isActive: boolean) => {
    if (isActive) {
      blockSpeciality.mutate(specialityId)
    } else {
      unblockSpeciality.mutate(specialityId)
    }
  }

  // Define table columns
  const columns: import("antd").TableProps<Speciality>["columns"] = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      key: "id",
      render: (text: number) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Speciality ID</span>,
      dataIndex: "specialityId",
      key: "specialityId",
      render: (text: number) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik kodi</span>,
      dataIndex: "code",
      key: "code",
      render: (text: string) => (
        <Tag color="blue" className="font-mono text-sm px-2 py-1 rounded">
          {text}
        </Tag>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik nomi</span>,
      dataIndex: "name",
      key: "name",
      width: 340,
      render: (text: string) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim turi</span>,
      dataIndex: "educationType",
      key: "educationType",
      render: (text: string) => (
        <Tag color={text === "BAKALAVR" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
      dataIndex: "educationForm",
      key: "educationForm",
      render: (text: string) => (
        <Tag color={text === "KECHKI" ? "purple" : "blue"}>{text}</Tag>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Holat</span>,
      dataIndex: "active",
      key: "active",
      render: (visible: boolean, record: Speciality) => (
        <Switch
          checked={visible}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggleVisibility(record.specialityId, visible)}
          className={visible ? "bg-green-500" : "bg-gray-400"}
        />
      ),
    },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading speciality details..." />
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">Error: {error?.message || "Failed to load speciality details"}</div>
      </div>
    )
  }

  // No data state
  if (!tableData.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-600">No speciality data found</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <BookOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mutaxasislik tafsilotlari</h1>
            <p className="text-gray-600 mt-1">Mutaxasislik ma'lumotlarini ko'ring va boshqaring</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <Table
          dataSource={tableData}
          columns={columns}
          rowKey="id"
          pagination={false}
          className="rounded-2xl"
          scroll={{ x: true }}
        />
      </div>
    </div>
  )
}

export default Index