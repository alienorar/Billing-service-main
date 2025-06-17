"use client"

import { Modal, Form, Input, Button, Select } from "antd"
import { useEffect } from "react"
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
      <style>{`
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
          background-color: #b8d9f2 !important;
        }
        .ant-select-item-option-selected:not(.ant-select-item-option-disabled) .ant-select-item-option-content {
          color: #1f2937 !important;
        }
      `}</style>
      <Modal
        title={
          <span className="text-2xl font-semibold text-gray-800">
            {update?.id ? "Edit Role" : "Add New Role"}
          </span>
        }
        open={open}
        onCancel={handleClose}
        footer={null}
        className="rounded-lg"
        styles={{
          content: { 
            padding: '24px', 
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
          },
          header: { 
            padding: '16px 24px', 
            borderBottom: '1px solid #e5e7eb' 
          },
        }}
      >
        <Form 
          form={form} 
          name="roles_form" 
          layout="vertical" 
          onFinish={onFinish}
          className="space-y-4"
        >
          {update?.id && (
            <Form.Item 
              label={<span className="text-gray-700 font-medium">Role ID</span>} 
              name="id"
            >
              <Input 
                disabled 
                className="rounded-md border-gray-300 bg-gray-100 text-gray-600 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              />
            </Form.Item>
          )}
          <Form.Item 
            label={<span className="text-gray-700 font-medium">Role Name</span>} 
            name="name" 
            rules={[{ required: true, message: "Enter role name!" }]}
          >
            <Input 
              className="rounded-md border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Enter role name"
            />
          </Form.Item>
          <Form.Item 
            label={<span className="text-gray-700 font-medium">Display Name</span>} 
            name="displayName" 
            rules={[{ required: true, message: "Enter display name!" }]}
          >
            <Input 
              className="rounded-md border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Enter display name"
            />
          </Form.Item>
          <Form.Item 
            label={<span className="text-gray-700 font-medium">Default URL</span>} 
            name="defaultUrl" 
            rules={[{ required: true, message: "Enter default URL!" }]}
          >
            <Input 
              className="rounded-md border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
              placeholder="Enter default URL"
            />
          </Form.Item>
          <Form.Item 
            label={<span className="text-gray-700 font-medium">Permissions</span>} 
            name="permissions"
          >
            <Select
              mode="multiple"
              placeholder="Select permissions"
              className="w-full"
              dropdownClassName="rounded-lg shadow-lg"
              value={form.getFieldValue("permissions") || []}
              onChange={(values) => form.setFieldsValue({ permissions: values })}
            >
              {permessionL?.map((parent) => (
                <OptGroup
                  key={parent.id}
                  label={
                    <span className="font-semibold text-gray-700 text-sm">
                      {parent.name}
                    </span>
                  }
                >
                  <Option 
                    key={`parent-${parent.id}`} 
                    value={parent.id} 
                    label={`[Group] ${parent.name}`}
                  >
                    <span className="font-medium text-green-600">{parent.name}</span>
                  </Option>
                  {parent.children?.map((child:any) => (
                    <Option 
                      key={child.id} 
                      value={child.id} 
                      label={child.name}
                    >
                      <span className="pl-3 text-gray-600">{child.name}</span>
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              block
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="h-10 bg-[#050556] text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              {update?.id ? "Update Role" : "Create Role"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default RolesModal