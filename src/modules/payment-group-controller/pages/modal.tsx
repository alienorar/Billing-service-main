import { Modal, Form, Input, Button, InputNumber, TreeSelect, Spin, Alert } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useCreatePmtGroupList, useUpdatePmtGroupList } from "../hooks/mutations";
import { useGetAvailabletGroupList } from "../hooks/queries";
import { PaymentGroup, Speciality, AvailableGroup, PmtGroupFormValues, ContractAmountForm } from "@types";
import { DataNode } from "antd/es/tree";

interface PmtGroupModalProps {
  open: boolean;
  handleClose: () => void;
  update?: PaymentGroup | null;
}

const PmtGroupModal: React.FC<PmtGroupModalProps> = ({ open, handleClose, update }) => {
  const [form] = useForm<PmtGroupFormValues>();
  const { mutate: createMutate, isPending: isCreating } = useCreatePmtGroupList();
  const { mutate: updateMutate, isPending: isUpdating } = useUpdatePmtGroupList();
  const { data: groupList, isLoading: isGroupsLoading, isError, error: errorInfo } =
    useGetAvailabletGroupList();
  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  // Set form values for edit and create modes
  useEffect(() => {
    if (update?.id) {
      const contractAmounts = update.contractAmounts
        ? Object.entries(update.contractAmounts).map(([key, amount]) => ({
            key,
            amount,
          }))
        : [];
      const groupIds = update.groupIds ?? [];
      form.setFieldsValue({
        name: update.name,
        duration: update.duration,
        contractAmounts,
        groupIds,
      });
      setSelectedGroupIds(groupIds);
      if (update.duration > 0 && contractAmounts.length === 0) {
        handleDurationChange(update.duration);
      }
      setExpandedKeys([]);
    } else {
      // Create mode
      form.resetFields();
      form.setFieldsValue({
        name: "",
        duration: 1,
        contractAmounts: [{ key: "1", amount: 0 }],
        groupIds: [],
      });
      setSelectedGroupIds([]);
      handleDurationChange(1);
      setExpandedKeys([]);
    }
  }, [update, form]);

  // Handle duration change
  const handleDurationChange = (duration: number | null): void => {
    if (typeof duration === "number" && duration > 0) {
      const currentContractAmounts: ContractAmountForm[] = form.getFieldValue("contractAmounts") ?? [];
      const newContractAmounts = Array.from({ length: duration }, (_, index) => {
        const key = `${index + 1}`;
        return currentContractAmounts[index] ?? { key, amount: 0 };
      });
      form.setFieldsValue({ contractAmounts: newContractAmounts });
    } else {
      form.setFieldsValue({ contractAmounts: [] });
    }
  };

  // Prepare TreeSelect data with unique keys
  const treeData: DataNode[] = Array.isArray(groupList?.data)
    ? groupList.data.map((speciality: Speciality) => ({
        title: speciality.name,
        value: `speciality-${speciality.id}`,
        key: `speciality-${speciality.id}`,
        selectable: false,
        children: (speciality.groups ?? []).map((group: AvailableGroup) => ({
          title: group.name,
          value: group.id,
          key: group.id,
        })),
      }))
    : [];

  // Handle TreeSelect expand/collapse
  const handleTreeExpand = (keys: (string | number)[]): void => {
    setExpandedKeys(keys);
  };

  // Handle TreeSelect change with proper filtering
  const handleTreeSelectChange = (values: (string | number)[]): void => {
    const groupIds = values
      .filter((value): value is number => typeof value === "number")
      .map(Number);
    
    setSelectedGroupIds(groupIds);
    form.setFieldsValue({ groupIds });
  };

  // Handle form submission
  const handleFinish = async (values: PmtGroupFormValues): Promise<void> => {
    const basePayload: Omit<PaymentGroup, "id"> = {
      name: values.name,
      duration: values.duration,
      contractAmounts: values.contractAmounts.reduce(
        (acc: Record<string, number>, { key, amount }) => ({
          ...acc,
          [key]: amount,
        }),
        {}
      ),
      groupIds: selectedGroupIds,
    };

    if (update?.id) {
      const payload: PaymentGroup = { ...basePayload, id: update.id };
      updateMutate(payload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
        },
      });
    } else {
      createMutate(basePayload, {
        onSuccess: () => {
          form.resetFields();
          handleClose();
        },
      });
    }
  };

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load groups: ${errorInfo instanceof Error ? errorInfo.message : "Unknown error"}`}
        type="error"
        showIcon
        style={{ margin: "20px" }}
      />
    );
  }

  return (
    <Modal
      title={update?.id ? "Edit Payment Group" : "Add New Payment Group"}
      open={open}
      onCancel={handleClose}
      footer={null}
      destroyOnClose
    >
      {isGroupsLoading ? (
        <Spin style={{ display: "block", margin: "20px auto" }} />
      ) : (
        <Form form={form} name="pmt_group_form" layout="vertical" onFinish={handleFinish}>
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
            label="Duration (in years)"
            name="duration"
            rules={[{ required: true, message: "Enter duration!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%", borderRadius: "6px" }}
              placeholder="Enter duration"
              onChange={handleDurationChange}
            />
          </Form.Item>

          <Form.Item label="Groups" name="groupIds">
            <TreeSelect
              treeData={treeData}
              treeCheckable
              showCheckedStrategy={TreeSelect.SHOW_CHILD}
              placeholder="Select groups"
              style={{ width: "100%", borderRadius: "6px" }}
              treeExpandedKeys={expandedKeys}
              onTreeExpand={handleTreeExpand}
              onChange={handleTreeSelectChange}
              value={selectedGroupIds}
              allowClear
              treeDefaultExpandAll
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item label="Contract Amounts (Ordinal: Amount)" name="contractAmounts">
            <Form.List name="contractAmounts">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                      <Form.Item
                        {...restField}
                        name={[name, "key"]}
                        initialValue={`${name + 1}`}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="Default" disabled />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "amount"]}
                        rules={[{ required: true, message: "Enter amount!" }]}
                        style={{ flex: 1 }}
                      >
                        <InputNumber min={0} placeholder="Amount (UZS)" style={{ width: "100%" }} />
                      </Form.Item>
                    </div>
                  ))}
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
                borderRadius: "6px",
              }}
            >
              {update?.id ? "Update Payment Group" : "Create Payment Group"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default PmtGroupModal;