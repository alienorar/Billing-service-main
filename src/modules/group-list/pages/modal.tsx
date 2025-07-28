"use client"

import type React from "react"

import { Modal, Form, Input, Button, Select } from "antd"
import { useEffect } from "react"
import { TeamOutlined, IdcardOutlined, DollarOutlined } from "@ant-design/icons"
import { useUpdateGroupList } from "../hooks/mutations"
import type { GroupListUpdate, PaymentGroup } from "@types"
import { useGetPmtGroupList } from "../hooks/queries"

interface GroupModalProps {
  open: boolean
  handleClose: () => void
  update: GroupListUpdate | null
}

const GroupModal: React.FC<GroupModalProps> = ({ open, handleClose, update }) => {
  const [form] = Form.useForm()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateGroupList()
  const { data: paymentGroupsData, isLoading: isLoadingPaymentGroups } = useGetPmtGroupList()

  const paymentGroupOptions =
    paymentGroupsData?.data?.content?.map((group: PaymentGroup) => ({
      value: group.id,
      label: `${group.name}`,
    })) || []

  useEffect(() => {
    if (update) {
      form.setFieldsValue({
        groupId: update.id,
        paymentGroupId: update.paymentGroupId || undefined,
      })
    } else {
      form.resetFields()
    }
  }, [update, form])

  const onFinish = async (values: GroupListUpdate) => {
    const payload: GroupListUpdate = {
      groupId: values.groupId,
      paymentGroupId: values.paymentGroupId,
    }
    updateMutate(payload, { onSuccess: handleClose })
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <TeamOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Guruhni tahrirlash</h3>
            <p className="text-sm text-gray-500 mt-1">Guruh ma'lumotlarini yangilang</p>
          </div>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      className="rounded-2xl"
      styles={{
        content: {
          borderRadius: "16px",
          padding: "24px",
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <Form form={form} name="group_form" layout="vertical" onFinish={onFinish} className="mt-6">
        <Form.Item
          label={<span className="font-semibold text-gray-700">Guruh ID</span>}
          name="groupId"
          rules={[{ required: true, message: "Guruh ID kiriting!" }]}
        >
          <Input
            disabled
            prefix={<IdcardOutlined className="text-gray-400" />}
            className="h-12 rounded-xl border-gray-200 bg-gray-50 text-gray-600"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">To'lov guruhi ID</span>}
          name="paymentGroupId"
          rules={[{ required: false }]}
        >
          <Select
            placeholder="To'lov guruhini tanlang"
            options={paymentGroupOptions}
            loading={isLoadingPaymentGroups}
            allowClear
            className="h-12"
            suffixIcon={<DollarOutlined className="text-teal-500" />}
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-8">
          <Button
            block
            htmlType="submit"
            loading={isUpdating}
            className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Guruhni yangilash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default GroupModal
