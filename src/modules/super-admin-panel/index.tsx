
"use client"

import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Popconfirm, theme } from "antd";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { getUserPermissions } from "../../utils/token-service";
import MainLogo from "../../assets/otu-logo.png";
import LogoText from "../../assets/logo-text.png";
import { logout } from "../../utils/token-service";
import { routesConfig } from "../../router/routes";

const { Header, Sider, Content } = Layout;
const { Item } = Menu;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const permissions = getUserPermissions();

  // Helper function to check permissions
  const hasPermission = (requiredPermissions: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.every((perm) => permissions.includes(perm));
  };

  // Filter routes to show only those with permissions and showInSidebar: true
  const accessibleRoutes = routesConfig.filter(
    (item) => item.showInSidebar && hasPermission(item.permissions)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoutOk = () => {
    handleLogout();
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
        <div className="demo-logo-vertical" />
        <div className="flex pl-8 items-center p-4 gap-2 font-semibold mb-2">
          <img
            src={MainLogo}
            alt="main-logo"
            className="w-[30px] h-[30px] object-cover"
          />
          {!collapsed && (
            <img
              src={LogoText}
              className="text-[20px] text-[#fff] object-contain w-[80px] h-[40px] flex"
            />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          style={{ borderRight: 0 }}
        >
          {accessibleRoutes.map((item) => (
            <Item
              key={item.path}
              icon={
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 ${
                    pathname === item.path ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>
              }
              className="group"
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block w-full text-[18px] no-underline transition-colors duration-200 py-2 px-4  items-center ${
                    isActive
                      ? "text-sky-500 bg-[#001529] font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-[#1f1f1f]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            </Item>
          ))}
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
            <Popconfirm
              title="Are you sure you want to logout?"
              onConfirm={handleLogoutOk}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                style: {
                  backgroundColor: "green",
                  borderColor: "green",
                  marginLeft: "10px",
                  padding: "6px 16px",
                },
              }}
              cancelButtonProps={{
                style: {
                  backgroundColor: "red",
                  borderColor: "red",
                  color: "white",
                  padding: "6px 16px",
                },
              }}
            >
              <Button
                type="text"
                icon={<LoginOutlined />}
                style={{
                  fontSize: "18px",
                  width: 84,
                  height: 44,
                  marginRight: 30,
                  fontFamily: "monospace",
                }}
              >
                Logout
              </Button>
            </Popconfirm>
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
  );
};

export default App;
