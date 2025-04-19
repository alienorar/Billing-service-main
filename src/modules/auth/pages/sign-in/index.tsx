import { Button, Form, Input } from 'antd';
import { useSignInMutation } from '../../hooks/mutations';

const Index: React.FC = () => {
  const { mutate } = useSignInMutation()

  const onFinish = async (values: any): Promise<void> => {
    const response = await (values)
    mutate(response)
 
  };

  return (
    <>
      <div className='flex items-center h-screen bg-gray-100 '>
        <div className='flex justify-center items-center w-full p-6 pt-20'>
          <Form
            name="sign_in"
            initialValues={{ remember: true }}
            style={{
              maxWidth: "600px",
              width: "340px",
              display: "flex",
              flexDirection: "column",
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
              <Input style={{ height: "40px", }} status='error' className='px-2 border-[1.5px]' />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              style={{ marginBottom: '8px' }}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password style={{ height: "40px" }} status='error' className='border-[1.5px] ' />
            </Form.Item>

            <Form.Item>
              <Button block htmlType="submit" style={{ backgroundColor: "#050556", color: "white", height: "40px", fontSize: "18px", marginTop: "10px" }}>
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Index;
