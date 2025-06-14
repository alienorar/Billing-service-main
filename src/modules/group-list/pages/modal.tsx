import { Modal, Form, Input, Button, Select } from "antd";
import { useEffect } from "react";
import { useUpdateGroupList,  } from "../hooks/mutations";
import { GroupListUpdate, PaymentGroup } from "@types";
import { useGetPmtGroupList } from "../hooks/queries";

interface GroupModalProps {
  open: boolean;
  handleClose: () => void;
  update: GroupListUpdate| null;
}

const GroupModal: React.FC<GroupModalProps> = ({ open, handleClose, update }) => {
  const [form] = Form.useForm();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateGroupList();
  const { data: paymentGroupsData, isLoading: isLoadingPaymentGroups } = useGetPmtGroupList();

  // Extract payment group options
  const paymentGroupOptions = paymentGroupsData?.data?.content?.map((group: PaymentGroup) => ({
    value: group.id,
    label: `${group.name}`,
  })) || [];

  useEffect(() => {
    if (update) {
      form.setFieldsValue({
        groupId: update.id,
        paymentGroupId: update.paymentGroupId || undefined,
      });
    } else {
      form.resetFields();
    }
  }, [update, form]);

  const onFinish = async (values: GroupListUpdate) => {
    const payload: GroupListUpdate = {
      groupId: values.groupId,
      paymentGroupId: values.paymentGroupId,
    };
    updateMutate(payload, { onSuccess: handleClose });
  };

  return (
    <Modal
      title="Edit Group"
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Form
        form={form}
        name="group_form"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Group ID"
          name="groupId"
          rules={[{ required: true, message: "Enter group ID!" }]}
        >
          <Input disabled style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }} />
        </Form.Item>
        <Form.Item
          label="Payment Group ID"
          name="paymentGroupId"
          rules={[{ required: false }]}
        >
          <Select
            placeholder="Select Payment Group"
            options={paymentGroupOptions}
            loading={isLoadingPaymentGroups}
            allowClear
            style={{ width: "100%", borderRadius: "6px" }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            block
            htmlType="submit"
            loading={isUpdating}
            style={{
              backgroundColor: "#050556",
              color: "white",
              height: "40px",
              fontSize: "18px",
              marginTop: "10px",
              borderRadius: "6px",
            }}
          >
            Update Group
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GroupModal;