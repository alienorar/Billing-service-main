import { Modal, Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
import { AdminModalType, AdminType } from "@types";
import { useCreateStudentsDiscounts } from "../hooks/mutations";

const { Option } = Select;

const DiscountsModal = ({ open, handleClose, update, roles }: AdminModalType) => {
    const [form] = Form.useForm();
    const { mutate: createMutate, isPending: isCreating } = useCreateStudentsDiscounts();
    // const { mutate: updateMutate, isPending: isUpdating } = useUpdateAdmin();

    useEffect(() => {
        if (update?.id) {
            form.setFieldsValue({
                roleId: update.roleId,
                username: update.username,
                phone: update.phone,
                firstName: update.firstName,
                lastName: update.lastName,
            
            });
        } else {
            form.resetFields();
        }
    }, [update, form]);

    const onFinish = async (value: AdminType) => {
        const payload: any = {
            id:update?.id,
            roleId: value.roleId,
            username: value.username,
            phone: value.phone,
            firstName: value.firstName,
            lastName: value.lastName,
        };

        // if (update?.id) {
        //     updateMutate(payload, { onSuccess: handleClose });
        // } else {
            createMutate(payload, { onSuccess: handleClose });
        // }
    };

    return (
        <Modal
            title={update?.roleId ? "Edit Admin" : "Add New Admin"}
            open={open}
            onCancel={handleClose}
            footer={null}
        >
            <Form form={form} name="admin_form" layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Enter username!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: "Enter phone number!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Enter first name!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Enter last name!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="roleId"
                    rules={[{ required: true, message: "Select a role!" }]}
                >
                    <Select placeholder="Select role"
                        style={{ padding: "5px", borderRadius: "6px", border: "1px solid #d9d9d9" }}>
                        {roles?.map((role: any) => (
                            <Option key={role.id} value={role.id}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        htmlType="submit"
                        loading={isCreating}
                        style={{
                            backgroundColor: "#050556",
                            color: "white",
                            height: "40px",
                            fontSize: "18px",
                            marginTop: "10px",
                            borderRadius: "6px",
                        }}
                    >
                        {update?.id ? "Update Admin" : "Create Admin"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DiscountsModal;
