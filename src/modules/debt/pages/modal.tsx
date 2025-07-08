
import { Modal, Form, Input, Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import {
  useCreateDebtList,
  useUpdateDebtList,
  useUploadDebtReason, 
} from "../hooks/mutations";

const { Option } = Select;

interface Debt {
  id?: number;
  studentId: number;
  description: string;
  reasonFile: string;
  debtType: string;
  studentLevel: number;
  amount: number;
}


const DebtsModal = ({ open, handleClose, update, studentId  }: any) => {

  const [form] = Form.useForm();
  const [reasonFileUuid, setReasonFileUuid] = useState<string | null>(null);
  const [initialFileInfo, setInitialFileInfo] = useState<string | null>(null);
  const { mutate: createMutate, isPending: isCreating } = useCreateDebtList();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateDebtList();
  const { mutateAsync: uploadFile } = useUploadDebtReason();

  const debtTypeOptions = [
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
        debtType: update.debtType,
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

  const onFinish = async (value: Debt) => {
    if (!reasonFileUuid) {
      message.error("Iltimos, qarz sabab faylini yuklang!");
      return;
    }

    const payload: Debt & { reasonFile: string } = {
      ...(update?.id && { id: update.id }), 

      studentId: studentId,

      description: value.description,
      debtType: value.debtType,
      studentLevel: value.studentLevel,
      amount: value.amount,
      reasonFile: reasonFileUuid,
    };

    if (update?.id) {
      updateMutate(payload, { onSuccess: handleClose });
    } else {
      const { id, ...createPayload } = payload;
      createMutate(createPayload, { onSuccess: handleClose });
    }
  };

  return (
    <Modal
      title={update?.id ? "Qarzni Tahrirlash" : "Yangi Qarz Qo'shish"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} name="debt_form" layout="vertical" onFinish={onFinish}>

        {/* <Form.Item

          label="Student Id"
          name="studentId"
          rules={[{ required: true, message: "Tavsifni kiriting!" }]}
        >
          <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} type="number" />

        </Form.Item> */}

        <Form.Item
          label="Tavsif"
          name="description"
          rules={[{ required: true, message: "Tavsifni kiriting!" }]}
        >
          <Input style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
        </Form.Item>

        <Form.Item
          label="Qarz turi"
          name="debtType"
          rules={[{ required: true, message: "Qarz turini tanlang!" }]}
        >
          <Select
            placeholder="Qarz turini tanlang"
            style={{ padding: "5px", borderRadius: "6px", border: "1px solid #d9d9d9" }}
          >
            {debtTypeOptions.map((type) => (
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
          label="Qarz miqdori"
          name="amount"
          rules={[{ required: true, message: "Qarz miqdorini kiriting!" }]}
        >
          <Input
            type="number"
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
          />
        </Form.Item>

        <Form.Item label="Fayl yuklash (Qarz sababi)">
          <Input type="file" onChange={handleFileChange} />
          {reasonFileUuid && (
            <div className="mt-2 text-green-600">
              Fayl yuklandi: <code>{reasonFileUuid}</code>
            </div>
          )}
          {!reasonFileUuid && initialFileInfo && (
            <div className="mt-2 text-blue-600">
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
            {update?.id ? "Qarzni Yangilash" : "Qarz Qo'shish"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DebtsModal;
