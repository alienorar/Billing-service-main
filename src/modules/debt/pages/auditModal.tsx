import type React from "react"
import { Modal, Descriptions, Typography } from "antd"
import type { Dispatch, SetStateAction } from "react"

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
      className="rounded-2xl overflow-hidden"
      title={
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 -m-6 mb-6 p-6 rounded-t-2xl">
          <Title level={3} className="text-white m-0">
            Audit Ma'lumotlari
          </Title>
        </div>
      }
    >
      <div className="p-6">
        {record ? (
          <Descriptions
            column={1}
            size="middle"
            bordered
            className="rounded-lg overflow-hidden"
            labelStyle={{
              fontWeight: "600",
              backgroundColor: "#f8fafc",
              color: "#374151",
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              color: "#111827",
            }}
          >
            <Descriptions.Item label="F.I.Sh">
              <span className="font-medium">{record.student?.fullName || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Guruh">
              <span className="font-medium">{record.student?.group || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="PINFL">
              <span className="font-medium font-mono">{record.student?.pinfl || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Yo'nalish">
              <span className="font-medium">{record.student?.speciality || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Yaratgan foydalanuvchi">
              <span className="font-medium text-green-700">{record.audit?.createdByFullName || "—"}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Oxirgi yangilagan foydalanuvchi">
              <span className="font-medium text-blue-700">{record.audit?.updatedByFullName || "—"}</span>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="text-center py-8">
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
