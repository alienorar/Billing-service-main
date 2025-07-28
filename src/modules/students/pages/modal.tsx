"use client"

import type React from "react"

import { Modal, Form, Upload, Button, message, type UploadFile } from "antd"
import { UploadOutlined, FileExcelOutlined, CloudUploadOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useSyncStudents } from "../hooks/mutations"

interface UploadStudentDataModalProps {
  open: boolean
  onClose: () => void
}

const UploadStudentDataModal: React.FC<UploadStudentDataModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { mutate: uploadStudents, isPending: uploadingFile } = useSyncStudents()

  const handleUpload = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList)
  }

  const onFinish = async () => {
    if (fileList.length === 0) {
      message.warning("Fileni tanlang!")
      return
    }
    const formData = new FormData()
    formData.append("file", fileList[0].originFileObj as File)
    uploadStudents(formData)
    onClose()
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <CloudUploadOutlined className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Studentlar ma'lumotlarini yuklash</h3>
            <p className="text-sm text-gray-500 mt-1">Excel fayl orqali studentlar ma'lumotlarini yangilang</p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
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
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
        <Form.Item
          label={<span className="font-semibold text-gray-700">Excel fayl yuklash</span>}
          name="file"
          rules={[{ required: true, message: "Iltimos, fayl yuklang!" }]}
        >
          <Upload.Dragger
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUpload}
            accept=".xlsx,.xls"
            className="border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-400 transition-colors duration-200"
            style={{
              background: "#fafafa",
            }}
          >
            <div className="py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileExcelOutlined className="text-white text-2xl" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Faylni bu yerga tashlang yoki tanlash uchun bosing
              </p>
              <p className="text-sm text-gray-500">Faqat Excel fayllari (.xlsx, .xls) qo'llab-quvvatlanadi</p>
            </div>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item className="mb-0 mt-8">
          <Button
            block
            htmlType="submit"
            loading={uploadingFile}
            className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            icon={<UploadOutlined />}
          >
            {uploadingFile ? "Yuklanmoqda..." : "Faylni yuklash"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UploadStudentDataModal
