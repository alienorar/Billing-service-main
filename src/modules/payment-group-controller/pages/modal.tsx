"use client"

import type React from "react"
import { Modal, Form, Input, Button, InputNumber, TreeSelect, Spin, Alert } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useState } from "react"
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
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]) // number[] ga o'zgartirdik
  const [selectedGroupData, setSelectedGroupData] = useState<{ value: number; label: string }[]>([]) // label bilan birga saqlash

  useEffect(() => {
    if (update?.id && groupList?.data) {
      // ==== EDIT MODE ====
      const contractAmounts = update.contractAmounts
          ? Object.entries(update.contractAmounts).map(([key, amount]) => ({ key, amount }))
          : []
      let groupIds: number[] = []
      let groupData: { value: number; label: string }[] = []

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

  // ──────────────────────────── HELPERS ───────────────────────────────
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

  // ───────────────────────────── SUBMIT ───────────────────────────────
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

  // ───────────────────────────── RENDER ───────────────────────────────
  if (isError) {
    return (
        <Alert
            message="Error"
            description={`Failed to load groups: ${errorInfo instanceof Error ? errorInfo.message : "Unknown error"}`}
            type="error"
            showIcon
            style={{ margin: 20 }}
        />
    )
  }

  return (
      <Modal
          title={update?.id ? "To'lov guruhini yangilash" : "To'lov guruhini yaratish"}
          open={modalOpen}
          onCancel={handleClose}
          footer={null}
          destroyOnClose
      >
        {isGroupsLoading ? (
            <Spin style={{ display: "block", margin: "20px auto" }} />
        ) : (
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              {/* NAME */}
              <Form.Item label="Nomi" name="name" rules={[{ required: true, message: "To'lov guruhini nomini kiriting" }]}>
                <Input placeholder="To'lov guruhini nomini kiriting" />
              </Form.Item>

              {/* DURATION */}
              <Form.Item
                  label="Muddati (yilda)"
                  name="duration"
                  rules={[{ required: true, message: "Muddatni kiriting!" }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} onChange={handleDurationChange} />
              </Form.Item>

              <Form.Item label="Guruhlar" name="groupIds">
                <TreeSelect<{ value: number; label: string }[]>
                    treeData={treeData}
                    multiple
                    treeCheckable
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    value={selectedGroupData}
                    placeholder="Guruhlarni tanlang"
                    style={{ width: "100%" }}
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
                      const numericIds = selectedData.map(item => item.value)
                      setSelectedGroupData(selectedData)
                      setSelectedGroupIds(numericIds)
                      form.setFieldsValue({ groupIds: selectedData })
                    }}
                />
              </Form.Item>

              {/* CONTRACT AMOUNTS */}
              <Form.Item label="Kontrakt to'lov miqdori" name="contractAmounts">
                <Form.List name="contractAmounts">
                  {(fields) => (
                      <>
                        {fields.map(({ key, name, ...rest }) => (
                            <div key={key} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                              <Form.Item {...rest} name={[name, "key"]} initialValue={`${name + 1}`} style={{ flex: 1 }}>
                                <Input disabled />
                              </Form.Item>
                              <Form.Item
                                  {...rest}
                                  name={[name, "amount"]}
                                  rules={[{ required: true, message: "Kontrakt miqdorini kiriting!" }]}
                                  style={{ flex: 2 }}
                              >
                                <InputNumber min={0} style={{ width: "100%" }} placeholder="Miqdori (UZS)" />
                              </Form.Item>
                            </div>
                        ))}
                      </>
                  )}
                </Form.List>
              </Form.Item>

              {/* SUBMIT BUTTON */}
              <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isCreating || isUpdating}
                    style={{
                      backgroundColor: "#050556",
                      color: "white",
                      height: "40px",
                      fontSize: "18px",
                      marginTop: "10px",
                      borderRadius: "6px",
                    }}
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