
"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button, Input, TablePaginationConfig } from "antd"
import { FiSearch, FiUsers } from "react-icons/fi"
import { useQuery } from "@tanstack/react-query"
import { getAbiturients } from "../service"
import { GlobalTable } from "@components"

// Define interfaces for the data structure
interface PaymentDetails {
  studentDebtAmount?: number
}

interface Deal {
  educationForm?: string
  studiedSpecialityName?: string
  bitrixId?: number
  title?: string
  contractUrl?: string
  contractNumber?: string
  opportunity?: number
}

interface Abiturient {
  bitrixId?: number
  name?: string
  secondName?: string
  lastName?: string
  pinfl?: string
  phone?: string
  address?: string
  paymentDetails?: PaymentDetails | null
  deal?: Deal | null
}

interface Paging {
  currentPage: number
  totalPages: number
  totalItems: number
}

interface AbiturientsResponse {
  timestamp: number
  success: boolean
  errorMessage: string
  data: {
    content: Abiturient[]
    paging: Paging
  }
}

// interface ParamsType {
//   page?: number
//   size?: number
//   phone?: string
//   pinfl?: string
//   firstName?: string
//   lastName?: string
//   showDebt?: string
// }

const Index: React.FC = () => {
  const [tableData, setTableData] = useState<Abiturient[]>([])
  const [total, setTotal] = useState<number>(0)
//   const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isInDebt, setIsInDebt] = useState<boolean>(false)

  // URL search parameters
  const page = Number(searchParams.get("page")) || 1
  const size = Number(searchParams.get("size")) || 10
  const phone = searchParams.get("phone") || ""
  const pinfl = searchParams.get("pinfl") || ""
  const firstName = searchParams.get("firstName") || ""
  const lastName = searchParams.get("lastName") || ""
  const showDebt = searchParams.get("showDebt") || ""

  useEffect(() => {
    const showDebtValue = searchParams.get("showDebt") === "true"
    setIsInDebt(showDebtValue)
  }, [searchParams])

  const { data: abiturients, isLoading } = useQuery<AbiturientsResponse>({
    queryKey: ["abiturients", { page, size, phone, pinfl, firstName, lastName, showDebt }],
    queryFn: () => getAbiturients({
      page: page - 1,
      size,
      phone: phone ? phone : undefined,
      pinfl: pinfl || undefined,
      firstName,
      lastName,
      showDebt: showDebt ? showDebt : undefined,
    }),
  })

  useEffect(() => {
    if (abiturients?.data?.content) {
      setTableData(abiturients.data.content)
      setTotal(abiturients.data.paging.totalItems || 0)
    }
  }, [abiturients])

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const current = pagination.current ?? 1 // Default to 1 if undefined
    const pageSize = pagination.pageSize ?? 10 // Default to 10 if undefined
    setSearchParams({
      page: current.toString(),
      size: pageSize.toString(),
      phone,
      pinfl,
      firstName,
      lastName,
      showDebt,
    })
  }

  const handleSearch = () => {
    setSearchParams({
      page: "1",
      size: size.toString(),
      phone,
      pinfl,
      firstName,
      lastName,
      showDebt,
    })
  }

//   const handleView = (id?: number) => {
//     if (id) {
//       navigate(`/super-admin-panel/abiturients/${id}`)
//     } else {
//       message.error("Abiturient ID not found")
//     }
//   }

  const columns = [
    {
      title: <span className="font-semibold text-gray-700">ID</span>,
      dataIndex: "bitrixId",
      render: (value?: number) => <span className="font-medium text-gray-600">#{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">To'liq ism</span>,
      key: "fullName",
      render: (_: any, record: Abiturient) => (
        <span className="font-medium text-gray-800">
          {`${record.name || ""} ${record.secondName || ""} ${record.lastName || ""}`.trim() || "-"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">PINFL</span>,
      dataIndex: "pinfl",
      render: (value?: string) => <span className="font-mono text-sm text-gray-600">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Telefon</span>,
      dataIndex: "phone",
      render: (value?: string) => <span className="text-blue-600 font-medium">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Manzil</span>,
      dataIndex: "address",
      render: (value?: string) => <span className="text-gray-800">{value ?? "-"}</span>,
    },
    {
      title: <span className="font-semibold text-gray-700">Ta'lim shakli</span>,
      key: "educationForm",
      render: (_: any, record: Abiturient) => {
        const form = record.deal?.educationForm
          ? record.deal.educationForm === "28" ? "Kunduzgi" : record.deal.educationForm
          : "-"
        const formColor = form === "Kunduzgi" ? "text-blue-600 bg-blue-50" : "text-gray-500 bg-gray-50"
        return (
          <span className={`${formColor} px-2 py-1 rounded-lg text-xs font-semibold`}>
            {form}
          </span>
        )
      },
    },
    {
      title: <span className="font-semibold text-gray-700">Mutaxasislik</span>,
      key: "speciality",
      render: (_: any, record: Abiturient) => (
        <span className="text-gray-800 text-sm">
          {record.deal?.studiedSpecialityName ?? "-"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Opportunity</span>,
      key: "opportunity",
      render: (_: any, record: Abiturient) => (
        <span className="text-gray-800 text-sm">
          {record.deal?.opportunity ? record.deal.opportunity.toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Shartnoma raqami</span>,
      key: "contractNumber",
      render: (_: any, record: Abiturient) => (
        <span className="text-gray-800 text-sm">
          {record.deal?.contractNumber ? record.deal.contractNumber.toLocaleString() : "-"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold text-gray-700">Shartnoma</span>,
      key: "contractUrl",
      render: (_: any, record: Abiturient) =>
        record.deal?.contractUrl ? (
          <a
            href={record.deal.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
           Shartnomani ko'rish
          </a>
        ) : (
          <span className="text-gray-500">-</span>
        ),
    },
    ...(isInDebt
      ? [
          {
            title: <span className="font-semibold text-gray-700">Qarzdorligi</span>,
            key: "studentDebtAmount",
            render: (_: any, record: Abiturient) => {
              const amount = record.paymentDetails?.studentDebtAmount ?? 0
              return (
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                    amount < 0
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
    // {
    //   title: <span className="font-semibold text-gray-700">Action</span>,
    //   key: "action",
    //   render: (_: any, record: Abiturient) =>
    //     record?.bitrixId ? (
    //       <Space size="small">
    //         <Tooltip title="Ko'rish">
    //           <Button
    //             onClick={() => handleView(record.bitrixId)}
    //             className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
    //             size="small"
    //           >
    //             <FiEye size={16} />
    //           </Button>
    //         </Tooltip>
    //       </Space>
    //     ) : (
    //       "-"
    //     ),
    // },
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
            <h1 className="text-2xl font-bold text-gray-800">Abiturientlar boshqaruvi</h1>
            <p className="text-gray-600 mt-1">Abiturientlar ma'lumotlarini ko'ring va boshqaring</p>
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
                pinfl: e.target.value,
                firstName,
                lastName,
                showDebt,
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
                pinfl,
                firstName,
                lastName,
                showDebt,
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
                pinfl,
                firstName: e.target.value,
                lastName,
                showDebt,
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
                pinfl,
                firstName,
                lastName: e.target.value,
                showDebt,
              })
            }
            className="h-10 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            prefix={<FiSearch className="text-gray-400" />}
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

        {/* Checkbox */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-teal-300 transition-colors duration-200">
            <input
              type="checkbox"
              checked={isInDebt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                isInDebt ? "bg-gradient-to-br from-teal-400 to-blue-600 border-teal-400" : "bg-white border-gray-300"
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
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-scroll">
        <GlobalTable
          loading={isLoading}
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
            showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} dan ${total} ta natija`,
          }}
        //   onRow={(record: Abiturient) => ({
        //     onClick: () => handleView(record.bitrixId),
        //     className: "hover:bg-gray-50 cursor-pointer transition-colors duration-200",
        //   })}
          className="rounded-2xl"
        />
      </div>
    </div>
  )
}

export default Index
