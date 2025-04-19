
import { TablePropsType } from '@types';
import { Table } from 'antd';
const Index = ({ columns, data, handleChange, pagination }: TablePropsType) => <Table
    columns={columns}
    rowKey="id"
    dataSource={data}
    pagination={pagination}
    onChange={(pagination) => handleChange(pagination)} />;
export default Index;


