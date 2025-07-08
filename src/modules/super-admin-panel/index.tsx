"use client"

import { useState } from "react"
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, DownOutlined, UpOutlined } from "@ant-design/icons"
import { Button, Layout, Menu, Dropdown, theme } from "antd"
import { NavLink, useLocation, Outlet } from "react-router-dom"
import { getUserPermissions, logout } from "../../utils/token-service"
import MainLogo from "../../assets/otu-logo.png"
import LogoText from "../../assets/logo-text.png"
import { routesConfig } from "../../router/routes"

const { Header, Sider, Content } = Layout


const AdminPanel = () => {
  const [collapsed, setCollapsed] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false);
  // const navigate = useNavigate()
  const { pathname } = useLocation()
  const permissions = getUserPermissions()

  // Helper function to check permissions
  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true
    return requiredPermissions.every((perm) => permissions.includes(perm))
  }

  // Filter routes to show only those with permissions and showInSidebar: true
  const accessibleRoutes = routesConfig.filter((item) => item.showInSidebar && hasPermission(item.permissions))

  const handleLogout = () => {
    logout();
  }

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const Firstname = localStorage.getItem("Firstname")
  const Lastname = localStorage.getItem("Lastname")


  const menu = (
    <Menu className="px-3 mr-4">
      <Menu.Item className="font-semibold text-lg text-red-800" key="logout" icon={<LogoutOutlined style={{ fontSize: "16px" }} />} onClick={handleLogout}>
        Chiqish
      </Menu.Item>
    </Menu>
  );



  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={290}>
        <div className="demo-logo-vertical" />
        <div className="flex pl-8 items-center p-4 gap-2 font-semibold mb-2">
          <img src={MainLogo || "/placeholder.svg"} alt="main-logo" className="w-[30px] h-[30px] object-cover" />
          {!collapsed && (
            <img
              src={LogoText || "/placeholder.svg"}
              className="text-[20px] text-[#fff] object-contain w-[80px] h-[40px] flex"
              alt="img"
            />
          )}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} style={{ borderRight: 0 }}>
          {accessibleRoutes.map((item) => {
            if (item.children && item.children.length > 0) {
              return (
                <Menu.SubMenu
                  key={item.label}
                  title={item.label}
                  icon={item.icon}
                >
                  {item.children
                    .filter(child => hasPermission(child.permissions))
                    .map(child => {
                      const fullPath = `/super-admin-panel/${child.path}`
                      return (
                        <Menu.Item key={fullPath} icon={child.icon}>
                          <NavLink state={{
                            display: "flex",
                            gap: "10px"
                          }} to={fullPath}>{child.label}</NavLink>
                        </Menu.Item>
                      )
                    })}
                </Menu.SubMenu>
              )
            }

            // Parent route uchun
            const fullPath = `/super-admin-panel/${item.path}`

            return (
              <Menu.Item key={fullPath} icon={item.icon}>
                <NavLink to={fullPath}>{item.label}</NavLink>
              </Menu.Item>
            )
          })}
        </Menu>

      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between px-3 items-center">

            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="flex h-9 justify-end p-3 items-center  text-blact mr-5">
              <Dropdown overlay={menu} trigger={['click']} onOpenChange={setMenuOpen}>
                <div className="cursor-pointer flex items-center gap-[6px] text-[#050556]">
                  <UserOutlined style={{ fontSize: "18px", width: "35px", height: "35px", backgroundColor: "#3333", borderRadius: "50%", display: "flex", justifyContent: "center", color: "#212121" }} />
                  <span className="uppercase font-bold">{Firstname} {Lastname}</span>
                  <span style={{ fontSize: "16px", marginLeft: "4px" }}>
                    {menuOpen ? <UpOutlined style={{ color: "#212121" }} /> : <DownOutlined style={{ color: "#212121" }} />}
                  </span>

                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
            minHeight: "100vh",
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminPanel