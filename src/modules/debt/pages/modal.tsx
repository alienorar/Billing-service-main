"use client"

import type React from "react"

import { Modal, Form, Input, Button, Select, message } from "antd"
import { useEffect, useState } from "react"
import { useCreateDebtList, useUpdateDebtList, useUploadDebtReason } from "../hooks/mutations"

const { Option } = Select

interface Debt {
  id?: number
  studentId: number
  description: string
  reasonFile: string
  debtType: string
  studentLevel: number
  amount: number
}

const DebtsModal = ({ open, handleClose, update, studentId }: any) => {
  const [form] = Form.useForm()
  const [reasonFileUuid, setReasonFileUuid] = useState<string | null>(null)
  const [initialFileInfo, setInitialFileInfo] = useState<string | null>(null)
  const { mutate: createMutate, isPending: isCreating } = useCreateDebtList()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateDebtList()
  const { mutateAsync: uploadFile } = useUploadDebtReason()

  const debtTypeOptions = [
    {
      value: "SUM",
      label: "Sum",
    },
  ]

  // Forma qiymatlari va fayl ma'lumotlarini sozlash
  useEffect(() => {
    if (update?.id) {
      form.setFieldsValue({
        studentId: update.studentId,
        description: update.description,
        debtType: update.debtType,
        studentLevel: update.studentLevel,
        amount: update.amount,
      })
      const reason = update.reasonFile || null
      setReasonFileUuid(reason)
      setInitialFileInfo(reason)
    } else {
      form.resetFields()
      setReasonFileUuid(null)
      setInitialFileInfo(null)
    }
  }, [update, form])

  // Modal yopilganda fayl ma'lumotlarini tozalash
  useEffect(() => {
    if (!open) {
      setReasonFileUuid(null)
      setInitialFileInfo(null)
    }
  }, [open])

  // Faylni serverga yuklash
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await uploadFile(formData)
      const uuid = response?.uuid || response?.data?.uuid
      if (!uuid) throw new Error("Fayl yuklandi, lekin uuid topilmadi.")
      setReasonFileUuid(uuid)
      setInitialFileInfo(null) // Eski faylni yashirish
      message.success("Fayl muvaffaqiyatli yuklandi.")
    } catch (error) {
      console.error("Fayl yuklashda xatolik:", error)
      message.error("Fayl yuklashda xatolik yuz berdi.")
    }
  }

  const onFinish = async (value: Debt) => {
    if (!reasonFileUuid) {
      message.error("Iltimos, qarz sabab faylini yuklang!")
      return
    }

    const payload: Debt & { reasonFile: string } = {
      ...(update?.id && { id: update.id }),
      studentId: studentId,
      description: value.description,
      debtType: value.debtType,
      studentLevel: value.studentLevel,
      amount: value.amount,
      reasonFile: reasonFileUuid,
    }

    if (update?.id) {
      updateMutate(payload, { onSuccess: handleClose })
    } else {
      const { id, ...createPayload } = payload
      createMutate(createPayload, { onSuccess: handleClose })
    }
  }

  return (
    <Modal
      title={
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 -m-6 mb-6 p-6 rounded-t-2xl">
          <h3 className="text-white text-xl font-semibold m-0">
            {update?.id ? "Qarzni Tahrirlash" : "Yangi Qarz Qo'shish"}
          </h3>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      className="rounded-2xl overflow-hidden"
      width={600}
    >
      <div className="p-6">
        <Form form={form} name="debt_form" layout="vertical" onFinish={onFinish} className="space-y-6">
          <Form.Item
            label={<span className="text-gray-700 font-medium">Tavsif</span>}
            name="description"
            rules={[{ required: true, message: "Tavsifni kiriting!" }]}
          >
            <Input
              className="rounded-lg border-gray-200 border-[2px] focus:border-teal-500 focus:ring-teal-500 h-12"
              placeholder="Qarz tavsifini kiriting"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Qarz turi</span>}
            name="debtType"
            rules={[{ required: true, message: "Qarz turini tanlang!" }]}
          >
            <Select placeholder="Qarz turini tanlang" className="rounded-lg h-12 border-gray-200 border-[2px]">
              {debtTypeOptions.map((type) => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Student kursi</span>}
            name="studentLevel"
            rules={[{ required: true, message: "Student kursini kiriting!" }]}
          >
            <Input
              type="number"
              className="rounded-lg border-gray-200 border-[2px] focus:border-teal-500 focus:ring-teal-500 h-12"
              placeholder="Kurs raqamini kiriting"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-gray-700 font-medium">Qarz miqdori</span>}
            name="amount"
            rules={[{ required: true, message: "Qarz miqdorini kiriting!" }]}
          >
            <Input
              type="number"
              className="rounded-lg border-gray-200 border-[2px] focus:border-teal-500 focus:ring-teal-500 h-12"
              placeholder="Miqdorni kiriting (UZS)"
            />
          </Form.Item>

          <Form.Item label={<span className="text-gray-700 font-medium">Fayl yuklash (Qarz sababi)</span>}>
            <Input
              type="file"
              onChange={handleFileChange}
              className="rounded-lg  focus:border-teal-500 focus:ring-teal-500 h-12"
            />
            {reasonFileUuid && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✅ Fayl yuklandi: <code className="bg-green-100 px-2 py-1 rounded">{reasonFileUuid}</code>
                </p>
              </div>
            )}
            {!reasonFileUuid && initialFileInfo && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  📎 Avval yuklangan fayl: <code className="bg-blue-100 px-2 py-1 rounded">{initialFileInfo}</code>
                </p>
              </div>
            )}
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              block
              htmlType="submit"
              loading={isCreating || isUpdating}
              className="bg-gradient-to-r from-teal-600 to-blue-600 border-0 hover:from-teal-700 hover:to-blue-700 rounded-lg h-12 text-lg font-medium transition-all duration-300 text-white"
            >
              {update?.id ? "Qarzni Yangilash" : "Qarz Qo'shish"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default DebtsModal
