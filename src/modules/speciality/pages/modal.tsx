import { Drawer, Form, Input, Button} from "antd";
import { useEffect } from "react";
import { useCreateSpeciality, useUpdateSpeciality } from "../hooks/mutations";
import { SpecialityType } from "@types";

const SpecialityDrawer = ({ open, handleClose, update }: any) => {
    const [form] = Form.useForm();
    const { mutate: createMutate, isPending: isCreating } = useCreateSpeciality();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdateSpeciality();

    useEffect(() => {
        console.log(
            update,"jkdbjkfbdbvj"
        );
        
        if (update?.specialityCode) {
            form.setFieldsValue({
                id: update.id,
                specialityCode: update.specialityCode,
                specialityName: update.specialityName,
                contractCost: update.contractCost,
                contractCostInLetters: update.contractCostInLetters,
                duration: update.duration,
                educationForm: update.educationForm,
                educationType: update.educationType,
                educationLang: update.educationLang,
            });
        } else {
            form.resetFields();
        }
    }, [update, form]);

    const onFinish = async (values: SpecialityType) => {
        const payload = {
            ...values,
            id: update.id,
        };

        if (update?.specialityCode) {
            updateMutate(payload, { onSuccess: handleClose });
        } else {
            createMutate(payload, { onSuccess: handleClose });
        }
    };

    return (
        <Drawer
            title={update?.specialityCode ? "Edit Speciality" : "Add New Speciality"}
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
                    <Button block htmlType="submit" style={{ backgroundColor: "#050556", color: "white" }} loading={isCreating || isUpdating}>
                        {update?.specialityCode ? "Update Speciality" : "Create Speciality"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default SpecialityDrawer;
