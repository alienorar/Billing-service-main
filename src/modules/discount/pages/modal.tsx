"use client"

import type React from "react"

import { Modal, Form, Input, Button, Select, message } from "antd"
import { useEffect, useState } from "react"
import { useCreateStudentsDiscounts, useUpdateStudentsDiscounts, useUploadDiscountReason } from "../hooks/mutations"
import type { StudentDiscount } from "@types"
import { UploadOutlined, DollarOutlined, FileTextOutlined, NumberOutlined } from "@ant-design/icons"

const { Option } = Select

const DiscountsModal = ({ open, handleClose, update }: any) => {
  const [form] = Form.useForm()
  const [reasonFileUuid, setReasonFileUuid] = useState<string | null>(null)
  const [initialFileInfo, setInitialFileInfo] = useState<string | null>(null)
  const { mutate: createMutate, isPending: isCreating } = useCreateStudentsDiscounts()
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateStudentsDiscounts()
  const { mutateAsync: uploadFile } = useUploadDiscountReason()

  const discountTypeOptions = [
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
        discountType: update.discountType,
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
    }
  }

  const onFinish = async (value: StudentDiscount) => {
    if (!reasonFileUuid) {
      message.error("Iltimos, sabab faylini yuklang!")
      return
    }

    const payload: StudentDiscount & { reasonFile: string } = {
      id: update?.id,
      studentId: value.studentId,
      description: value.description,
      discountType: value.discountType,
      studentLevel: value.studentLevel,
      amount: value.amount,
      reasonFile: reasonFileUuid,
    }

    if (update?.id) {
      updateMutate(payload, { onSuccess: handleClose })
    } else {
      createMutate(payload, { onSuccess: handleClose })
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <DollarOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {update?.id ? "Chegirmani tahrirlash" : "Yangi chegirma qo'shish"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {update?.id ? "Chegirma ma'lumotlarini yangilang" : "Yangi chegirma ma'lumotlarini kiriting"}
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={handleClose}
      footer={null}
      width={700}
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
      <Form form={form} name="discount_form" layout="vertical" onFinish={onFinish} className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="font-semibold text-gray-700">Student ID</span>}
            name="studentId"
            rules={[{ required: true, message: "Student ID sini kiriting!" }]}
          >
            <Input
              prefix={<NumberOutlined className="text-gray-400 border-gray-200 border-[2px]"  />}
              placeholder="Student ID sini kiriting"
              className="h-12 rounded-xl  focus:border-teal-400 focus:shadow-lg transition-all duration-200 border-gray-200 border-[2px]"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Tarif</span>}
            name="description"
            rules={[{ required: true, message: "Tarif nomini kiriting!" }]}
          >
            <Input
              prefix={<FileTextOutlined className="text-gray-400" />}
              placeholder="Tarif nomini kiriting"
              className="h-12 rounded-xl border-gray-200 border-[2px] focus:border-teal-400 focus:shadow-lg transition-all duration-200"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="font-semibold text-gray-700">Chegirma turi</span>}
            name="discountType"
            rules={[{ required: true, message: "Chegirma turini tanlang!" }]}
          >
            <Select
              placeholder="Chegirma turini tanlang"
              className="h-12 border-gray-200 border-[2px]"
              suffixIcon={<DollarOutlined className="text-gray-400" />}
            >
              {discountTypeOptions.map((type) => (
                <Option key={type.value} value={type.value}>
                  <div className="flex items-center gap-2 py-1">
                    <DollarOutlined className="text-teal-500" />
                    <span className="font-medium">{type.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-gray-700">Student kursi</span>}
            name="studentLevel"
            rules={[{ required: true, message: "Student kursini kiriting!" }]}
          >
            <Input
              type="number"
              prefix={<NumberOutlined className="text-gray-400" />}
              placeholder="Student kursini kiriting"
              className="h-12 rounded-xl  focus:border-teal-400 focus:shadow-lg transition-all duration-200 border-gray-200 border-[2px]"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Chegirma miqdori</span>}
          name="amount"
          rules={[{ required: true, message: "Chegirma miqdorini kiriting!" }]}
        >
          <Input
            type="number"
            prefix={<DollarOutlined className="text-gray-400" />}
            placeholder="Chegirma miqdorini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Fayl yuklash (Chegirma sababi)</span>}>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal-400 transition-colors duration-200">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-full flex items-center justify-center">
                  <UploadOutlined className="text-white text-xl" />
                </div>
                <span className="text-gray-600 font-medium">Faylni tanlash uchun bosing</span>
                <span className="text-sm text-gray-400">PDF, DOC, JPG, PNG formatlarida</span>
              </label>
            </div>

            {reasonFileUuid && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <FileTextOutlined className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Fayl muvaffaqiyatli yuklandi</p>
                    <code className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{reasonFileUuid}</code>
                  </div>
                </div>
              </div>
            )}

            {!reasonFileUuid && initialFileInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileTextOutlined className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-blue-700 font-medium">Avval yuklangan fayl</p>
                    <code className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">{initialFileInfo}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Form.Item>

        <Form.Item className="mb-0 mt-8">
          <Button
            block
            htmlType="submit"
            loading={isCreating || isUpdating}
            className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {update?.id ? "Chegirmani yangilash" : "Chegirma yaratish"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default DiscountsModal
