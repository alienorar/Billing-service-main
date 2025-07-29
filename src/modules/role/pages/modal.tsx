"use client"

import { Modal, Form, Input, Button, Select } from "antd"
import { useEffect } from "react"
import { UserOutlined, TagOutlined, LinkOutlined, SafetyOutlined, SettingOutlined } from "@ant-design/icons"
import { useCreateRoles, useUpdateRoles } from "../hooks/mutations"
import type { RoleModalType, RoleType } from "@types"

const { Option, OptGroup } = Select

const RolesModal = ({ open, handleClose, update, permessionL }: RoleModalType) => {
  const [form] = Form.useForm()
  const { mutate: createMutate, isPending: isCreating } = useCreateRoles()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateRoles()

  useEffect(() => {
    if (!open) {
      form.resetFields()
    }
  }, [open, form])

  useEffect(() => {
    if (open && update?.id) {
      form.setFieldsValue({
        id: update.id,
        name: update.name,
        displayName: update.displayName,
        defaultUrl: update.defaultUrl,
        permissions: update.userPermissions?.map((perm) => perm.id) || [],
      })
    } else if (open && !update?.id) {
      form.resetFields()
    }
  }, [update, form, open])

  const onFinish = async (value: RoleType) => {
    const payload: RoleType = {
      id: value?.id,
      name: value?.name,
      displayName: value?.displayName,
      defaultUrl: value?.defaultUrl,
      permissions: value?.permissions || [],
    }

    if (update?.id) {
      updateMutate(payload, { onSuccess: handleClose })
    } else {
      createMutate(payload, { onSuccess: handleClose })
    }
  }

  return (
    <>
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 ">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
              <SettingOutlined className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {update?.id ? "Rolni tahrirlash" : "Yangi rol qo'shish"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {update?.id ? "Rol ma'lumotlarini yangilang" : "Yangi rol ma'lumotlarini kiriting"}
              </p>
            </div>
          </div>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        width={800}
        className="rounded-2xl "
        styles={{
          content: {
            borderRadius: "16px",
            padding: "24px",
            background: "white",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <Form form={form} name="roles_form" layout="vertical" onFinish={onFinish} className="mt-6  ">
          {update?.id && (
            <Form.Item label={<span className="font-semibold text-gray-700">Role ID</span>} name="id">
              <Input
                disabled
                prefix={<TagOutlined className="text-gray-400" />}
                className="h-12 rounded-xl bg-gray-50 text-gray-600 outline-black border-gray-400 border-[2px]"
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <Form.Item
              label={<span className="font-semibold text-gray-700">Rol nomi</span>}
              name="name"
              rules={[{ required: true, message: "Rol nomini kiriting!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Rol nomini kiriting"
                className="h-12 rounded-xl focus:border-teal-400 focus:shadow-lg transition-all duration-200 border-gray-400 border-[2px]"
              />
            </Form.Item>

            <Form.Item
              label={<span className="font-semibold text-gray-700">Ko'rinib turuvchi nomi</span>}
              name="displayName"
              rules={[{ required: true, message: "Ko'rinib turuvchi nomini kiriting!" }]}
            >
              <Input
                prefix={<TagOutlined className="text-gray-400" />}
                placeholder="Ko'rinib turuvchi nomini kiriting"
                className="h-12 rounded-xl  focus:border-teal-400 focus:shadow-lg transition-all duration-200 border-gray-400 border-[2px]"
              />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Default URL</span>}
            name="defaultUrl"
            rules={[{ required: true, message: "Default URL kiriting!" }]}
          >
            <Input
              prefix={<LinkOutlined className="text-gray-400" />}
              placeholder="Default URL kiriting"
              className="h-12 rounded-xl  focus:border-teal-400 focus:shadow-lg transition-all duration-200 border-gray-400 border-[2px]"
            />
          </Form.Item>

          <Form.Item label={<span className="font-semibold text-gray-700">Ruxsatlar</span>} name="permissions">
            <Select
              mode="multiple"
              placeholder="Ruxsatlarni tanlang"
              className="min-h-12 border-gray-400 border-[2px]"
              dropdownClassName="rounded-xl shadow-xl border-0"
              value={form.getFieldValue("permissions") || []}
              onChange={(values) => form.setFieldsValue({ permissions: values })}
              style={{
                borderRadius: "12px",
              }}
            >
              {permessionL?.map((parent) => (
                <OptGroup
                  key={parent.id}
                  label={
                    <div className="flex items-center gap-2 py-2 px-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <SafetyOutlined className="text-white text-xs" />
                      </div>
                      <span className="font-bold text-gray-700 text-sm">{parent.name}</span>
                    </div>
                  }
                >
                  <Option key={`parent-${parent.id}`} value={parent.id} label={`[Group] ${parent.name}`}>
                    <div className="flex items-center gap-2 py-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-md flex items-center justify-center">
                        <SafetyOutlined className="text-white text-xs" />
                      </div>
                      <span className="font-semibold text-green-700">{parent.name}</span>
                      <span className="text-xs text-green-500 bg-green-50 px-2 py-0.5 rounded-full ml-auto">Guruh</span>
                    </div>
                  </Option>
                  {parent.children?.map((child: any) => (
                    <Option key={child.id} value={child.id} label={child.name}>
                      <div className="flex items-center gap-2 py-1 pl-6">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                        <span className="text-gray-700">{child.name}</span>
                      </div>
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <Button
              block
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {update?.id ? "Rolni yangilash" : "Rol yaratish"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default RolesModal
