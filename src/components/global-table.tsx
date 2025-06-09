
import { Table, TableProps } from "antd";
import { TablePaginationConfig } from "antd/es/table";

// Extend antd's TableProps to include custom props
export interface TablePropsType<T> extends TableProps<T> {
loading: boolean;
  data: T[];
  columns: TableProps<T>["columns"];
  handleChange: (pagination: TablePaginationConfig) => void;
  pagination: TableProps<T>["pagination"];
  rowClassName?: (record: T) => string; // Add rowClassName
}

// Generic GlobalTable component
const GlobalTable = <T,>({ loading, data, columns, handleChange, pagination, rowClassName, ...rest }: TablePropsType<T>) => {
  return (
    <Table<T>
      loading={loading}
      dataSource={data}
      columns={columns}
      onChange={handleChange}
      pagination={pagination}
      rowClassName={rowClassName}
      {...rest}
    />
  );
};

export default GlobalTable;
