'use client';

import { Table, Tag, Typography } from 'antd';
import { ReactElement, JSXElementConstructor, ReactNode, AwaitedReactNode } from 'react';

const { Text } = Typography;

export const InvoiceTable = ({ data }:{data:any}) => {
  const serviceColumns = [
    {
      title: 'Service Code',
      dataIndex: ['service', 'code'],
      key: 'code',
    },
    {
      title: 'Service',
      dataIndex: ['service', 'title'],
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: ['service', 'description'],
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'serviceStatus',
      key: 'status',
      render: (status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined) => (
        <Tag color={status === 'Complete' ? 'green' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Technician Comments',
      dataIndex: 'TechnicianComment',
      key: 'comments',
      render: (comments: any[]) => (
        <div>
          {comments?.map(comment => (
            <div key={comment.id} style={{ marginBottom: 4 }}>
              <Text type="secondary">{comment.comment}</Text>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table 
      columns={serviceColumns} 
      dataSource={data} 
      rowKey="serviceCode"
      pagination={false}
    />
  );
};