import { Modal, Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
import { useCreateStudentsDiscounts, useUpdateStudentsDiscounts } from "../hooks/mutations";
import { StudentDiscount } from "@types";

const { Option } = Select;

const DiscountsModal = ({ open, handleClose, update, studentId }: any) => {
    const [form] = Form.useForm();
    const { mutate: createMutate, isPending: isCreating } = useCreateStudentsDiscounts();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdateStudentsDiscounts();

    const discountTypeOptions = [
        {
            value: "SUM", label: "Sum"
        }
    ]
    useEffect(() => {
        if (update?.id) {
            form.setFieldsValue({
                studentId: update.studentId,
                description: update.description,
                discountType: update.discountType,
                studentLevel: update.studentLevel,
                amount: update.amount,

            });
        } else {
            form.resetFields();
        }
    }, [update, form]);

    const onFinish = async (value:StudentDiscount) => {
        const payload:StudentDiscount = {
            id: update?.id,
            studentId: studentId,
            description: value.description,
            discountType: value.discountType,
            studentLevel: value.studentLevel,
            amount: value.amount,
        };

        if (update?.id) {
            updateMutate(payload, { onSuccess: handleClose });
        } else {
            createMutate(payload, { onSuccess: handleClose });
        }
    };

    return (
        <Modal
            title={update?.roleId ? "Edit Admin" : "Add New Admin"}
            open={open}
            onCancel={handleClose}
            footer={null}
        >
            <Form form={form} name="transaction_form" layout="vertical" onFinish={onFinish}>


                <Form.Item
                    label="Tarif"
                    name="description"
                    rules={[{ required: true, message: "Enter description!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Chegirma turi"
                    name="discountType"
                    rules={[{ required: true, message: "Chegirma turini kiriting !" }]}
                >
                    <Select placeholder="Chegirma turini tanlang"
                        style={{ padding: "5px", borderRadius: "6px", border: "1px solid #d9d9d9" }}>
                        {discountTypeOptions?.map((type: any) => (
                            <Option key={type.label} value={type.value}>
                                {type.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Student kursi"
                    name="studentLevel"
                    rules={[{ required: true, message: "Enter last name!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Chegirma miqdori"
                    name="amount"
                    rules={[{ required: true, message: "Select a role!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />

                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        htmlType="submit"
                        loading={isCreating || isUpdating}
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
