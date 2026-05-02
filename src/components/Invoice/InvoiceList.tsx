'use client';
import { useGetInvoiceItemQuery, useSendInvoiceToUserMutation } from "@/redux/api/serviceAdvisorApi";
import { Card, Table, Tag, Typography, Button, Space, message } from 'antd';
import { DownloadOutlined, EyeOutlined, PrinterFilled, RedoOutlined, SendOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useRouter } from 'next/navigation';
import Loading from "@/app/loading";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/InvoiceDocumment/InvoiceDocument";
import { pdf } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { getUserInfo } from "@/services/auth.service";
const { Text } = Typography;

interface Service {
  code: string;
  title: string;
  description: string;
  type: string;
  part: any;
  labour: any;
}

interface TechnicianComment {
  id: string;
  comment: string;
  technicianId: string;
  createdAt: string;
}

interface TechnicianEstimateService {
  serviceCode: string;
  TechnicianComment: TechnicianComment[];
  serviceStatus: string;
  service: Service;
}

interface Vehicle {
  id: string;
  numberPlate: string;
  make: string;
  model: string;
  year: number;
  color: string;
}
interface Appointment {
  scheduled: string
}

interface Customer {
  user: {
    id: string;
    name: string;
    email: string;
    contactNum: string;
    preferredCommunicationType: string;
  };
}

interface InvoiceItem {
  invoiceSent: boolean;
  inspections: any[];
  code: string;
  type: string;
  title: string;
  invoiceId: string;
  description: string;
  inspectionTotalHours: string;
  labourTotalHours: string;
  totalHours: string;
  labourTotalAmount: number;
  partsTotalAmount: number;
  inspectionTotalAmount: number;
  totalAmount: number;
  customers: Customer[];
  vehicle: {
    vehicle: Vehicle;
  }[];
  appointment: Appointment;
  TechnicianEstimateService: TechnicianEstimateService[];
  TechnicianItemTireService: any[];
  TechnicianItemGeneralService: any[];
}

const InvoiceList = () => {
  const router = useRouter();
  const { role } = getUserInfo() as any;
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const [sendInvoiceToUser] = useSendInvoiceToUserMutation()
  const [sentInvoices, setSentInvoices] = useState<string[]>([]);

  query["size"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
  query["searchTerm"] = searchTerm;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  useEffect(() => {
    dispatch(setSearchTerm(""))
  }, [dispatch])

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  const { data, refetch, isLoading, isError } = useGetInvoiceItemQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  // useEffect(() => {
  //   if (!data || isLoading) return;

  //   data.forEach((record: InvoiceItem) => {
  //     const estLen = record.TechnicianEstimateService?.length || 0;
  //     const estDone = record.TechnicianEstimateService?.filter(item => item.serviceStatus === "Complete").length || 0;

  //     const tireLen = record.TechnicianItemTireService?.length || 0;
  //     const tireDone = record.TechnicianItemTireService?.filter(item => item.serviceStatus === "Complete").length || 0;

  //     const genLen = record.TechnicianItemGeneralService?.length || 0;
  //     const genDone = record.TechnicianItemGeneralService?.filter(item => item.serviceStatus === "Complete").length || 0;

  //     const inLen = record.inspections?.length || 0;
  //     const inDone = record.inspections?.filter(item => item.status === "Completed").length || 0;

  //     const allComplete =
  //       estLen === estDone &&
  //       tireLen === tireDone &&
  //       genLen === genDone &&
  //       inLen === inDone;

  //     if (allComplete && record.invoiceSent && record.invoiceId) {

  //     }
  //   });
  // }, [data, isLoading]);

  const handlePrintInvoice = async (invoice: InvoiceItem) => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleSendInvoice = async (invoice: InvoiceItem) => {
    const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();

    const file = new File([blob], `${invoice.invoiceId}.pdf`, {
      type: 'application/pdf',
    });

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("email", invoice?.customers[0]?.user?.email);
    formData.append("id", invoice.invoiceId);
    formData.append("code", invoice.code);
    formData.append("invoiceSent", String(invoice?.invoiceSent));

    try {
      const res = await sendInvoiceToUser(formData).unwrap();
      refetch()
      message.success('Invoice Send Successfully!')
    } catch (error) {
      alert("Error sending invoice");
    }
  };

  const handleViewInvoice = (invoiceCode: string) => {
    router.push(`/${role}/invoice-generate/invoice/${invoiceCode}`);
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Something went wrong!</p>;

  const columns: TableColumnsType<InvoiceItem> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',

    },
    {
      title: 'Customer',
      key: 'customer',

      responsive: isMobile ? [] : ['xs'] as any,
      render: (_, record) => record.customers[0]?.user.name || 'N/A',
    },
    {
      title: 'Vehicle',
      key: 'vehicle',

      responsive: isMobile ? [] : ['sm'] as any,
      render: (_, record) => record.vehicle[0]?.vehicle.numberPlate || 'N/A',
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      width: isMobile ? 120 : 200,
      render: (_, record) => {
        // const estLen = record.TechnicianEstimateService.length
        // const estDone = record.TechnicianEstimateService.filter(item => item.serviceStatus === "Complete").length
        // const tireLen = record.TechnicianItemTireService.length
        // const tireDone = record.TechnicianItemTireService.filter(item => item.serviceStatus === "Complete").length
        // const genLen = record.TechnicianItemGeneralService.length
        // const genDone = record.TechnicianItemGeneralService.filter(item => item.serviceStatus === "Complete").length
        // const inLen = record.inspections.length
        // const inDone = record.inspections.filter(item => item.status === "Completed").length
        // const allServicesOrInspectionComplete =
        //   estLen === estDone &&
        //   tireLen === tireDone &&
        //   genLen === genDone &&
        //   inLen === inDone;

        if (isMobile) {
          return (
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewInvoice(record.code)}
                block
              >
                View
              </Button>
              <Button
                title={record?.invoiceSent ? "Resend" : "Send"}
                icon={record?.invoiceSent ? <RedoOutlined /> : <SendOutlined />}
                onClick={() => handleSendInvoice(record)}
                block={isMobile}
              >
                {record?.invoiceSent ? "Resend" : "Send"}
              </Button>
              <PDFDownloadLink
                document={<InvoiceDocument invoice={record} />}
                fileName={`invoice_${record.code}.pdf`}
                style={{ textDecoration: 'none', width: '100%' }}
              >
                {() => (
                  <Button
                    // disabled={!allServicesOrInspectionComplete} 
                    icon={<DownloadOutlined />}
                    size="small"
                    block
                  >
                    Download
                  </Button>
                )}
              </PDFDownloadLink>
              <Button
                // disabled={!allServicesOrInspectionComplete} 
                icon={<PrinterFilled />}
                onClick={() => handlePrintInvoice(record)}
                size="small"
                block
              >
                Print
              </Button>
            </Space>
          );
        }

        return (
          <Space size="middle">
            <Button
              title="View"
              icon={<EyeOutlined />}
              onClick={() => handleViewInvoice(record.code)}
            />


            <Button
              title={record?.invoiceSent ? "Resend" : "Send"}
              icon={record?.invoiceSent ? <RedoOutlined /> : <SendOutlined />}
              onClick={() => handleSendInvoice(record)}
            >
            </Button>
            <PDFDownloadLink
              document={<InvoiceDocument invoice={record} />}
              fileName={`invoice_${record.code}.pdf`}
              style={{ textDecoration: "none" }}
            >
              {() => (
                <Button
                  title="Download"
                  // disabled={!allServicesOrInspectionComplete}
                  icon={<DownloadOutlined />}
                />
              )}
            </PDFDownloadLink>

            <Button
              title="Print"
              // disabled={!allServicesOrInspectionComplete}
              icon={<PrinterFilled />}
              onClick={() => handlePrintInvoice(record)}
            />

          </Space>
        );
      },
    },
  ];

  const expandedRowRender = (record: InvoiceItem) => {
    const serviceColumns: TableColumnsType<TechnicianEstimateService> = [
      {
        title: 'Code',
        dataIndex: ['service', 'code'],
        key: 'serviceCode',
        responsive: isMobile ? [] : ['md'] as any,
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
        responsive: isMobile ? [] : ['lg'] as any,
      },
      {
        title: 'Status',
        dataIndex: 'serviceStatus',
        key: 'status',
        render: (status: string) => {
          let color = 'gray';
          if (status === 'Complete') color = 'green';
          else if (status === 'Incomplete') color = 'orange';
          else if (status === 'Waiting_For_Parts') color = 'blue';
          return <Tag color={color} style={{ fontSize: isMobile ? '10px' : '12px' }}>{status}</Tag>;
        }
      },
      {
        title: 'Comments',
        key: 'comments',
        responsive: isMobile ? [] : ['xl'] as any,
        render: (_, service) => (
          <div>
            {service.TechnicianComment.map((comment, idx) => (
              <div key={idx}>
                <Text type="secondary" style={{ fontSize: isMobile ? '10px' : '12px' }}>
                  {comment.comment}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: isMobile ? '8px' : '10px' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </div>
            ))}
          </div>
        ),
      },
    ];

    return (
      <Table
        columns={serviceColumns}
        dataSource={[...record.TechnicianEstimateService, ...record.TechnicianItemTireService, ...record.TechnicianItemGeneralService]}
        pagination={false}
        rowKey={(record) => record.serviceCode}

        scroll={{ x: isMobile ? 300 : undefined }}
      />
    );
  };

  const expandedInspectionRowRender = (record: InvoiceItem) => {
    const inspectionColumns: TableColumnsType<any> = [
      {
        title: 'Code',
        dataIndex: 'inspectionCode',
        key: 'inspectionCode',
        responsive: isMobile ? [] : ['md'] as any,
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
        responsive: isMobile ? [] : ['lg'] as any,
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
          return <Tag color={color} style={{ fontSize: isMobile ? '10px' : '12px' }}>{status}</Tag>;
        },
      },
    ];

    return (
      <Table
        columns={inspectionColumns}
        dataSource={record.inspections}
        pagination={false}
        rowKey={(row) => row.inspectionCode}

        scroll={{ x: isMobile ? 300 : undefined }}
      />
    );
  };

  return (
    <div style={{
      padding: isMobile ? '8px' : '16px',
      maxWidth: '100%',

    }}>
      <div className="mb-2">
        <SearchInput
          placeholder="Search..."

          resetFilters={resetFilters}
        />
      </div>

      <Card size={isMobile ? 'small' : 'default'}>
        <div className="w-full overflow-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="code"
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ padding: isMobile ? '8px 0' : '16px 0' }}>
                  <h3 > Services</h3>
                  {expandedRowRender(record)}
                  <h3 > Inspections</h3>
                  {expandedInspectionRowRender(record)}
                </div>
              ),
            }}
            bordered

            className={isMobile ? 'mobile-invoice-table' : ''}
          />
        </div>
      </Card>

      <style jsx>{`
        .mobile-invoice-table .ant-table-thead > tr > th {
          font-size: 12px !important;
          padding: 8px 4px !important;
          white-space: nowrap !important;
        }
        .mobile-invoice-table .ant-table-tbody > tr > td {
          font-size: 12px !important;
          padding: 8px 4px !important;
        }
        .mobile-invoice-table .ant-tag {
          font-size: 10px !important;
          padding: 0 4px !important;
        }
        .mobile-invoice-table .ant-btn {
          font-size: 11px !important;
        }
        .mobile-invoice-table .ant-space-item {
          margin-bottom: 4px !important;
        }
        .mobile-invoice-table .ant-table-container {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
        @media (max-width: 768px) {
          .ant-table-expanded-row > td {
            padding: 8px !important;
          }
          .ant-card-body {
            padding: 12px !important;
          }
          .ant-table-wrapper {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .ant-table {
            min-width: 800px !important;
          }
          .ant-pagination-simple {
            margin: 8px 0 !important;
          }
          .ant-pagination-simple .ant-pagination-simple-pager {
            margin: 0 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoiceList;