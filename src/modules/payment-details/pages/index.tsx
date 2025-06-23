import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Table, Spin, Alert, Typography, message } from "antd";
import { ArrowLeftOutlined, RedoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCheckTransactionHistory } from "../../transaction-history/hooks/queries";
// import { useQueryClient } from "@tanstack/react-query";
import { useRetryTransactionHistory } from "../hooks/mutations";

const { Title } = Typography;

const PRIMARY_COLOR = "#050556";

interface RequestData {
  id: number;
  paidDate: string;
  paidSumm: number;
  currencyCode: string;
  paymentTypeId: number;
  contractNumber: string;
  contractDate: string;
  clientName: string;
  clientPinfl: string;
}

const TransactionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const queryClient = useQueryClient();
  const { data: apiResponse, isLoading, error } = useCheckTransactionHistory(id || "");

  // Get transaction ID from API response
  const transactionId = apiResponse?.data?.id;

  // Use the retry mutation hook
  const {
    mutate: retryTransaction,
    isPending: isRetrying,
    error: retryError,
    reset: resetMutation,
  } = useRetryTransactionHistory(transactionId || "");

  // Clear retry error when navigating away (optional)
  useEffect(() => {
    return () => {
      resetMutation(); // Reset mutation state when component unmounts
    };
  }, [resetMutation]);

  const handleRetry = () => {
    if (!transactionId) {
      message.error("Cannot retry: Transaction ID not available");
      return;
    }
    retryTransaction(transactionId); // Trigger the mutation
  };

  const columns = [
    {
      title: "Field",
      dataIndex: "key",
      key: "key",
      render: (text: string) => text.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value: any, record: { key: string }) => {
        if (value === null || value === undefined) return "-";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (["timestamp", "createdAt", "updatedAt", "paidDate"].includes(record.key.toLowerCase())) {
          return dayjs(value).format("DD-MM-YYYY HH:mm:ss");
        }
        if (["paidSumm"].includes(record.key.toLowerCase())) {
          return `${value.toLocaleString()} UZS`;
        }
        return String(value);
      },
    },
  ];

  const tableData = apiResponse
    ? (() => {
        const { timestamp, success, errorMessage, data } = apiResponse;

        let parsedRequest: RequestData | null = null;
        try {
          parsedRequest = JSON.parse(data.request) as RequestData;
        } catch (e) {
          console.error("Failed to parse request JSON:", e);
        }

        const topLevelFields = {
          Timestamp: timestamp,
          Success: success,
          "Error Message": errorMessage,
        };

        const dataFields = {
          ID: data.id,
          "Payment ID": data.payment_id,
          Provider: data.provider,
          "Successfully Saved In 1C": data.successfullySavedIn1C,
          "Created At": data.createdAt,
          "Updated At": data.updatedAt,
          Response: data.response,
        };

        const requestFields = parsedRequest
          ? {
              "Request ID": parsedRequest.id,
              "Paid Date": parsedRequest.paidDate,
              "Paid Sum": parsedRequest.paidSumm,
              "Currency Code": parsedRequest.currencyCode,
              "Payment Type ID": parsedRequest.paymentTypeId,
              "Contract Number": parsedRequest.contractNumber,
              "Contract Date": parsedRequest.contractDate,
              "Client Name": parsedRequest.clientName,
              "Client PINFL": parsedRequest.clientPinfl,
            }
          : { "Request (Raw)": data.request };

        return Object.entries({ ...topLevelFields, ...dataFields, ...requestFields }).map(
          ([key, value], index) => ({
            key,
            value,
            id: index,
          })
        );
      })()
    : [];

  return (
    <div className="flex justify-center p-5 min-h-[100vh] bg-[#f5f5f5]" >
      <Card
        style={{ maxWidth: 800, width: "100%", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
        title={
          <div className="flex items-center gap-2">
            <Title level={3} style={{ margin: 0, color: PRIMARY_COLOR }}>
              Transaction Details (ID: {id})
            </Title>
          </div>
        }
        extra={
          <div className="flex gap-2" >
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/super-admin-panel/transaction-history")}
            >
              Back
            </Button>
            <Button
              type="primary"
              icon={<RedoOutlined />}
              onClick={handleRetry}
              loading={isRetrying}
              style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
              disabled={isLoading || !!error || !transactionId}
            >
              Retry
            </Button>
          </div>
        }
      >
        <Spin spinning={isLoading}>
          {error && (
            <Alert
              message="Error"
              description={error.message || "Failed to load transaction details"}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {retryError && (
            <Alert
              message="Retry Error"
              description={retryError.message || "Failed to retry transaction"}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          {!isLoading && !error && tableData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              rowKey="id"
              locale={{ emptyText: "No data available" }}
              rowClassName={(record) =>
                record.key === "Successfully Saved In 1C" ? (record.value ? "bg-green-50" : "bg-red-50") : ""
              }
            />
          ) : (
            !isLoading && !error && (
              <Alert
                message="No Data"
                description="No transaction details found for this ID."
                type="info"
                showIcon
              />
            )
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default TransactionDetails;