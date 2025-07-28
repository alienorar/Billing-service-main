"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button, Input, Popconfirm, Space, Tooltip, Card } from "antd"
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { GlobalTable } from "@components"
import type { AdminType } from "@types"
import { useGetAdmins, useGetRoles } from "../hooks/queries"
import AdminsModal from "./modal"
import { useDeleteAdmins } from "../hooks/mutations"

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<AdminType | null>(null)
  const [tableData, setTableData] = useState<AdminType[]>([])
  const [total, setTotal] = useState<number>(0)
  const [rolesL, setRolesL] = useState([])
  const navigate = useNavigate()
  const { search } = useLocation()
  const { mutate } = useDeleteAdmins()

  const [tempSearchParams, setTempSearchParams] = useState({
    phone: "",
    firstName: "",
    lastName: "",
  })
  const [searchParams, setSearchParams] = useState({
    phone: "",
    firstName: "",
    lastName: "",
  })

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  })

  const { data: roles } = useGetRoles()
  useEffect(() => {
    if (roles) {
      setRolesL(roles?.data?.data?.content)
    }
  }, [roles])

  const { data: admins, isFetching: isGettingAdmins } = useGetAdmins({
    size: params.size,
    page: params.page - 1,
    phone: searchParams.phone ? Number(searchParams.phone) : undefined,
    firstName: searchParams.firstName,
    lastName: searchParams.lastName,
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(search)
    const page = Number(queryParams.get("page")) || 1
    const size = Number(queryParams.get("size")) || 10
    setParams({ size, page })
  }, [search])

  useEffect(() => {
    if (admins?.data?.content) {
      setTableData(admins.data.content)
      setTotal(admins.data.paging.totalItems || 0)
    }
  }, [admins])

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setParams({ size: pageSize, page: current })
    navigate(`?page=${current}&size=${pageSize}`)
  }

  const handleSearch = () => {
    setSearchParams(tempSearchParams)
    navigate(
      `?page=1&size=${params.size}&phone=${tempSearchParams.phone}&firstName=${tempSearchParams.firstName}&lastName=${tempSearchParams.lastName}`,
    )
  }

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }

  const editData = (item: AdminType) => {
    setUpdate(item)
    showModal()
  }

  const deleteData = async (id: number) => {
    mutate(id)
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      render: (text: any) => <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Foydalanuvchi nomi</span>,
      dataIndex: "username",
      render: (text: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full flex items-center justify-center">
            <UserOutlined className="text-white text-xs" />
          </div>
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Telefon</span>,
      dataIndex: "phone",
      render: (text: any) => (
        <span className="text-violet-600 font-medium bg-violet-50 px-3 py-1 rounded-lg">{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Ismi</span>,
      dataIndex: "firstName",
      render: (text: any) => <span className="text-gray-800 font-medium">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Familiya</span>,
      dataIndex: "lastName",
      render: (text: any) => <span className="text-gray-800 font-medium">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Amallar</span>,
      key: "action",
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button
              onClick={() => editData(record)}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 rounded-lg"
              size="small"
            >
              <EditOutlined />
            </Button>
          </Tooltip>

          <Tooltip title="O'chirish">
            <Popconfirm
              title="Bu adminni o'chirishga ishonchingiz komilmi?"
              onConfirm={() => deleteData(record.id)}
              okText="Ha"
              cancelText="Yo'q"
              okButtonProps={{
                className: "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 rounded-lg",
              }}
              cancelButtonProps={{
                className: "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-lg",
              }}
            >
              <Button
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 rounded-lg"
                size="small"
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminsModal open={isModalOpen} handleClose={handleClose} update={update} roles={rolesL} />

      {/* Header Card */}
      <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden" bodyStyle={{ padding: "32px" }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <TeamOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Adminlar boshqaruvi</h1>
            <p className="text-gray-600">Tizim adminlarini boshqaring va yangi adminlar qo'shing</p>
          </div>
        </div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Tel raqam orqali qidirish"
            value={tempSearchParams.phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTempSearchParams({ ...tempSearchParams, phone: e.target.value })
            }
            className="h-11 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <Input
            placeholder="Ism orqali qidirish"
            value={tempSearchParams.firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTempSearchParams({ ...tempSearchParams, firstName: e.target.value })
            }
            className="h-11 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <Input
            placeholder="Familiya orqali qidirish"
            value={tempSearchParams.lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTempSearchParams({ ...tempSearchParams, lastName: e.target.value })
            }
            className="h-11 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <Button
            type="primary"
            onClick={handleSearch}
            className="h-11 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<SearchOutlined />}
          >
            Qidirish
          </Button>
        </div>

        {/* Create Button */}
        <Button
          type="primary"
          onClick={showModal}
          className="h-12 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          icon={<PlusOutlined />}
        >
          Yangi admin qo'shish
        </Button>
      </Card>

      {/* Table Card */}
      <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden" bodyStyle={{ padding: "0" }}>
        <GlobalTable
          loading={isGettingAdmins}
          data={tableData}
          columns={columns}
          handleChange={handleTableChange}
          pagination={{
            current: params.page,
            pageSize: params.size,
            total: total || 0,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span className="text-gray-600 font-medium">
                {range[0]}-{range[1]} dan {total} ta natija
              </span>
            ),
          }}
          className="rounded-2xl"
        />
      </Card>
    </div>
  )
}

export default Index
