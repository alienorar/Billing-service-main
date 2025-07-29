"use client"

import { useState } from "react"
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons"
import { Button, Layout, Menu, Dropdown, Avatar } from "antd"
import { NavLink, useLocation, Outlet } from "react-router-dom"
import { getUserPermissions, logout } from "../../utils/token-service"
import MainLogo from "../../assets/otu-logo.png"
import { routesConfig } from "../../router/routes"

const { Header, Sider, Content } = Layout

const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const permissions = getUserPermissions()

  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    return requiredPermissions.every((perm) => permissions.includes(perm))
  }

  const accessibleRoutes = routesConfig.filter((item) => item.showInSidebar && hasPermission(item.permissions))

  const handleLogout = () => {
    logout()
  }

  const Firstname = localStorage.getItem("Firstname")
  const Lastname = localStorage.getItem("Lastname")
  const accessToken = localStorage.getItem("accessToken")

  const menu = (
    <Menu className="px-2 bg-white rounded-2xl shadow-2xl border-0 min-w-[200px]">
      <Menu.Item
        className="font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl m-2 h-12 flex items-center transition-all duration-200"
        key="logout"
        icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
        onClick={handleLogout}
      >
        Chiqish
      </Menu.Item>
    </Menu>
  )

  if (accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Layout className="min-h-screen bg-transparent">
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={280}
            className="bg-gradient-to-b from-blue-600 to-violet-600 shadow-2xl border-r-0"
            style={{
              background: "linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Logo Section */}
            <div className="flex items-center px-6 py-6 gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img src={MainLogo || "/placeholder.svg"} alt="logo" className="w-6 h-6 object-cover" />
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">Admin Panel</span>
                  <span className="text-white/70 text-sm">HEMIS tizimi</span>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              className="bg-transparent border-0 px-4"
              style={{
                borderRight: 0,
                background: "transparent",
              }}
            >
              {accessibleRoutes.map((item) => {
                if (item.children && item.children.length > 0) {
                  return (
                    <Menu.SubMenu
                      key={item.label}
                      title={<span className="text-white/90 font-medium">{item.label}</span>}
                      icon={<span className="text-white/80">{item.icon}</span>}
                      className="mb-2"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        margin: "4px 0",
                      }}
                    >
                      {item.children
                        .filter((child) => hasPermission(child.permissions))
                        .map((child) => {
                          const fullPath = `/super-admin-panel/${child.path}`
                          return (
                            <Menu.Item
                              key={fullPath}
                              icon={<span className="text-white/70">{child.icon}</span>}
                              className="ml-4 rounded-lg"
                              style={{
                                backgroundColor: pathname === fullPath ? "rgba(255, 255, 255, 0.2)" : "transparent",
                                borderRadius: "8px",
                                margin: "2px 0",
                              }}
                            >
                              <NavLink to={fullPath} className="text-white/80 hover:text-white">
                                {child.label}
                              </NavLink>
                            </Menu.Item>
                          )
                        })}
                    </Menu.SubMenu>
                  )
                }

                const fullPath = `/super-admin-panel/${item.path}`
                const isActive = pathname === fullPath
                return (
                  <Menu.Item
                    key={fullPath}
                    icon={<span className="text-white/80">{item.icon}</span>}
                    className="mb-2 rounded-xl"
                    style={{
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      borderRadius: "12px",
                      margin: "4px 0",
                      height: "48px",
                      lineHeight: "48px",
                      borderLeft: isActive ? "4px solid rgba(255, 255, 255, 0.8)" : "none",
                    }}
                  >
                    <NavLink to={fullPath} className="text-white/90 hover:text-white font-medium">
                      {item.label}
                    </NavLink>
                  </Menu.Item>
                )
              })}
            </Menu>

            {/* User Profile Section */}
            {!collapsed && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <Avatar size={40} className="bg-white/20 text-white font-bold" icon={<UserOutlined />} />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold text-sm truncate">
                        {Firstname} {Lastname}
                      </div>
                      <div className="text-white/70 text-xs">O'qituvchi</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Sider>

          <Layout className="bg-transparent">
            {/* Header */}
            <Header
              className="bg-white shadow-sm border-b border-gray-100"
              style={{
                padding: 0,
                background: "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex justify-between items-center h-full px-6">
                <div className="flex items-center gap-4">
                  <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 border-0 transition-all duration-200 rounded-lg w-10 h-10"
                    style={{ fontSize: "18px" }}
                  />
                </div>

                <div className="flex items-center gap-4">
                  {/* <Button
                    type="text"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-0 rounded-full w-10 h-10"
                    icon={<span className="text-lg">🌙</span>}
                  /> */}

                  <Dropdown overlay={menu} trigger={["click"]} onOpenChange={setMenuOpen} placement="bottomRight">
                    <div className="cursor-pointer flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-xl transition-all duration-200">
                      <Avatar
                        size={36}
                        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold"
                        icon={<UserOutlined />}
                      />
                      <div className="flex flex-col items-start">
                        <span className="font-semibold text-gray-800 text-sm">
                          {Firstname} {Lastname}
                        </span>
                        <span className="text-xs text-gray-500">Administrator</span>
                      </div>
                      <span className="ml-2">
                        {menuOpen ? (
                          <UpOutlined style={{ color: "#6b7280", fontSize: "12px" }} />
                        ) : (
                          <DownOutlined style={{ color: "#6b7280", fontSize: "12px" }} />
                        )}
                      </span>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </Header>

            {/* Main Content */}
            <Content
              className="m-6 bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-3xl shadow-xl overflow-hidden"
              style={{
                minHeight: "calc(100vh - 112px)",
                background: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #2563eb 100%)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="h-full p-8 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full ">
                  <Outlet />
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    )
  }

  return null
}

export default AdminPanel
