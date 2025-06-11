import { Button, Form, Input } from 'antd';
import { useSignInMutation } from '../../hooks/mutations';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../utils/auth-context';

const SignIn: React.FC = () => {
  const { mutate } = useSignInMutation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/super-admin-panel'; 

  const onFinish = async (values: any): Promise<void> => {
    mutate(values, {
      onSuccess: (response) => {
        login(response.accessToken); 
        navigate(from, { replace: true }); 
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <div className="flex items-center h-screen bg-gray-100">
      <div className="flex justify-center items-center w-full p-6 pt-20">
        <Form
          name="sign_in"
          initialValues={{ remember: true }}
          style={{
            maxWidth: '600px',
            width: '340px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: '8px' }}
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input style={{ height: '40px' }} className="px-2 border-[1.5px]" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            style={{ marginBottom: '8px' }}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password style={{ height: '40px' }} className="border-[1.5px]" />
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              style={{
                backgroundColor: '#050556',
                color: 'white',
                height: '40px',
                fontSize: '18px',
                marginTop: '10px',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignIn;