import { Modal, Form, Input, Button, InputNumber, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useCreatePmtGroupList, useUpdatePmtGroupList } from "../hooks/mutations";
import { useGetAvailabletGroupList } from "../hooks/queries"; // New hook for fetching groups
import { PaymentGroup } from "@types";
import { useEffect } from "react";

const { Option } = Select;

interface PmtGroupModalProps {
  open: boolean;
  handleClose: () => void;
  update?: PaymentGroup | null;
}

interface Group {
  id: number;
  name: string;
}

const PmtGroupModal = ({ open, handleClose, update }: PmtGroupModalProps) => {
  const [form] = useForm();
  const { mutate: createMutate, isPending: isCreating } = useCreatePmtGroupList();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePmtGroupList();
  const { data: groupList, isLoading: isGroupsLoading } = useGetAvailabletGroupList(); // Fetch groups

console.log(groupList?.data,"dhejkhdk3")

  // Set form values for edit mode
  useEffect(() => {
    if (update?.id) {
      form.setFieldsValue({
        name: update.name,
        duration: update.duration,
        contractAmounts: Object.entries(update.contractAmounts).map(([year, amount]) => ({
          year,
          amount,
        })),
        groupIds: update.groupIds, // Initialize groupIds for editing
      });
    } else {
      form.resetFields();
    }
  }, [update, form]);

  const onFinish = async (values: any) => {
    const basePayload = {
      name: values.name,
      duration: values.duration,
      contractAmounts: values.contractAmounts.reduce(
        (acc: Record<string, number>, { year, amount }: { year: string; amount: number }) => ({
          ...acc,
          [year]: amount,
        }),
        {}
      ),
      groupIds: values.groupIds || [],
    };

    if (update?.id) {
      const payload: PaymentGroup = {
        ...basePayload,
        id: update.id, 
      };
      updateMutate(payload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
        },
      });
    } else {
      const payload = basePayload; 
      createMutate(payload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
        },
      });
    }
  };

  return (
    <Modal
      title={update?.id ? "Edit Payment Group" : "Add New Payment Group"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} name="pmt_group_form" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Enter payment group name!" }]}
        >
          <Input
            style={{ padding: "6px", border: "1px solid #d9d9d9", borderRadius: "6px" }}
            placeholder="Enter name"
          />
        </Form.Item>

        <Form.Item
          label="Duration (in months)"
          name="duration"
          rules={[{ required: true, message: "Enter duration!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%", padding: "6px", borderRadius: "6px" }}
            placeholder="Enter duration"
          />
        </Form.Item>

        <Form.Item
          label="Groups"
          name="groupIds"
          rules={[{ required: true, message: "Select at least one group!" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select groups"
            loading={isGroupsLoading}
            allowClear
            style={{ width: "100%" }}
          >
            {groupList?.data?.map((group: Group) => (
              <Option key={group.id} value={group.id}>
                {group.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Contract Amounts (Year: Amount)"
          name="contractAmounts"
          rules={[{ required: true, message: "Enter at least one contract amount!" }]}
        >
          <Form.List name="contractAmounts">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                    <Form.Item
                      {...restField}
                      name={[name, "year"]}
                      rules={[{ required: true, message: "Enter year!" }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Year (e.g., 2023)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      rules={[{ required: true, message: "Enter amount!" }]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber min={0} placeholder="Amount (UZS)" style={{ width: "100%" }} />
                    </Form.Item>
                    <Button onClick={() => remove(name)} danger>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Add Contract Amount
                </Button>
              </>
            )}
          </Form.List>
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
            {update?.id ? "Update Payment Group" : "Create Payment Group"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PmtGroupModal;