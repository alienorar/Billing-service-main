"use client"

import { useEffect, useState } from "react"
import { Switch, Tag } from "antd" // Added Tag for better display of forms
import { CheckOutlined, CloseOutlined, BookOutlined } from "@ant-design/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { GlobalTable } from "@components"
import { useGetSpeciality } from "../hooks/queries"
import { useBlockSpeciality, useUnblockSpeciality } from "../hooks/mutations"
import type { AnyObject } from "antd/es/_util/type"

const Index = () => {
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()
  const { search } = useLocation()
  const blockSpeciality = useBlockSpeciality()
  const unblockSpeciality = useUnblockSpeciality()

  const [params, setParams] = useState({
    size: 10,
    page: 1,
  })

  const { data: speciality, isFetching: isGetingSpeciality } = useGetSpeciality({
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
    if (speciality?.data?.data?.content) {
      setTableData(speciality?.data?.data?.content)
      setTotal(speciality?.data?.data?.paging?.totalItems)
    }
  }, [speciality])

  const handleTableChange = (pagination: AnyObject) => {
    const { current, pageSize } = pagination
    setParams({ size: pageSize, page: current })
    navigate(`?page=${current}&size=${pageSize}`)
  }

  const handleToggleVisibility = (id: number | string, isVisible: boolean) => {
    if (isVisible) {
      blockSpeciality.mutate(id)
    } else {
      unblockSpeciality.mutate(id)
    }
  }

  const handleRowClick = (id: string) => {
    navigate(`/super-admin-panel/speciality/${id}`)
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      render: (text: any) => <span className="font-medium text-gray-600">#{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik kodi</span>,
      dataIndex: "code",
      render: (text: any) => (
        <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">{text}</span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik nomi</span>,
      dataIndex: "name",
      width: 340,
      render: (text: any) => <span className="font-medium text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
      dataIndex: "educationType",
      render: (text: any) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim turlari</span>,
      dataIndex: "specialityFormList",
      render: (specialityFormList: any[]) => (
        <div className="flex gap-2">
          {specialityFormList?.map((form) => (
            <Tag
              key={form.id}
              color={
                form.educationForm === "KUNDUZGI"
                  ? "blue"
                  : form.educationForm === "SIRTQI"
                  ? "green"
                  : "orange"
              }
              className="font-medium"
            >
              {form.educationForm}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Holat</span>,
      dataIndex: "active",
      render: (visible: boolean, record: any) => (
        <Switch
          checked={visible}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={() => handleToggleVisibility(record.id, visible)}
          className={visible ? "bg-green-500" : "bg-gray-400"}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <BookOutlined className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mutaxasisliklar boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Mutaxasisliklar ro'yxati va holatini boshqaring</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          onRow={(record: AnyObject) => ({
            onClick: () => handleRowClick(record.id.toString()),
            className: "cursor-pointer",
          })}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default Index