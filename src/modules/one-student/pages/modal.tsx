import { Modal, Form, Input, Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import {
    useCreateStudentsDiscounts,
    useUpdateStudentsDiscounts,
    useUploadDiscountReason
} from "../hooks/mutations";
import { StudentDiscount } from "@types";

const { Option } = Select;

const DiscountsModal = ({ open, handleClose, update, studentId }: any) => {
    const [form] = Form.useForm();
    const [reasonFileUuid, setReasonFileUuid] = useState<string | null>(null);
    const [initialFileInfo, setInitialFileInfo] = useState<string | null>(null);

    const { mutate: createMutate, isPending: isCreating } = useCreateStudentsDiscounts();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdateStudentsDiscounts();
    const { mutateAsync: uploadFile } = useUploadDiscountReason();

    const discountTypeOptions = [
        {
            value: "SUM",
            label: "Sum",
        },
    ];

    // Forma qiymatlari va fayl ma'lumotlarini sozlash
    useEffect(() => {
        if (update?.id) {
            form.setFieldsValue({
                studentId: update.studentId,
                description: update.description,
                discountType: update.discountType,
                studentLevel: update.studentLevel,
                amount: update.amount,
            });

            const reason = update.reasonFile || null;
            setReasonFileUuid(reason);
            setInitialFileInfo(reason);
        } else {
            form.resetFields();
            setReasonFileUuid(null);
            setInitialFileInfo(null);
        }
    }, [update, form]);

    // Modal yopilganda fayl ma'lumotlarini tozalash
    useEffect(() => {
        if (!open) {
            setReasonFileUuid(null);
            setInitialFileInfo(null);
        }
    }, [open]);

    // Faylni serverga yuklash
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await uploadFile(formData);
            const uuid = response?.uuid || response?.data?.uuid;

            if (!uuid) throw new Error("Fayl yuklandi, lekin uuid topilmadi.");

            setReasonFileUuid(uuid);
            setInitialFileInfo(null); // Eski faylni yashirish
            message.success("Fayl muvaffaqiyatli yuklandi.");
        } catch (error) {
            console.error("Fayl yuklashda xatolik:", error);
            message.error("Fayl yuklashda xatolik yuz berdi.");
        }
    };

    const onFinish = async (value: StudentDiscount) => {
        if (!reasonFileUuid) {
            message.error("Iltimos, sabab faylini yuklang!");
            return;
        }

        const payload: StudentDiscount & { reasonFile: string } = {
            id: update?.id,
            studentId: studentId,
            description: value.description,
            discountType: value.discountType,
            studentLevel: value.studentLevel,
            amount: value.amount,
            reasonFile: reasonFileUuid,
        };

        if (update?.id) {
            updateMutate(payload, { onSuccess: handleClose });
        } else {
            createMutate(payload, { onSuccess: handleClose });
        }
    };

    return (
        <Modal
            title={update?.id ? "Edit Discount" : "Add New Discount"}
            open={open}
            onCancel={handleClose}
            footer={null}
        >
            <Form form={form} name="discount_form" layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Tarif"
                    name="description"
                    rules={[{ required: true, message: "Tarif nomini kiriting!" }]}
                >
                    <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
                </Form.Item>

                <Form.Item
                    label="Chegirma turi"
                    name="discountType"
                    rules={[{ required: true, message: "Chegirma turini tanlang!" }]}
                >
                    <Select
                        placeholder="Chegirma turini tanlang"
                        style={{ padding: "5px", borderRadius: "6px", border: "1px solid #d9d9d9" }}
                    >
                        {discountTypeOptions.map((type) => (
                            <Option key={type.value} value={type.value}>
                                {type.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Student kursi"
                    name="studentLevel"
                    rules={[{ required: true, message: "Student kursini kiriting!" }]}
                >
                    <Input
                        type="number"
                        style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    />
                </Form.Item>

                <Form.Item
                    label="Chegirma miqdori"
                    name="amount"
                    rules={[{ required: true, message: "Chegirma miqdorini kiriting!" }]}
                >
                    <Input
                        type="number"
                        style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
                    />
                </Form.Item>

                <Form.Item label="Fayl yuklash (Chegirma sababi)">
                    <Input type="file" onChange={handleFileChange} />

                    {reasonFileUuid && (
                        <div className="mt-2 text-green-600" >
                            Fayl yuklandi: <code>{reasonFileUuid}</code>
                        </div>
                    )}

                    {!reasonFileUuid && initialFileInfo && (
                        <div className="mt-2 text-blue-600" >
                            Avval yuklangan fayl: <code>{initialFileInfo}</code>
                        </div>
                    )}
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
                        {update?.id ? "Update Discount" : "Create Discount"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DiscountsModal;
