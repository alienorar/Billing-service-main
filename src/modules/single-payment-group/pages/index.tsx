import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetOneGroup } from "../hooks/queries";
import { PaymentGroup } from "@types";
import { Card, Descriptions, Tag, Spin, Alert, Typography } from "antd";
import "antd/dist/reset.css";

const { Title } = Typography;

const Index = () => {
  const { id } = useParams<{ id: string }>(); // Explicitly type id as string
  const { data: response, isLoading, error } = useGetOneGroup(id);

  // Extract payment group data
  const paymentGroup: PaymentGroup | undefined = response?.data;

  // Log for debugging
  useEffect(() => {
    console.log("Payment Group Response:", response, "ID:", id);
  }, [response, id]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Handle error state
  if (error || !response?.success) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Alert
          message="Error"
          description={error?.message || response?.errorMessage || "Failed to fetch payment group."}
          type="error"
          showIcon
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  // Handle no data state
  if (!paymentGroup) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Alert
          message="No Data"
          description="No payment group found for the given ID."
          type="warning"
          showIcon
          className="max-w-2xl mx-auto"
        />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-inter">

      {/* Payment Group Details */}
      <Card title={<Title level={3}>Payment Group Details</Title>} className="max-w-2xl mx-auto shadow-lg">
        <Descriptions bordered column={1} className="bg-white">
          <Descriptions.Item label="ID">{paymentGroup.id}</Descriptions.Item>
          <Descriptions.Item label="Name">{paymentGroup.name}</Descriptions.Item>
          <Descriptions.Item label="Duration">{paymentGroup.duration} years</Descriptions.Item>
          <Descriptions.Item label="Contract Amounts">
            <div className="flex flex-wrap gap-2">
              {Object.entries(paymentGroup.contractAmounts).map(([year, amount]) => (
                <Tag
                  key={year}
                  color="blue"
                  className="text-xs font-medium px-2 py-1 rounded-full"
                >
                  Year {year}: {amount?.toLocaleString()} UZS
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Group IDs">
            <div className="flex flex-wrap gap-2">
              {paymentGroup?.groupIds?.map((groupId) => (
                <Tag key={groupId} color="green" className="text-xs font-medium px-2 py-1 rounded-full">
                  {groupId}
                </Tag>
              ))}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default Index;