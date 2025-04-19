import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LoginOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu,Popconfirm, theme } from 'antd';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { adminRights } from '../../router/routes';
import MainLogo from '../../assets/otu-logo.png';
import { logout } from '../../utils/token-service';
import LogoText from '../../assets/logo-text.png'


const { Header, Sider, Content } = Layout;
const { Item } = Menu;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();


    const handleLogout = () => {
        navigate('/');
        logout()
    };


    const handleLogoutOk = () => {
        handleLogout();
    };



    const {
        token: { colorBgContainer, borderRadiusLG, },
    } = theme.useToken();

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} width={260}>
                <div className="demo-logo-vertical" />
                <div className='flex pl-8 items-center p-4 gap-2 font-semibold mb-2'>
                    <img src={MainLogo} alt="main-logo" className='w-[30px] h-[30px] object-cover' />
                    {
                        !collapsed && (<img src={LogoText} className='text-[20px] text-[#fff] object-contain w-[80px] h-[40px] flex'/>)
                    }
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[pathname]}>
                    {adminRights?.map((item) => (
                        <Item key={item.path} icon={item.icon}>
                            <NavLink to={item.path} style={{ fontSize: '18px' }}>
                                {item.label}
                            </NavLink>
                        </Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <div className='flex justify-between px-3 items-center'>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Popconfirm
                            title="Are you sure you want to upload students?"
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
                        margin: '0 16px',
                        minHeight: '100vh',
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
