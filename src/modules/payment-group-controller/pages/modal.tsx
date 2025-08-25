"use client"

import type React from "react"
import { Modal, Form, Input, Button, InputNumber, TreeSelect, Spin, Alert } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
import { TeamOutlined, ClockCircleOutlined, DollarOutlined } from "@ant-design/icons"
import { useCreatePmtGroupList, useUpdatePmtGroupList } from "../hooks/mutations"
import { useGetAvailabletGroupList } from "../hooks/queries"
import type { PaymentGroup, Speciality, AvailableGroup, PmtGroupFormValues, ContractAmountForm } from "@types"
import type { DataNode } from "antd/es/tree"

interface PmtGroupModalProps {
  open: boolean
  handleClose: () => void
  update?: PaymentGroup | null
}

interface GroupObject {
  id: number
  name: string
}

const PmtGroupModal: React.FC<PmtGroupModalProps> = ({ open: modalOpen, handleClose, update }) => {
  const [form] = useForm<PmtGroupFormValues>()
  const { mutate: createMutate, isPending: isCreating } = useCreatePmtGroupList()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePmtGroupList()
  const { data: groupList, isLoading: isGroupsLoading, isError, error: errorInfo } = useGetAvailabletGroupList()

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([])
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([])
  const [selectedGroupData, setSelectedGroupData] = useState<{ value: number; label: string }[]>([])

  useEffect(() => {
    if (update?.id && groupList?.data) {
      const contractAmounts = update.contractAmounts
        ? Object.entries(update.contractAmounts).map(([key, amount]) => ({ key, amount }))
        : []
      const groupIds: number[] = []
      const groupData: { value: number; label: string }[] = []

      if (update.groupIds && Array.isArray(update.groupIds)) {
        update.groupIds.forEach((g: GroupObject | string | number) => {
          if (typeof g === "object" && g.id) {
            groupIds.push(g.id)
            groupData.push({ value: g.id, label: g.name })
          } else if (typeof g === "string") {
            const foundGroup = groupList.data
              .flatMap((s: Speciality) => s.groups || [])
              .find((group: AvailableGroup) => group.name === g)
            if (foundGroup) {
              groupIds.push(foundGroup.id)
              groupData.push({ value: foundGroup.id, label: foundGroup.name })
            }
          } else if (typeof g === "number") {
            const foundGroup = groupList.data
              .flatMap((s: Speciality) => s.groups || [])
              .find((group: AvailableGroup) => group.id === g)
            if (foundGroup) {
              groupIds.push(g)
              groupData.push({ value: g, label: foundGroup.name })
            }
          }
        })
      }

      form.setFieldsValue({
        name: update.name,
        duration: update.duration,
        contractAmounts,
        groupIds: groupData,
      })
      setSelectedGroupIds(groupIds)
      setSelectedGroupData(groupData)

      if (update.duration > 0 && contractAmounts.length === 0) handleDurationChange(update.duration)
      setExpandedKeys([])
    } else {
      form.resetFields()
      form.setFieldsValue({
        name: "",
        duration: 1,
        contractAmounts: [{ key: "1", amount: 0 }],
        groupIds: [],
      })
      setSelectedGroupIds([])
      setSelectedGroupData([])
      handleDurationChange(1)
      setExpandedKeys([])
    }
  }, [update, form, groupList])

  const handleDurationChange = (duration: number | null): void => {
    if (typeof duration === "number" && duration > 0) {
      const current: ContractAmountForm[] = form.getFieldValue("contractAmounts") ?? []
      const newContractAmounts = Array.from({ length: duration }, (_, i) => {
        const key = `${i + 1}`
        return current[i] ?? { key, amount: 0 }
      })
      form.setFieldsValue({ contractAmounts: newContractAmounts })
    } else {
      form.setFieldsValue({ contractAmounts: [] })
    }
  }

  const treeData: DataNode[] = Array.isArray(groupList?.data)
    ? groupList.data.map((s: Speciality) => ({
        title: `${s.name} — [${(s.educationForm || "N/A").toUpperCase()} / ${(s.educationType || "N/A").toUpperCase()}]`,
        value: `speciality-${s.id}`,
        key: `speciality-${s.id}`,
        selectable: false,
        children: (s.groups ?? []).map((g: AvailableGroup) => ({
          title: g.name,
          value: g.id,
          key: g.id,
        })),
      }))
    : []

  const handleFinish = async (values: PmtGroupFormValues): Promise<void> => {
    const basePayload: Omit<PaymentGroup, "id"> = {
      name: values.name,
      duration: values.duration,
      contractAmounts: values.contractAmounts.reduce<Record<string, number>>((acc, cur) => {
        acc[cur.key] = cur.amount
        return acc
      }, {}),
      groupIds: selectedGroupIds,
    }

    if (update?.id) {
      updateMutate({ ...basePayload, id: update.id } as PaymentGroup, {
        onSuccess: () => {
          form.resetFields()
          handleClose()
        },
      })
    } else {
      createMutate(basePayload, {
        onSuccess: () => {
          form.resetFields()
          handleClose()
        },
      })
    }
  }

  if (isError) {
    return (
      <Alert
        message="Xato"
        description={`Guruhlarni yuklashda xato: ${errorInfo instanceof Error ? errorInfo.message : "Noma'lum xato"}`}
        type="error"
        showIcon
        className="m-5 rounded-xl"
      />
    )
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <TeamOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {update?.id ? "To'lov guruhini yangilash" : "To'lov guruhini yaratish"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">To'lov guruhi ma'lumotlarini kiriting</p>
          </div>
        </div>
      }
      open={modalOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
      width={700}
      styles={{
        content: {
          borderRadius: "16px",
          padding: "24px",
          background: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      {isGroupsLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" tip="Guruhlar yuklanmoqda..." />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-6 space-y-4 ">
          <Form.Item
            label={<span className="font-semibold text-gray-700">Nomi</span>}
            name="name"
            rules={[{ required: true, message: "To'lov guruhini nomini kiriting" }]}
          >
            <Input
              placeholder="To'lov guruhini nomini kiriting"
              className="h-12 rounded-xl  focus:border-teal-400 transition-all duration-200 border-gray-200 border-[2px]"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Muddati (yilda)</span>}
            name="duration"
            rules={[{ required: true, message: "Muddatni kiriting!" }]}
          >
            <InputNumber
              min={1}
              onChange={handleDurationChange}
              prefix={<ClockCircleOutlined className="text-gray-400" />}
              className="w-full h-12 rounded-xl border-gray-200 border-[2px] focus:border-teal-400 transition-all duration-200"
            />
          </Form.Item>

          <Form.Item label={<span className="font-semibold text-gray-700">Guruhlar</span>} name="groupIds">
            <TreeSelect<{ value: number; label: string }[]>
              treeData={treeData}
              multiple
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              value={selectedGroupData}
              placeholder="Guruhlarni tanlang"
              className="w-full"
              treeDefaultExpandAll
              treeExpandedKeys={expandedKeys}
              onTreeExpand={setExpandedKeys as (keys: (string | number)[]) => void}
              allowClear
              autoClearSearchValue={false}
              showSearch
              labelInValue
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              filterTreeNode={(input, node) => (node.title as string).toLowerCase().includes(input.toLowerCase())}
              onChange={(val: { value: number; label: string }[] | undefined) => {
                const selectedData = val || []
                const numericIds = selectedData.map((item) => item.value)
                setSelectedGroupData(selectedData)
                setSelectedGroupIds(numericIds)
                form.setFieldsValue({ groupIds: selectedData })
              }}
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Kontrakt to'lov miqdori</span>}
            name="contractAmounts"
          >
            <Form.List name="contractAmounts">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <div key={key} className="flex gap-3 mb-3">
                      <Form.Item {...rest} name={[name, "key"]} initialValue={`${name + 1}`} className="flex-1">
                        <Input disabled className="h-12 rounded-xl bg-gray-50 border-gray-200 border-[2px" />
                      </Form.Item>
                      <Form.Item
                        {...rest}
                        name={[name, "amount"]}
                        rules={[{ required: true, message: "Kontrakt miqdorini kiriting!" }]}
                        className="flex-2"
                      >
                        <InputNumber
                          min={0}
                          placeholder="Miqdori (UZS)"
                          prefix={<DollarOutlined className="text-gray-400" />}
                          className="w-full h-12 rounded-xl border-gray-200 border-[2px] focus:border-teal-400 transition-all duration-200"
                        />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item className="mb-0 mt-8">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isCreating || isUpdating}
              className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {update?.id ? "To'lov guruhini yangilash" : "To'lov guruhini yaratish"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  )
}

export default PmtGroupModal
