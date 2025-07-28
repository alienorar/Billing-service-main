"use client"

import { Drawer, Form, Input, Button } from "antd"
import { BookOutlined, CodeOutlined, DollarOutlined, ClockCircleOutlined, GlobalOutlined } from "@ant-design/icons"
import { useCreateSpeciality } from "../hooks/mutations"
import type { SpecialityType } from "@types"

const SpecialityDrawer = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [form] = Form.useForm()
  const { mutate: createMutate, isPending: isCreating } = useCreateSpeciality()

  const onFinish = async (values: SpecialityType) => {
    createMutate(values, { onSuccess: handleClose })
  }

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 via-sky-400 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
            <BookOutlined className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-0">Yangi Mutaxasislik</h3>
            <p className="text-sm text-gray-500 mb-0">Yangi mutaxasislik ma'lumotlarini kiriting</p>
          </div>
        </div>
      }
      placement="right"
      open={open}
      onClose={handleClose}
      width={650}
      className="rounded-l-2xl"
      styles={{
        body: {
          padding: "24px",
          background:
            "linear-gradient(135deg, rgba(45, 212, 191, 0.02) 0%, rgba(56, 189, 248, 0.02) 50%, rgba(30, 64, 175, 0.02) 100%)",
        },
        header: {
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        },
      }}
    >
      <Form form={form} name="speciality_form" layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.Item
          label={<span className="font-semibold text-gray-700">Mutaxasislik kodi</span>}
          name="specialityCode"
          rules={[{ required: true, message: "Mutaxasislik kodini kiriting!" }]}
        >
          <Input
            prefix={<CodeOutlined className="text-teal-500" />}
            placeholder="Mutaxasislik kodini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Mutaxasislik nomi</span>}
          name="specialityName"
          rules={[{ required: true, message: "Mutaxasislik nomini kiriting!" }]}
        >
          <Input
            prefix={<BookOutlined className="text-teal-500" />}
            placeholder="Mutaxasislik nomini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Shartnoma narxi</span>} name="contractCost">
          <Input
            type="number"
            prefix={<DollarOutlined className="text-teal-500" />}
            placeholder="Shartnoma narxini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item
          label={<span className="font-semibold text-gray-700">Shartnoma narxi (harflar bilan)</span>}
          name="contractCostInLetters"
        >
          <Input
            prefix={<DollarOutlined className="text-teal-500" />}
            placeholder="Shartnoma narxini harflar bilan kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Davomiyligi</span>} name="duration">
          <Input
            type="number"
            prefix={<ClockCircleOutlined className="text-teal-500" />}
            placeholder="Davomiyligini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Ta'lim shakli</span>} name="educationForm">
          <Input
            prefix={<BookOutlined className="text-teal-500" />}
            placeholder="Ta'lim shaklini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Ta'lim turi</span>} name="educationType">
          <Input
            prefix={<BookOutlined className="text-teal-500" />}
            placeholder="Ta'lim turini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item label={<span className="font-semibold text-gray-700">Ta'lim tili</span>} name="educationLang">
          <Input
            prefix={<GlobalOutlined className="text-teal-500" />}
            placeholder="Ta'lim tilini kiriting"
            className="h-12 rounded-xl border-gray-200 focus:border-teal-400 focus:shadow-lg transition-all duration-200"
          />
        </Form.Item>

        <Form.Item className="mt-8">
          <Button
            block
            htmlType="submit"
            loading={isCreating}
            className="h-14 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 border-0 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Mutaxasislik yaratish
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default SpecialityDrawer
