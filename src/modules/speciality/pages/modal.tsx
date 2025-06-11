import { Drawer, Form, Input, Button } from "antd";
import { useCreateSpeciality } from "../hooks/mutations";
import { SpecialityType } from "@types";

const SpecialityDrawer = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
    const [form] = Form.useForm();
    const { mutate: createMutate, isPending: isCreating } = useCreateSpeciality();

    const onFinish = async (values: SpecialityType) => {
        createMutate(values, { onSuccess: handleClose });
    };

    return (
        <Drawer
            title="Add New Speciality"
            placement="right"
            open={open}
            onClose={handleClose}
            width={600}
        >
            <Form form={form} name="speciality_form" layout="vertical" onFinish={onFinish}>
                <Form.Item label="Speciality Code" name="specialityCode" rules={[{ required: true, message: "Enter speciality code!" }]}>
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Speciality Name" name="specialityName" rules={[{ required: true, message: "Enter speciality name!" }]}>
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Contract Cost" name="contractCost">
                    <Input type="number" style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Contract Cost (In Letters)" name="contractCostInLetters">
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Duration" name="duration">
                    <Input type="number" style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Education Form" name="educationForm">
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Education Type" name="educationType">
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item label="Education Language" name="educationLang">
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item>
                    <Button block htmlType="submit" style={{ backgroundColor: "#050556", color: "white" }} loading={isCreating}>
                        Create Speciality
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default SpecialityDrawer;