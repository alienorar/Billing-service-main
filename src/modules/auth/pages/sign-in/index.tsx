"use client"

import type React from "react"
import { Button, Form, Input, Card } from "antd"
import { UserOutlined, LockOutlined, LoginOutlined, FieldTimeOutlined } from "@ant-design/icons"
import { useSignInMutation } from "../../hooks/mutations"
// import MoneyIcon from "../../../../assets/money-icon.webp"

const Index: React.FC = () => {
  const { mutate } = useSignInMutation()

  const onFinish = async (values: any): Promise<void> => {
    const response = await values
    mutate(response)
  }

  return (
    <div className="min-h-screen  bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-violet-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-violet-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header Section */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FieldTimeOutlined className="text-3xl text-white" />
            {/* <img src={MoneyIcon} alt="money" className="rounded-full h-50 w-40"/> */}
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Xush kelibsiz</h1>
          <p className="text-gray-600 text-lg">Admin panelga kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        {/* Login Form */}
        <Card
          className="bg-white rounded-3xl shadow-2xl border-0 overflow-hidden"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          bodyStyle={{ padding: "40px" }}
        >
          <Form
            name="sign_in"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              label={<span className="text-gray-700 font-semibold text-base">Username</span>}
              name="username"
              rules={[{ required: true, message: "Username kiriting!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-lg" />}
                placeholder="Username kiriting"
                className="h-14 rounded-xl border-gray-200 focus:border-blue-500 focus:shadow-lg transition-all duration-200 text-base"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-semibold text-base">Parol</span>}
              name="password"
              rules={[{ required: true, message: "Parol kiriting!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Parol kiriting"
                className="h-14 rounded-xl border-gray-200 focus:border-blue-500 focus:shadow-lg transition-all duration-200 text-base"
              />
            </Form.Item>

            <Form.Item className="mb-0 mt-8">
              <Button
                block
                htmlType="submit"
                className="h-14 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white"
                icon={<LoginOutlined className="text-lg" />}
              >
                Tizimga kirish
              </Button>
            </Form.Item>
          </Form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Parolingizni unutdingizmi?
              <span className="text-blue-600 hover:text-blue-700 cursor-pointer ml-2 underline font-medium transition-colors duration-200">
               <a href="https://t.me/aytishnikbachcha">Yordam olish</a>
              </span>
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">© 2024 Admin Panel. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </div>
  )
}

export default Index
