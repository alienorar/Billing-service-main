import { Modal, Descriptions, Typography, Divider } from "antd";
import { Dispatch, SetStateAction } from "react";

const { Title, Text } = Typography;

interface AuditModalProps {
  audetModalOpen: boolean;
  setAudetModalOpen: Dispatch<SetStateAction<boolean>>;
  record: any | null;
}

const AuditModal: React.FC<AuditModalProps> = ({
  audetModalOpen,
  setAudetModalOpen,
  record,
}) => {
  const handleOk = () => setAudetModalOpen(false);
  const handleCancel = () => setAudetModalOpen(false);

  return (
    <Modal
      open={audetModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={900}
      bodyStyle={{ padding: "100px 32px" }}
    >
      {record ? (
        <>
          <Title style={{
            fontSize:24,
            fontWeight: 700,
            marginBottom:30
          }} level={2}>Audit Ma'lumotlari</Title>
          <Descriptions
            style={{
              gap: 10,
              padding: -10,
            }}
            column={1}
            size="small"
            bordered
            labelStyle={{ fontWeight: "bold" }} // mana shu qator bold qiladi
          >
            <Descriptions.Item
              style={{ height: 50 }}
              label="F.I.Sh"
            >
              {record.student?.fullName}
            </Descriptions.Item>
            <Descriptions.Item
              style={{ height: 50 }}
              label="Guruh"
            >
              {record.student?.group}
            </Descriptions.Item>
            <Descriptions.Item
              style={{ height: 50 }}
              label="PINFL"
            >
              {record.student?.pinfl}
            </Descriptions.Item>
            <Descriptions.Item
              style={{ height: 50 }}
              label="Yo‘nalish"
            >
              {record.student?.speciality}
            </Descriptions.Item>
            <Descriptions.Item
              style={{ height: 50 }}
              label="Yaratgan foydalanuvchi"
            >
              {record.audit?.createdByFullName}
            </Descriptions.Item>
            <Descriptions.Item
              style={{ height: 50 }}
              label="Oxirgi yangilagan foydalanuvchi"
            >
              {record.audit?.updatedByFullName}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <Text type="danger">Ma'lumotlar topilmadi</Text>
 )}
    </Modal>
  );
};

export default AuditModal;



