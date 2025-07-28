"use client"

import type React from "react"

import { Modal, Descriptions, Typography } from "antd"
import { UserOutlined, TeamOutlined, IdcardOutlined, BookOutlined, AuditOutlined } from "@ant-design/icons"
import type { Dispatch, SetStateAction } from "react"

const {  Text } = Typography

interface AuditModalProps {
  audetModalOpen: boolean
  setAudetModalOpen: Dispatch<SetStateAction<boolean>>
  record: any | null
}

const AuditModal: React.FC<AuditModalProps> = ({ audetModalOpen, setAudetModalOpen, record }) => {
  const handleOk = () => setAudetModalOpen(false)
  const handleCancel = () => setAudetModalOpen(false)

  return (
    <Modal
      open={audetModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={900}
      className="rounded-2xl"
      styles={{
        content: {
          borderRadius: "16px",
          padding: "32px",
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <AuditOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Audit Ma'lumotlari</h3>
            <p className="text-sm text-gray-500 mt-1">Student va audit ma'lumotlarini ko'ring</p>
          </div>
        </div>
      }
    >
      {record ? (
        <div className="mt-6">
          <Descriptions
            column={1}
            size="middle"
            bordered
            className="bg-white rounded-xl overflow-hidden shadow-sm"
            labelStyle={{
              fontWeight: "600",
              backgroundColor: "#f8fafc",
              color: "#374151",
              padding: "16px 20px",
            }}
            contentStyle={{
              padding: "16px 20px",
              backgroundColor: "#ffffff",
            }}
          >
            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-teal-500" />
                  <span>F.I.Sh</span>
                </div>
              }
            >
              <span className="font-medium text-gray-800">{record.student?.fullName || "-"}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <TeamOutlined className="text-blue-500" />
                  <span>Guruh</span>
                </div>
              }
            >
              <span className="font-medium text-gray-800">{record.student?.group || "-"}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <IdcardOutlined className="text-purple-500" />
                  <span>PINFL</span>
                </div>
              }
            >
              <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                {record.student?.pinfl || "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <BookOutlined className="text-orange-500" />
                  <span>Yo'nalish</span>
                </div>
              }
            >
              <span className="font-medium text-gray-800">{record.student?.speciality || "-"}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-green-500" />
                  <span>Yaratgan foydalanuvchi</span>
                </div>
              }
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-xs" />
                </div>
                <span className="font-medium text-gray-800">{record.audit?.createdByFullName || "-"}</span>
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-blue-500" />
                  <span>Oxirgi yangilagan foydalanuvchi</span>
                </div>
              }
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-xs" />
                </div>
                <span className="font-medium text-gray-800">{record.audit?.updatedByFullName || "-"}</span>
              </div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AuditOutlined className="text-gray-400 text-2xl" />
          </div>
          <Text type="secondary" className="text-lg">
            Ma'lumotlar topilmadi
          </Text>
        </div>
      )}
    </Modal>
  )
}

export default AuditModal
