"use client"

import { Modal, Form, Input, Button, Select } from "antd"
import { useEffect } from "react"
import { UserOutlined, PhoneOutlined, IdcardOutlined, TeamOutlined, UserAddOutlined } from "@ant-design/icons"
import { useCreateAdmin, useUpdateAdmin } from "../hooks/mutations"
import type { AdminType } from "@types"

const { Option } = Select

interface AdminModalType {
  open: boolean
  handleClose?: () => void
  update?: AdminType | undefined | null
  roles?: any[]
}

const AdminsModal = ({ open, handleClose, update, roles }: AdminModalType) => {
  const [form] = Form.useForm()
  const { mutate: createMutate, isPending: isCreating } = useCreateAdmin()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateAdmin()

  useEffect(() => {
    if (update?.id) {
      form.setFieldsValue({
        roleId: update.roleId,
        username: update.username,
        phone: update.phone,
        firstName: update.firstName,
        lastName: update.lastName,
      })
    } else {
      form.resetFields()
    }
  }, [update, form])

  const onFinish = async (value: AdminType) => {
    const payload: AdminType = {
      id: update?.id,
      roleId: value.roleId,
      username: value.username,
      phone: value.phone,
      firstName: value.firstName,
      lastName: value.lastName,
    }

    if (update?.id) {
      updateMutate(payload, {
        onSuccess: () => {
          if (handleClose) {
            handleClose()
          }
        },
      })
    } else {
      createMutate(payload, {
        onSuccess: () => {
          form.resetFields()
          if (handleClose) {
            handleClose()
          }
        },
      })
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={650}
      className="rounded-2xl overflow-hidden"
      styles={{
        content: {
          borderRadius: "16px",
          padding: "0",
          overflow: "hidden",
        },
      }}
      title={null}
    >
      <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <UserAddOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{update?.id ? "Adminni tahrirlash" : "Yangi admin qo'shish"}</h3>
            <p className="text-white/80">
              {update?.id ? "Admin ma'lumotlarini yangilang" : "Yangi admin ma'lumotlarini kiriting"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Form form={form} name="admin_form" layout="vertical" onFinish={onFinish} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="font-semibold text-gray-700">Username</span>}
              name="username"
              rules={[{ required: true, message: "Username kiriting!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-blue-500" />}
                placeholder="Username kiriting"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-700">Telefon raqam</span>}
              name="phone"
              rules={[{ required: true, message: "Telefon raqam kiriting!" }]}
            >
              <Input
                prefix={<PhoneOutlined className="text-blue-500" />}
                placeholder="Telefon raqam kiriting"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="font-semibold text-gray-700">Ism</span>}
              name="firstName"
              rules={[{ required: true, message: "Ism kiriting!" }]}
            >
              <Input
                prefix={<IdcardOutlined className="text-blue-500" />}
                placeholder="Ism kiriting"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-700">Familiya</span>}
              name="lastName"
              rules={[{ required: true, message: "Familiya kiriting!" }]}
            >
              <Input
                prefix={<IdcardOutlined className="text-blue-500" />}
                placeholder="Familiya kiriting"
                className="h-12 rounded-xl border-gray-200 focus:border-blue-500 transition-all duration-200"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Rol</span>}
            name="roleId"
            rules={[{ required: true, message: "Rol tanlang!" }]}
          >
            <Select placeholder="Rol tanlang" className="h-12" suffixIcon={<TeamOutlined className="text-blue-500" />}>
              {roles?.map((role: any) => (
                <Option key={role.id} value={role.id}>
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
                      <TeamOutlined className="text-white text-xs" />
                    </div>
                    <span className="font-medium">{role.name}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <Button
              block
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {update?.id ? "Adminni yangilash" : "Admin yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default AdminsModal
