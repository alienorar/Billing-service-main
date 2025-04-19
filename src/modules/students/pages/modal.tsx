import { Modal, Form, Upload, Button, message, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSyncStudents } from "../hooks/mutations";

interface UploadStudentDataModalProps {
    open: boolean;
    onClose: () => void;
}

const UploadStudentDataModal: React.FC<UploadStudentDataModalProps> = ({ open, onClose }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]); 
    const { mutate: uploadStudents } = useSyncStudents();

    const handleUpload = ({ fileList }: { fileList: UploadFile[] }) => {
        setFileList(fileList); 
    };

    const onFinish = async () => {
        if (fileList.length === 0) {
            message.warning("Please select a file first!");
            return;
        }
        const formData = new FormData();
        formData.append("file", fileList[0] as any); 
        uploadStudents(formData);
    };

    return (
        <Modal title="Upload Students Data" open={open} onCancel={onClose} footer={null}>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Upload File" name="file" rules={[{ required: true, message: "Please upload a file!" }]}>
                    <Upload beforeUpload={() => false} fileList={fileList} onChange={handleUpload}>
                        <Button icon={<UploadOutlined />}>Select File</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button
                        block
                        htmlType="submit"
                        style={{
                            backgroundColor: "#050556",
                            color: "white",
                            height: "40px",
                            fontSize: "18px",
                            marginTop: "10px",
                            borderRadius: "6px",
                        }}
                    >
                        Upload
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UploadStudentDataModal;
