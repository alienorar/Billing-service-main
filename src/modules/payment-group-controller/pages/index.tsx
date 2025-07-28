"use client"

import { useEffect, useState, useMemo } from "react"
import { Button, Popconfirm, Space, Tooltip } from "antd"
import { DeleteOutlined, EditOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons"
import { useNavigate, useSearchParams } from "react-router-dom"
import type { TablePaginationConfig } from "antd"
import { GlobalTable } from "@components"
import type { PaymentGroup } from "@types"
import { useGetPmtGroupList } from "../hooks/queries"
import PmtGroupModal from "./modal"
import { useDeletePmtGroupList } from "../hooks/mutations"
import { FiEye } from "react-icons/fi"
import { openNotification } from "@utils"

const Index = () => {
  const [tableData, setTableData] = useState<PaymentGroup[]>([])
  const [total, setTotal] = useState<number>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [update, setUpdate] = useState<PaymentGroup | null>(null)
  const { mutate: deletePmtGroup, isPending: isDeleting } = useDeletePmtGroupList()

  const navigate = useNavigate()

  const page = Number(searchParams.get("page")) || 1
  const size = Number(searchParams.get("size")) || 10

  const { data: pmGroupList, isFetching } = useGetPmtGroupList({
    size,
    page: page - 1,
  })

  useEffect(() => {
    if (pmGroupList?.data?.content) {
      setTableData(pmGroupList.data.content)
      setTotal(pmGroupList.data.paging?.totalItems || 0)
    } else {
      setTableData([])
      setTotal(0)
    }
  }, [pmGroupList])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 10 } = pagination
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
    })
  }

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    setUpdate(null)
  }

  const editData = (item: PaymentGroup) => {
    setUpdate(item)
    showModal()
  }

  const deleteData = (id: number) => {
    if (id == null) {
      openNotification("error", "Error", "Invalid payment group ID")
      return
    }
    deletePmtGroup(id)
  }

  const handleView = (id: number | undefined) => {
    navigate(`/super-admin-panel/pmgroup-controller/${id}`)
  }

  const columns = useMemo(
    () => [
      {
        title: <span className="font-semibold text-gray-700">ID</span>,
        dataIndex: "id",
        key: "id",
        width: 80,
        align: "center" as const,
        render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Nomi</span>,
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Muddati</span>,
        dataIndex: "duration",
        key: "duration",
        width: 120,
        align: "center" as const,
        render: (text: any) => <span className="text-gray-700">{text} yil</span>,
      },
      {
        title: <span className="font-semibold text-gray-700">Kontrakt miqdori</span>,
        dataIndex: "contractAmounts",
        key: "contractAmounts",
        render: (contractAmounts: Record<string, number> = {}) => (
          <div className="flex flex-wrap gap-2">
            {Object.entries(contractAmounts).map(([year, amount]) => (
              <span
                key={year}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
              >
                Yil {year}: {amount.toLocaleString()} UZS
              </span>
            ))}
          </div>
        ),
      },
      {
        title: <span className="font-semibold text-gray-700">Amallar</span>,
        key: "action",
        render: (_: any, record: any) => (
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
                title="Bu guruhni o'chirishga ishonchingiz komilmi?"
                onConfirm={() => deleteData(record.id)}
                okText="Ha"
                cancelText="Yo'q"
                okButtonProps={{
                  className: "bg-green-500 hover:bg-green-600 border-green-500",
                }}
                cancelButtonProps={{
                  className: "bg-red-500 hover:bg-red-600 border-red-500 text-white",
                }}
              >
                <Button
                  loading={isDeleting}
                  className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-200 rounded-lg"
                  size="small"
                >
                  <DeleteOutlined />
                </Button>
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Ko'rish">
              <Button
                onClick={() => handleView(record.id.toString())}
                className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:border-green-300 transition-all duration-200 rounded-lg"
                size="small"
              >
                <FiEye size={16} />
              </Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [isDeleting],
  )

  return (
    <div className="space-y-6">
      <PmtGroupModal open={isModalOpen} handleClose={handleClose} update={update} />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">To'lov guruhlari</h1>
              <p className="text-gray-600 mt-1">To'lov guruhlarini boshqarish va sozlash</p>
            </div>
          </div>

          <Button
            type="primary"
            size="large"
            onClick={showModal}
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 px-4"
            icon={<PlusOutlined />}
          >
            Yangi guruh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
            pageSizeOptions: ["10", "20", "50", "100"],
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          rowClassName={(_: PaymentGroup) => "hover:bg-blue-50 transition-colors duration-200"}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default Index
