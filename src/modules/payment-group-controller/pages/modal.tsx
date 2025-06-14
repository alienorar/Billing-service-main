"use client";

import type React from "react";
import { Modal, Form, Input, Button, InputNumber, TreeSelect, Spin, Alert } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useCreatePmtGroupList, useUpdatePmtGroupList } from "../hooks/mutations";
import { useGetAvailabletGroupList } from "../hooks/queries";
import type {
    PaymentGroup,
    Speciality,
    AvailableGroup,
    PmtGroupFormValues,
    ContractAmountForm,
} from "@types";
import type { DataNode } from "antd/es/tree";

interface PmtGroupModalProps {
    open: boolean;
    handleClose: () => void;
    update?: PaymentGroup | null;
}

interface GroupObject {
    id: number;
    name: string;
}

/**
 * Payment‑Group create / update modal.
 *
 * ‑ Multiple groups selectable (treeCheckable)
 * ‑ Always sends only **group** ids (no "speciality‑123" keys)
 * ‑ When editing, previously selected groups are fully visible
 */
const PmtGroupModal: React.FC<PmtGroupModalProps> = ({ open: modalOpen, handleClose, update }) => {
    const [form] = useForm<PmtGroupFormValues>();
    const { mutate: createMutate, isPending: isCreating } = useCreatePmtGroupList();
    const { mutate: updateMutate, isPending: isUpdating } = useUpdatePmtGroupList();
    const {
        data: groupList,
        isLoading: isGroupsLoading,
        isError,
        error: errorInfo,
    } = useGetAvailabletGroupList();

    const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([]);
    const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

    // ───────────────────────────── EFFECTS ──────────────────────────────
    useEffect(() => {
        if (update?.id && groupList?.data) {
            // ==== EDIT MODE ====
            const contractAmounts = update.contractAmounts
                ? Object.entries(update.contractAmounts).map(([key, amount]) => ({ key, amount }))
                : [];

            const groupIds =
                update.groupIds?.map((g: GroupObject | number) => (typeof g === "object" ? g.id : g)) ?? [];

            form.setFieldsValue({
                name: update.name,
                duration: update.duration,
                contractAmounts,
                groupIds,
            });
            setSelectedGroupIds(groupIds);

            // Auto‑generate contractAmounts if duration changed but no amounts yet
            if (update.duration > 0 && contractAmounts.length === 0) handleDurationChange(update.duration);
            setExpandedKeys([]);
        } else {
            // ==== CREATE MODE ====
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
    }, [update, form, groupList]);

    // ──────────────────────────── HELPERS ───────────────────────────────
    const handleDurationChange = (duration: number | null): void => {
        if (typeof duration === "number" && duration > 0) {
            const current: ContractAmountForm[] = form.getFieldValue("contractAmounts") ?? [];
            const newContractAmounts = Array.from({ length: duration }, (_, i) => {
                const key = `${i + 1}`;
                return current[i] ?? { key, amount: 0 };
            });
            form.setFieldsValue({ contractAmounts: newContractAmounts });
        } else {
            form.setFieldsValue({ contractAmounts: [] });
        }
    };

    // Build treeData once groups are loaded
    const treeData: DataNode[] = Array.isArray(groupList?.data)
        ? groupList.data.map((s: Speciality) => ({
            title: `${s.name} — [${(s.educationForm || "N/A").toUpperCase()} / ${(s.educationType || "N/A").toUpperCase()}]`,
            value: `speciality-${s.id}`,
            key: `speciality-${s.id}`,
            selectable: false,
            children: (s.groups ?? []).map((g: AvailableGroup) => ({
                title: g.name,
                value: g.id, // leaf node gets number value
                key: g.id,
            })),
        }))
        : [];

    // ───────────────────────────── SUBMIT ───────────────────────────────
    const handleFinish = async (values: PmtGroupFormValues): Promise<void> => {
        const basePayload: Omit<PaymentGroup, "id"> = {
            name: values.name,
            duration: values.duration,
            contractAmounts: values.contractAmounts.reduce<Record<string, number>>((acc, cur) => {
                acc[cur.key] = cur.amount;
                return acc;
            }, {}),
            groupIds: selectedGroupIds, // 👉 send only group ids
        };

        if (update?.id) {
            updateMutate({ ...basePayload, id: update.id } as PaymentGroup, {
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

    // ───────────────────────────── RENDER ───────────────────────────────
    if (isError) {
        return (
            <Alert
                message="Error"
                description={`Failed to load groups: ${errorInfo instanceof Error ? errorInfo.message : "Unknown error"}`}
                type="error"
                showIcon
                style={{ margin: 20 }}
            />
        );
    }

    return (
        <Modal
            title={update?.id ? "To'lov guruhini yangilash" : "To'lov guruhini yaratish"}
            open={modalOpen}
            onCancel={handleClose}
            footer={null}
            destroyOnClose
        >
            {isGroupsLoading ? (
                <Spin style={{ display: "block", margin: "20px auto" }} />
            ) : (
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    {/* NAME */}
                    <Form.Item label="Nomi" name="name" rules={[{ required: true, message: "To'lov guruhini nomini kiriting" }]}>
                        <Input placeholder="To'lov guruhini nomini kiriting" />
                    </Form.Item>

                    {/* DURATION */}
                    <Form.Item label="Muddati (yilda)" name="duration" rules={[{ required: true, message: "Muddatni kiriting!" }]}>
                        <InputNumber min={1} style={{ width: "100%" }} onChange={handleDurationChange} />
                    </Form.Item>

                    {/* GROUPS TREE */}
                    <Form.Item label="Guruhlar" name="groupIds">
                        <TreeSelect<number[]>
                            treeData={treeData}
                            multiple
                            treeCheckable
                            showCheckedStrategy={TreeSelect.SHOW_CHILD} 
                            value={selectedGroupIds}
                            placeholder="Guruhlarni tanlang"
                            style={{ width: "100%" }}
                            treeDefaultExpandAll
                            treeExpandedKeys={expandedKeys}
                            onTreeExpand={setExpandedKeys as (keys: (string | number)[]) => void}
                            allowClear
                            autoClearSearchValue={false}
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                            filterTreeNode={(input, node) =>
                                (node.title as string).toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(val) => {
                                // Ant returns (string | number)[]
                                const numericIds = (val ?? []).filter((v): v is number => typeof v === "number");
                                setSelectedGroupIds(numericIds);
                                form.setFieldsValue({ groupIds: numericIds });
                            }}
                        />
                    </Form.Item>

                    {/* CONTRACT AMOUNTS */}
                    <Form.Item label="Kontrakt to'lov miqdori" name="contractAmounts">
                        <Form.List name="contractAmounts">
                            {(fields) => (
                                <>
                                    {fields.map(({ key, name, ...rest }) => (
                                        <div key={key} style={{ display: "flex", gap: 8, marginBottom: 2 }}>
                                            <Form.Item {...rest} name={[name, "key"]} initialValue={`${name + 1}`} style={{ flex: 1 }}>
                                                <Input disabled />
                                            </Form.Item>
                                            <Form.Item
                                                {...rest}
                                                name={[name, "amount"]}
                                                rules={[{ required: true, message: "Kontrakt miqdorini kiriting!" }]}
                                                style={{ flex: 2 }}
                                            >
                                                <InputNumber min={0} style={{ width: "100%" }} placeholder="Miqdori (UZS)" />
                                            </Form.Item>
                                        </div>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form.Item>

                    {/* SUBMIT BUTTON */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
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
                            {update?.id ? "To'lov guruhini yangilash" : "To'lov guruhini yaratish"}
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default PmtGroupModal;
