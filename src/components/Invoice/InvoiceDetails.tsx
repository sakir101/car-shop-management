'use client'
import { useParams } from 'next/navigation';
import { Card, Typography, Divider, Descriptions, Table, Tag, Space, Button, Flex, message } from 'antd';
import { useGetSingleInvoiceItemQuery, useSendInvoiceToUserMutation } from '@/redux/api/serviceAdvisorApi';
import { DownloadOutlined, PrinterFilled, RedoOutlined, SendOutlined } from '@ant-design/icons';
import Loading from '@/app/loading';
import { pdf, PDFDownloadLink } from '@react-pdf/renderer';
import InvoiceDocument from '@/components/InvoiceDocumment/InvoiceDocument';
import { useEffect, useState } from 'react';
import { convertToDecimalHour } from '@/utils/convertToDecimalHour ';

const { Title, Text } = Typography;

export default function InvoiceDetails() {
  const { code } = useParams();
  const { data: invoice,refetch, isLoading } = useGetSingleInvoiceItemQuery({ code }, {
    refetchOnMountOrArgChange: true,
  });
   const [sendInvoiceToUser] = useSendInvoiceToUserMutation()

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) return <Loading />;
  if (!invoice) return <div style={{ padding: 24 }}>Invoice not found</div>;
  
  const allInvoiceService = [...invoice.TechnicianEstimateService, ...invoice.TechnicianItemTireService, ...invoice.TechnicianItemGeneralService];
  // const estLen = invoice.TechnicianEstimateService.length;
  // const estDone = invoice.TechnicianEstimateService.filter((item: { serviceStatus: string; }) => item.serviceStatus === "Complete").length;
  
  // const tireLen = invoice.TechnicianItemTireService.length;
  // const tireDone = invoice.TechnicianItemTireService.filter((item: { serviceStatus: string; }) => item.serviceStatus === "Complete").length;
  
  // const genLen = invoice.TechnicianItemGeneralService.length;
  // const genDone = invoice.TechnicianItemGeneralService.filter((item: { serviceStatus: string; }) => item.serviceStatus === "Complete").length;
  // const inLen = invoice.inspections.length;
  // const inDone = invoice.inspections.filter((item: { status: string; }) => item.status === "Complete").length;
  // const allServicesInspectionsComplete =
  //  estLen === estDone &&
  //  tireLen === tireDone &&
  //  genLen === genDone &&
  //  inLen === inDone;

    const handlePrintInvoice = async (invoice:any) => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleSendInvoice = async (invoice: any) => {
      const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
  
      const file = new File([blob], `invoice_${invoice.invoiceId}.pdf`, {
        type: 'application/pdf',
      });
  
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("email", invoice?.customers[0]?.user?.email);
      formData.append("id", invoice.invoiceId);
      formData.append("code", invoice.code);
      formData.append("invoiceSent", invoice.invoiceSent);
  
      try {
        const res = await sendInvoiceToUser(formData).unwrap();
        message.success('Successfully Send Invoice!')
        refetch()
      } catch (error) {
        alert("Error sending invoice");
      }
    };

  const customer = invoice.customers[0]?.user;
  const vehicle = invoice.vehicle[0]?.vehicle;

  const serviceColumns = [
    {
      title: 'Service Code',
      dataIndex: ['service', 'code'],
      key: 'serviceCode',
      responsive: ['md'] as any,
    },
    {
      title: 'Title',
      dataIndex: ['service', 'title'],
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: ['service', 'description'],
      key: 'description',
      ellipsis: true,
      responsive: ['lg'] as any,
    },
    {
      title: 'Status',
      dataIndex: 'serviceStatus',
      key: 'status',
      render: (status: string) => {
        let color = status === 'Complete' ? 'green' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const inspectionColumns = [
    {
      title: 'Code',
      dataIndex: 'inspectionCode',
      key: 'inspectionCode',
      responsive: ['md'] as any,
    },
    {
      title: 'Title',
      dataIndex: 'inspectionTitle',
      key: 'inspectionTitle',
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'inspectionDescription',
      key: 'inspectionDescription',
      ellipsis: true,
      responsive: ['lg'] as any,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'gray';
        if (status === 'Completed') color = 'green';
        else if (status === 'Pending') color = 'orange';
        else if (status === 'Rejected') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div style={{ 
      padding: isMobile ? '8px' : '16px',
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <Space 
        direction="vertical" 
        size={isMobile ? 'middle' : 'large'} 
        style={{ width: '100%' }}
      >
        <Card>
          <Flex
  vertical={isMobile}
  justify="space-between"
  align={isMobile ? "stretch" : "center"}
  gap={12}
  style={{ width: "100%" }}
>
  <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
    {invoice.title}
  </Title>

  <Space
    direction={isMobile ? "vertical" : "horizontal"}
    style={{ width: isMobile ? "100%" : "auto" }}
  >

    <Button
  title={invoice?.invoiceSent ? "Resend" : "Send"}
  icon={invoice?.invoiceSent ? <RedoOutlined /> : <SendOutlined />}
  onClick={() => handleSendInvoice(invoice)}
  block={isMobile}
>
  {invoice?.invoiceSent ? "Resend" : "Send"}
</Button>

    <PDFDownloadLink
      title='download'
      document={<InvoiceDocument invoice={invoice} />}
      fileName={`invoice_${invoice.code}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <Button
           icon={<DownloadOutlined />}
          loading={loading}
          block={isMobile}
        >

        </Button>
      )}
    </PDFDownloadLink>

    <Button
      title="Print"
      icon={<PrinterFilled />}
      onClick={() => handlePrintInvoice(invoice)}
      block={isMobile}
    />
  </Space>
</Flex>
          <Divider />
          <Descriptions 
            bordered 
            column={isMobile ? 1 : 2}
            size={isMobile ? 'small' : 'default'}
            labelStyle={{ 
              width: isMobile ? '40%' : 'auto',
              fontSize: isMobile ? '12px' : '14px'
            }}
            contentStyle={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            <Descriptions.Item label="Total Hours">{convertToDecimalHour(invoice.totalHours)}</Descriptions.Item>
            <Descriptions.Item label="Total Amount">${invoice.totalAmount.toFixed(2)}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Customer Information" size={isMobile ? 'small' : 'default'}>
          <Descriptions 
            bordered 
            column={isMobile ? 1 : 2}
            size={isMobile ? 'small' : 'default'}
            labelStyle={{ 
              width: isMobile ? '40%' : 'auto',
              fontSize: isMobile ? '12px' : '14px'
            }}
            contentStyle={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            <Descriptions.Item label="Name">{customer?.name || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Email">{customer?.email || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Phone">{customer?.contactNum || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Preferred Contact">
              {customer?.preferredCommunicationType || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Vehicle Information" size={isMobile ? 'small' : 'default'}>
          <Descriptions 
            bordered 
            column={isMobile ? 1 : 2}
            size={isMobile ? 'small' : 'default'}
            labelStyle={{ 
              width: isMobile ? '40%' : 'auto',
              fontSize: isMobile ? '12px' : '14px'
            }}
            contentStyle={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            <Descriptions.Item label="License Plate">{vehicle?.numberPlate || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Make">{vehicle?.make || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Model">{vehicle?.model || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Year">{vehicle?.year || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Color">{vehicle?.color || 'N/A'}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Services" size={isMobile ? 'small' : 'default'}>
          <Table
            columns={serviceColumns}
            dataSource={allInvoiceService}
            rowKey="serviceCode"
            pagination={false}
            scroll={{ x: isMobile ? 400 : undefined }}
           
            className={isMobile ? 'mobile-table' : ''}
          />
        </Card>

        <Card title="Inspections" size={isMobile ? 'small' : 'default'}>
          <Table
            columns={inspectionColumns}
            dataSource={invoice.inspections}
            rowKey="inspectionCode"
            pagination={false}
            scroll={{ x: isMobile ? 400 : undefined }}
           
            className={isMobile ? 'mobile-table' : ''}
          />
        </Card>

        <Card title="Cost Breakdown" size={isMobile ? 'small' : 'default'}>
          <Descriptions 
            bordered 
            column={isMobile ? 1 : 2}
            size={isMobile ? 'small' : 'default'}
            labelStyle={{ 
              width: isMobile ? '40%' : 'auto',
              fontSize: isMobile ? '12px' : '14px'
            }}
            contentStyle={{
              fontSize: isMobile ? '12px' : '14px'
            }}
          >
            <Descriptions.Item label="Labour Hours">{convertToDecimalHour(invoice.labourTotalHours)}</Descriptions.Item>
            <Descriptions.Item label="Labour Cost">${invoice.labourTotalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Parts Cost">${invoice.partsTotalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Inspection Cost">${invoice.inspectionTotalAmount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total Amount" span={isMobile ? 1 : 2}>
              <Text strong style={{ fontSize: isMobile ? '14px' : '16px' }}>
                ${invoice.totalAmount.toFixed(2)}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>

      <style jsx>{`
        .mobile-table .ant-table-thead > tr > th {
          font-size: 12px !important;
          padding: 8px 4px !important;
        }
        .mobile-table .ant-table-tbody > tr > td {
          font-size: 12px !important;
          padding: 8px 4px !important;
        }
        .mobile-table .ant-tag {
          font-size: 10px !important;
          padding: 0 4px !important;
        }
      `}</style>
    </div>
  );
}