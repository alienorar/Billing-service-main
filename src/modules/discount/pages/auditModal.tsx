"use client"

import type React from "react"

import { Modal, Descriptions, Typography } from "antd"
import type { Dispatch, SetStateAction } from "react"
import {
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  BookOutlined,
  UserAddOutlined,
  EditOutlined,
} from "@ant-design/icons"

const { Title, Text } = Typography

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
          padding: "0",
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-8 rounded-t-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <UserOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={2} className="text-white mb-2">
              Audit Ma'lumotlari
            </Title>
            <p className="text-white/80">Talaba va tizim ma'lumotlari</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {record ? (
          <Descriptions
            column={1}
            size="middle"
            className="custom-descriptions"
            labelStyle={{
              fontWeight: "600",
              color: "#374151",
              backgroundColor: "#f8fafc",
              padding: "16px 20px",
              borderRadius: "8px 0 0 8px",
            }}
            contentStyle={{
              padding: "16px 20px",
              backgroundColor: "white",
              borderRadius: "0 8px 8px 0",
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
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {record.student?.group || "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <IdcardOutlined className="text-purple-500" />
                  <span>PINFL</span>
                </div>
              }
            >
              <span className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-lg">{record.student?.pinfl || "-"}</span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <BookOutlined className="text-green-500" />
                  <span>Yo'nalish</span>
                </div>
              }
            >
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                {record.student?.speciality || "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <UserAddOutlined className="text-teal-500" />
                  <span>Yaratgan foydalanuvchi</span>
                </div>
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <UserAddOutlined className="text-teal-600 text-sm" />
                </div>
                <span className="font-medium text-gray-800">{record.audit?.createdByFullName || "-"}</span>
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <div className="flex items-center gap-2">
                  <EditOutlined className="text-orange-500" />
                  <span>Oxirgi yangilagan foydalanuvchi</span>
                </div>
              }
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <EditOutlined className="text-orange-600 text-sm" />
                </div>
                <span className="font-medium text-gray-800">{record.audit?.updatedByFullName || "-"}</span>
              </div>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="text-center py-12">
            <UserOutlined className="text-4xl text-gray-300 mb-4" />
            <Text type="danger" className="text-lg">
              Ma'lumotlar topilmadi
            </Text>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AuditModal
