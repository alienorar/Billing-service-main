"use client"

import type React from "react"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Button, Input, Space, Tooltip, Popconfirm, message, Select } from "antd"
import { useNavigate, useSearchParams } from "react-router-dom"
import { GlobalTable } from "@components"
import type { AdminType } from "@types"
import { FiEye, FiDownload } from "react-icons/fi"
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

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1
  const size = Number(searchParams.get("size")) || 10
  const phone = searchParams.get("phone") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const educationForm = searchParams.get("educationForm") || ""
  const educationType = searchParams.get("educationType") || ""
  const showDebt = searchParams.get("showDebt") || ""

  // Save the checkbox value
  const [isInDebt, setIsInDebt] = useState<boolean>(false)
  useEffect(() => {
    const showDebt = searchParams.get("showDebt") === "true"
    setIsInDebt(showDebt)
  }, [searchParams])

  const educationFormOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "SIRTQI", label: "Sirtqi" },
    { value: "KUNDUZGI", label: "Kunduzgi" },
    { value: "KECHKI", label: "Kechki" },
    { value: "MASOFAVIY", label: "Masofaviy" },
  ]
  const educationTypeOptions: { value: string; label: string }[] = [
    { value: "", label: "All" },
    { value: "BAKALAVR", label: "Bakalavr" },
    { value: "MAGISTR", label: "Magistr" },
  ]

  // Fetch students data
  const { data: students } = useGetStudents({
    size,
    page: page - 1,
    phone: phone ? Number(phone) : undefined,
    firstName,
    lastName,
    educationForm,
    showDebt,
    educationType,
  })

  // Sync students data (disabled by default)
  const { data: syncData, isFetching: isSyncing } = useSyncGetStudents({
    enabled: false,
  })

  // Export students mutation
  const exportStudentsMutation = useExportStudentList()

  useEffect(() => {
    if (students?.data?.content) {
      console.log(students?.data?.content)
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
    }

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(exportParams).filter(([_, value]) => value !== undefined && value !== ""),
    )

    exportStudentsMutation.mutate(cleanParams)
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (value: any) => value ?? "-",
    },
    {
      title: "To'liq ism",
      dataIndex: "fullName",
      render: (value: any) => value ?? "-",
    },
    {
      title: "Pinfl",
      dataIndex: "pinfl",
      render: (value: any) => value ?? "-",
    },
    {
      title: "Tel",
      dataIndex: "phone",
      render: (value: any) => value ?? "-",
    },
    {
      title: "Ta'lim shakli/turi",
      key: "education",
      render: (_: any, record: any) => {
        const type = record.educationType
          ? record.educationType.charAt(0).toUpperCase() + record.educationType.slice(1).toLowerCase()
          : "-"
        const form = record.educationForm
          ? record.educationForm.charAt(0).toUpperCase() + record.educationForm.slice(1).toLowerCase()
          : "-"

        // Define colors based on educationForm and educationType values
        const typeColor =
          type === "Bakalavr"
            ? "text-green-500"
            : type === "Magistr"
              ? "text-orange-500"
              : type === "-"
                ? "text-gray-500"
                : "text-black"
        const formColor =
          form === "Kunduzgi"
            ? "text-blue-500"
            : form === "Sirtqi"
              ? "text-gray-600"
              : form === "-"
                ? "text-gray-500"
                : "text-black"

        return (
          <div className="flex flex-col">
            <span className={`${typeColor} font-semibold`}>{type}</span>
            <span className={`${formColor} font-semibold`}>{form}</span>
          </div>
        )
      },
    },
    {
      title: "Guruh",
      dataIndex: "group",
      render: (value: any) => value ?? "-",
    },
    {
      title: "Mutaxasislik",
      dataIndex: "speciality",
      render: (value: any) => value ?? "-",
    },
    ...(isInDebt
      ? [
          {
            title: "Qarzdorligi",
            key: "studentDebtAmount",
            render: (_: any, record: any) => {
              const amount = record.paymentDetails?.studentDebtAmount ?? 0
              return (
                <span className={amount < 0 ? "text-red-500 font-semibold" : "text-green-500 font-semibold"}>
                  {amount !== 0 ? amount.toLocaleString() : "-"}
                </span>
              )
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      render: (record: any) =>
        record?.id ? (
          <Space size="middle">
            <Tooltip title="Ko'rish">
              <Button onClick={() => handleView(record.id.toString())}>
                <FiEye size={18} />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          "-"
        ),
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Tel"
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
              })
            }
            style={{
              padding: "6px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            className="w-[300px]"
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
              })
            }
            style={{
              padding: "6px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            className="w-[300px]"
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
              })
            }
            style={{
              padding: "6px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            className="w-[300px]"
          />
          <Select
            allowClear
            placeholder="Ta'lim shakli"
            style={{
              padding: "6px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            options={educationFormOptions}
            value={educationForm || ""}
            className="w-[200px]"
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
              })
            }
          />
          <label className="flex items-center gap-2 cursor-pointer p-[5px] border-[1px] border-[#5e5d5d27] rounded-lg">
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
              className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                isInDebt ? "bg-[#050556]" : "bg-white"
              } border-[#050556"]`}
            >
              {isInDebt && (
                <svg className="w-4 h-4 text-white" fill="none" stroke="#ffffff" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="text-[13px] text-gray-800 ">Qarzdorlik</span>
          </label>

          <Select
            placeholder="Ta'lim turi"
            style={{
              padding: "6px",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
            }}
            options={educationTypeOptions}
            value={educationType || ""}
            className="w-[200px]"
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
              })
            }
          />
          <Button
            type="primary"
            size="large"
            style={{
              maxWidth: 220,
              minWidth: 80,
              backgroundColor: "green",
              color: "white",
              height: 36,
            }}
            onClick={handleSearch}
          >
            Qidirish
          </Button>
        </div>

        <div>
          <Popconfirm
            title="Aniq ishonchingiz komilmi , o'ylab ko'ring yana-a?"
            onConfirm={showModal}
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
            <Button
              type="primary"
              size="large"
              style={{
                maxWidth: 220,
                minWidth: 80,
                backgroundColor: "#050556",
                color: "white",
                height: 40,
              }}
              className="text-[16px] mx-4"
            >
              Exel bilan yangilash
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            size="large"
            style={{
              maxWidth: 206,
              minWidth: 80,
              backgroundColor: "#050556",
              color: "white",
              height: 40,
              paddingRight: "2px",
              paddingLeft: "2px",
            }}
            className="text-[16px] mx-2"
            onClick={handleSync}
            loading={isSyncing}
          >
            Hemis orqali yangilash
          </Button>

          <Button
            type="primary"
            size="large"
            icon={<FiDownload size={16} />}
            style={{
              maxWidth: 246,
              minWidth: 80,
              backgroundColor: "#28a745",
              borderColor: "#28a745",
              color: "white",
              height: 40,
              paddingRight: "8px",
              paddingLeft: "8px",
            }}
            className="text-[16px] mx-2"
            onClick={handleExportStudents}
            loading={exportStudentsMutation.isPending}
          >
            Studentlar ro'yhatini yuklash
          </Button>
        </div>
      </div>

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
        }}
        onRow={(record) => ({
          onClick: () => handleView(record.id),
        })}
      />

      <UploadStudentDataModal open={isModalOpen} onClose={handleClose} />
    </>
  )
}

export default Index
