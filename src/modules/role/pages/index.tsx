"use client"

import { useEffect, useState } from "react"
import { Button, Space, Tooltip } from "antd"
import { EditOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { GlobalTable } from "@components"
import type { RoleType } from "@types"
import { useGetPermessionTree, useGetRoleById, useGetRoles } from "../hooks/queries"
import RolesModal from "./modal"
import { useQueryClient } from "@tanstack/react-query"
import { getRoleById } from "../service"

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<RoleType | undefined>(undefined)
  const [tableData, setTableData] = useState<RoleType[]>([])
  const [total, setTotal] = useState<number>(0)
  const navigate = useNavigate()
  const { search } = useLocation()
  const [selectedPermL, setSelectedPermL] = useState([])
  const [roleId, setRoleId] = useState<number | string | undefined>()
  const { data: permessionTree } = useGetPermessionTree()
  const queryClient = useQueryClient()

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  })

  const { data: roles, isFetching: isGetingRoles } = useGetRoles({
    size: params.size,
    page: params.page - 1,
  })

  useEffect(() => {
    const queryParams = new URLSearchParams(search)
    const page = Number(queryParams.get("page")) || 1
    const size = Number(queryParams.get("size")) || 10
    setParams({ size, page })
  }, [search])

  useEffect(() => {
    if (roles?.data.content) {
      setTableData(roles.data.content)
      setTotal(roles.data.paging.totalItems || 0)
    }
  }, [roles])

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setParams({ size: pageSize, page: current })
    navigate(`?page=${current}&size=${pageSize}`)
  }

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(undefined)
  }

  useEffect(() => {
    if (permessionTree) {
      setSelectedPermL(permessionTree)
    }
  }, [permessionTree])

  const { data: updateData } = useGetRoleById(roleId || "")

  useEffect(() => {
    if (updateData?.data) {
      setUpdate(updateData.data)
    }
  }, [updateData])

  const editData = async (item: number | string | undefined) => {
    setRoleId(item)
    await queryClient.prefetchQuery({
      queryKey: ["role", item],
      queryFn: () => getRoleById(item || ""),
    })
    showModal()
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Rol nomi</span>,
      dataIndex: "name",
      render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ko'rinib turuvchi nomi</span>,
      dataIndex: "displayName",
      render: (text: any) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Default URL</span>,
      dataIndex: "defaultUrl",
      render: (text: any) => <span className="text-blue-600 font-mono text-sm">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Action</span>,
      key: "action",
      render: (record: any) => (
        <Space size="small">
          <Tooltip title="Tahrirlash">
            <Button
              onClick={() => editData(record.id)}
              className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
              size="small"
            >
              <EditOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <RolesModal
        open={isModalOpen}
        handleClose={handleClose}
        update={update}
        permessionL={selectedPermL}
        selectedPermL={selectedPermL}
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <SettingOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Rollar boshqaruvi</h1>
              <p className="text-gray-600 mt-1">Tizim rollarini boshqaring va ruxsatlarni sozlang</p>
            </div>
          </div>

          <Button
            type="primary"
            onClick={showModal}
            className="h-12 px-6 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<PlusOutlined />}
          >
            Yangi rol qo'shish
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <GlobalTable
          loading={isGetingRoles}
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
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default Index
