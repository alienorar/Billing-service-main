"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button, Input, Space, Tooltip, Popconfirm, message, Select } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import type { AdminType } from "@types"
import { FiEye, FiDownload, FiUpload, FiRefreshCw, FiSearch, FiUsers } from "react-icons/fi"
import UploadStudentDataModal from "./modal"
import { useGetStudents, useSyncGetStudents } from "../hooks/queries"
import { useExportStudentList } from "../hooks/mutations"
import { useQueryClient } from "@tanstack/react-query"
import { syncStudent } from "../service"

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tableData, setTableData] = useState<AdminType[]>([])
  const [total, setTotal] = useState<number>(0)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1
  const size = Number(searchParams.get("size")) || 10
  const phone = searchParams.get("phone") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const educationForm = searchParams.get("educationForm") || ""
  const educationType = searchParams.get("educationType") || ""
  const showDebt = searchParams.get("showDebt") || ""
  const pinfl = searchParams.get("pinfl") ?? ""
  const passport = searchParams.get("passport") ?? ""

  const [isInDebt, setIsInDebt] = useState<boolean>(false)
  useEffect(() => {
    const showDebt = searchParams.get("showDebt") === "true"
    setIsInDebt(showDebt)
  }, [searchParams])

  const educationFormOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "SIRTQI", label: "Sirtqi" },
    { value: "KUNDUZGI", label: "Kunduzgi" },
    { value: "KECHKI", label: "Kechki" },
    { value: "MASOFAVIY", label: "Masofaviy" },
  ]

  const educationTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "Barchasi" },
    { value: "BAKALAVR", label: "Bakalavr" },
    { value: "MAGISTR", label: "Magistr" },
  ]

  const { data: students } = useGetStudents({
    size,
    page: page - 1,
    phone: phone ? Number(phone) : undefined,
    firstName,
    lastName,
    educationForm,
    showDebt,
    educationType,
    pinfl: pinfl || undefined,
    passport,
  })

  const { data: syncData, isFetching: isSyncing } = useSyncGetStudents({
    enabled: false,
  })

  const exportStudentsMutation = useExportStudentList()

  useEffect(() => {
    if (students?.data?.content) {
      setTableData(students.data.content)
      setTotal(students.data.paging.totalItems || 0)
    }
  }, [students])

  useEffect(() => {
    if (syncData?.data) {
      setTableData(syncData.data.content || [])
      setTotal(syncData.data.paging?.totalItems || 0)
    }
  }, [syncData])

  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      phone,
      firstName,
      lastName,
      educationForm,
      educationType,
      showDebt,
      pinfl,
      passport,
    })
  }

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      phone,
      firstName,
      lastName,
      educationForm,
      educationType,
      showDebt,
      pinfl,
      passport,
    })
  }

  const handleView = (id: number | undefined) => {
    navigate(`/super-admin-panel/students/${id}`)
  }

  const showModal = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  const handleSync = async () => {
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["students"],
        queryFn: () => syncStudent(),
      })
      message.success("Students synced successfully!")
      if (data?.data) {
        setTableData(data.data.content || [])
        setTotal(data.data.paging?.totalItems || 0)
      }
    } catch (error) {
      message.error("Failed to sync students")
    }
  }

  const handleExportStudents = () => {
    const exportParams = {
      phone: phone ? Number(phone) : undefined,
      firstName,
      lastName,
      educationForm,
      educationType,
      showDebt,
      pinfl,
      passport,
    }

    const cleanParams = Object.fromEntries(
      Object.entries(exportParams).filter(([_, value]) => value !== undefined && value !== ""),
    )

    exportStudentsMutation.mutate(cleanParams)
  }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "id",
      render: (value: any) => <span className="font-medium text-gray-600">#{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">To'liq ism</span>,
      dataIndex: "fullName",
      render: (value: any) => <span className="font-medium text-gray-800">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Kursi</span>,
      dataIndex: "level",
      render: (value: any) => <span className="font-medium text-gray-800">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Student statusi</span>,
      dataIndex: "studentStatus",
      render: (value: any) => <span className="font-medium text-green-800">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">PINFL</span>,
      dataIndex: "pinfl",
      render: (value: any) => <span className="font-mono text-sm text-gray-600">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Telefon</span>,
      dataIndex: "phone",
      render: (value: any) => <span className="text-blue-600 font-medium">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli/turi</span>,
      key: "education",
      render: (_: any, record: any) => {
        const type = record?.educationType
          ? record.educationType.charAt(0).toUpperCase() + record.educationType.slice(1).toLowerCase()
          : "-"
        const form = record?.educationForm
          ? record.educationForm.charAt(0).toUpperCase() + record.educationForm.slice(1).toLowerCase()
          : "-"

        const typeColor =
          type === "Bakalavr"
            ? "text-emerald-600 bg-emerald-50"
            : type === "Magistr"
              ? "text-orange-600 bg-orange-50"
              : "text-gray-500 bg-gray-50"

        const formColor =
          form === "Kunduzgi"
            ? "text-blue-600 bg-blue-50"
            : form === "Sirtqi"
              ? "text-purple-600 bg-purple-50"
              : "text-gray-500 bg-gray-50"

        return (
          <div className="flex flex-col gap-1">
            <span className={`${typeColor} px-2 py-1 rounded-lg text-xs font-semibold`}>{type}</span>
            <span className={`${formColor} px-2 py-1 rounded-lg text-xs font-semibold`}>{form}</span>
          </div>
        )
      },
    },
    {
      title: <span className="font-semibold text-gray-700">Guruh</span>,
      dataIndex: "group",
      render: (value: any) => <span className="text-gray-800">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik</span>,
      dataIndex: "speciality",
      render: (value: any) => <span className="text-gray-800 text-sm">{value ?? "-"}</span>,
    },
    ...(isInDebt
      ? [
        {
          title: <span className="font-semibold text-gray-700">Qarzdorligi</span>,
          key: "studentDebtAmount",
          render: (_: any, record: any) => {
            const amount = record.paymentDetails?.studentDebtAmount ?? 0
            return (
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold ${amount < 0
                  ? "text-red-600 bg-red-50"
                  : amount > 0
                    ? "text-green-600 bg-green-50"
                    : "text-gray-500 bg-gray-50"
                  }`}
              >
                {amount !== 0 ? amount.toLocaleString() : "-"}
              </span>
            )
          },
        },
      ]
      : []),
    {
      title: <span className="font-semibold text-gray-700">Action</span>,
      key: "action",
      render: (record: any) =>
        record?.id ? (
          <Space size="small">
            <Tooltip title="Ko'rish">
              <Button
                onClick={() => handleView(record.id.toString())}
                className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                size="small"
              >
                <FiEye size={16} />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          "-"
        ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-300 to-slate-500 p-6 rounded-2xl border border-teal-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <FiUsers className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Studentlar boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Studentlar ma'lumotlarini ko'ring va boshqaring</p>
          </div>
        </div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="PINFL"
            value={pinfl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName,
                educationForm,
                educationType,
                showDebt,
                pinfl: e.target.value,
                passport,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />

          <Input
            placeholder="Passport"
            value={passport}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName,
                educationForm,
                educationType,
                showDebt,
                pinfl,
                passport: e.target.value,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />

          <Input
            placeholder="Telefon"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone: e.target.value,
                firstName,
                lastName,
                educationForm,
                educationType,
                showDebt,
                pinfl,
                passport,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />

          <Input
            placeholder="Ism"
            value={firstName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName: e.target.value,
                lastName,
                educationForm,
                educationType,
                showDebt,
                pinfl,
                passport,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />

          <Input
            placeholder="Familiya"
            value={lastName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName: e.target.value,
                educationForm,
                educationType,
                showDebt,
                pinfl,
                passport,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
          />

          <Select
            allowClear
            placeholder="Ta'lim shakli"
            options={educationFormOptions}
            value={educationForm || undefined}
            className="h-10"
            onChange={(value: string | undefined) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName,
                educationType,
                educationForm: value || "",
                showDebt,
                pinfl,
                passport,
              })
            }
          />

          <Select
            placeholder="Ta'lim turi"
            options={educationTypeOptions}
            value={educationType || undefined}
            className="h-10"
            onChange={(value: string | undefined) =>
              setSearchParams({
                page: "1",
                size: size.toString(),
                phone,
                firstName,
                lastName,
                educationForm,
                educationType: value || "",
                showDebt,
                pinfl,
                passport,
              })
            }
          />

          <Button
            type="primary"
            onClick={handleSearch}
            className="h-10 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<FiSearch />}
          >
            Qidirish
          </Button>
        </div>

        {/* Checkbox and Action Buttons */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors duration-200">
            <input
              type="checkbox"
              checked={isInDebt}
              onChange={(e) => {
                const checked = e.target.checked
                setIsInDebt(checked)
                const params = new URLSearchParams(searchParams)
                params.set("page", "1")
                if (checked) {
                  params.set("showDebt", "true")
                } else {
                  params.delete("showDebt")
                }
                setSearchParams(params)
              }}
              className="hidden"
            />
            <span
              className={`w-5 h-5 flex items-center justify-center border-2 rounded ${isInDebt ? "bg-gradient-to-br from-teal-400 to-blue-600 border-teal-400" : "bg-white border-gray-300"
                }`}
            >
              {isInDebt && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-sm font-medium text-gray-700">Qarzdorlik ko'rsatish</span>
          </label>

          <Popconfirm
            title="Excel fayl orqali yangilash"
            description="Aniq ishonchingiz komilmi? Bu jarayon ma'lumotlarni yangilaydi."
            onConfirm={showModal}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{
              className: "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 px-2",
            }}
            cancelButtonProps={{
              className: "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-2 mx-1",
            }}
          >
            <Button
              className="h-10 bg-gradient-to-r px-5 from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
              icon={<FiUpload />}
            >
              Excel bilan yangilash
            </Button>
          </Popconfirm>

          <Popconfirm
            title="HEMIS orqali yangilash"
            description="HEMIS tizimi orqali ma'lumotlarni yangilashni tasdiqlaysizmi?"
            onConfirm={() => {
              handleSync()
              setIsConfirmVisible(false)
              isConfirmVisible
            }}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{
              className: "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 px-2",
            }}
            cancelButtonProps={{
              className: "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-2",
            }}
          >

            <Button
              loading={isSyncing}
              className="h-10 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-0 px-5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
              icon={<FiRefreshCw />}
            >
              HEMIS orqali yangilash
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Studentlar ro'yhatini yuklash"
            description="Aniq ishonchingiz komilmi? Bu jarayon ma'lumotlarni yuklaydi."
            onConfirm={() => {
              showModal
              handleExportStudents()
            }}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{
              className: "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 px-2",
            }}
            cancelButtonProps={{
              className: "bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white px-2 mx-1",
            }}
          > <Button
            // onClick={handleExportStudents}
            loading={exportStudentsMutation.isPending}
            className="h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0 rounded-xl px-4 font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<FiDownload />}
          >
              Ro'yxatni yuklash
            </Button></Popconfirm>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-scroll">
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
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
          onRow={(record) => ({
            onClick: () => handleView(record.id),
            className: "hover:bg-gray-50 cursor-pointer transition-colors duration-200",
          })}
          className="rounded-2xl"
        />
      </div>

      <UploadStudentDataModal open={isModalOpen} onClose={handleClose} />
    </div>
  )
}

export default Index
