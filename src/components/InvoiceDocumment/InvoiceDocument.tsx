import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from '@react-pdf/renderer';
import mediaImg from "@/assets/media.png";
import { BsBorderRight } from 'react-icons/bs';



// ─── Types — matches your existing InvoiceItem shape exactly ─────────────────

interface InvoiceDocumentProps {
  invoice: {
    code: string;
    title: string;
    type: string;
    description: string;
    totalHours: string;
    totalAmount: number;
    labourTotalAmount: number;
    partsTotalAmount: number;
    inspectionTotalAmount: number;
    inspectionTotalHours: string;
    labourTotalHours: string;
    invoiceId?: string;
    invoiceCreated?: string;
    customers: {
      user: {
        name: string;
        email: string;
        contactNum: string;
        preferredCommunicationType?: string;
      };
    }[];
    vehicle: {
      vehicle: {
        numberPlate: string;
        make: string;
        model: string;
        year: number;
        color?: string;
      };
    }[];
    inspections?: {
      inspectionCode: string;
      inspectionTitle: string;
      inspectionDescription: string;
      stage: string;
      status: string;
    }[];
    TechnicianEstimateService?: {
      serviceStatus: string;
      serviceCode: string;
      service: {
        code: string;
        title: string;
        description: string | null;
        part: any;
        labour: any;
      };
    }[];
    TechnicianItemGeneralService?: any[];
    TechnicianItemTireService?: any[];
    appointment?: {
      scheduled: string;
    }
  };
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  darkGreen: '#000000',   // near black (text)
  accentGreen: '#000000',   // dark gray
  lightGreen: '#ffffff',   // white
  subGreen: '#f5f5f5',   // very light gray
  darkGray: '#000000',
  midGray: '#000000',
  lightGray: '#fafafa',   // almost white
  borderGray: '#000000',   // light border (printer friendly)
  white: '#ffffff',
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: C.darkGray,
    backgroundColor: C.white,
  },

  // ── Header
  headerBar: {
    backgroundColor: "#ffffff",
    marginHorizontal: -40,
    marginTop: -15,
    paddingHorizontal: 40,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerCompany: {
    fontSize: 11.5,
    fontWeight: 'bold',
    fontFamily: "Helvetica",
    color: "#000000",
  },

  headerTagline: {
    fontSize: 10.5,
    marginTop: 2,

  },

  headerLogo: {
    width: 110,
    height: 35,
    objectFit: "contain" as const,
  },
  qrContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  accentBar: {
    height: 2,
    backgroundColor: "#2f9e44",
    marginHorizontal: -40,
    marginBottom: 14,
  },

  // ── Title
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  titleText: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.darkGreen },
  titleNumber: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.accentGreen },
  dividerGreen: { borderBottomWidth: 3, borderBottomColor: C.darkGreen, marginBottom: 10 },
  dividerThin: { borderBottomWidth: 1.5, borderBottomColor: C.darkGreen, marginBottom: 10 },
  dividerLight: { borderBottomWidth: 0.5, borderBottomColor: C.borderGray, marginBottom: 8 },

  // ── Info cards
  // ── Info cards
  infoRow: {
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 0.5,        // outer border wrapping all 3 cards
    borderColor: '#000000',
  },
  infoCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,

  },
  infoCardBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#000000',
  },
  // in styles
  infoCardBorderRight: {
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
  },
  infoHeading: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.accentGreen,
    marginBottom: 5,
  },
  infoLabel: { fontSize: 8, color: C.darkGray, lineHeight: 1.6 },
  infoBold: { fontFamily: 'Helvetica-Bold' },

  // ── Section header
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.darkGreen,
    marginBottom: 2

  },

  // ── Service block
  serviceTitleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderTopWidth: 0.5,
    borderTopColor: C.darkGreen,
  },
  serviceTitleText: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: C.darkGreen },
  serviceMeta: { flexDirection: 'row', gap: 14 },
  serviceCode: { fontSize: 8, color: C.midGray },
  serviceStatus: { fontSize: 8, color: C.midGray },
  serviceDescription: {
    fontSize: 7.8,
    color: C.midGray,
    lineHeight: 1.55,
    marginTop: 5,
    marginBottom: 6,
  },

  // ── Line items table
  tableBorder: {
    borderWidth: 0.5,
    borderTopColor: C.borderGray,
    marginBottom: 14,
    borderBottomColor: C.borderGray,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 7 },

  tableRowSub: {
    flexDirection: 'row',
    paddingVertical: 4,

  },
  thText: { fontSize: 7.8, fontFamily: 'Helvetica-Bold', color: C.white },
  tdText: { fontSize: 8.5, color: C.darkGray },
  tdBold: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.darkGray },

  colDesc: { flex: 2.8 },
  colQty: { flex: 1.2, textAlign: 'right' },
  colRate: { flex: 1.8, textAlign: 'right' },
  colTag: { flex: 1.2 },
  colAmount: { flex: 1.2, textAlign: 'right' },

  // ── Totals
  totalsWrapper: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20, marginTop: 10 },
  totalsTable: { width: 300, borderWidth: 0.5, borderLeftColor: C.borderGray },
  totalRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 10, borderTopWidth: 0.5, borderTopColor: C.borderGray, borderLeftWidth: 0.5, borderLeftColor: C.borderGray, borderRightWidth: 0.5, borderRightColor: C.borderGray, },
  totalRowAlt: { backgroundColor: C.lightGray, },
  totalRowGrand: { backgroundColor: C.darkGreen },
  totalLabel: { flex: 2, fontSize: 9, color: C.darkGray },
  totalHours: { flex: 1, fontSize: 9, color: C.darkGray, textAlign: 'right' },
  totalAmount: { flex: 1.2, fontSize: 9, color: C.darkGray, textAlign: 'right' },
  totalLabelBold: { flex: 2, fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.darkGray },
  totalHoursBold: { flex: 1, fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'right' },
  totalAmountBold: { flex: 1.2, fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'right' },

  // ── Terms
  termsHeading: { fontSize: 9, fontFamily: 'Helvetica', color: C.darkGreen, marginBottom: 5 },
  questionHeading: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.darkGreen, marginBottom: 5 },
  termItem: { fontSize: 8, color: C.midGray, lineHeight: 1.6, marginBottom: 2, paddingLeft: 8 },

  // ── Signatures
  sigRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  sigField: { fontSize: 8, color: C.darkGray },

  // ── Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 50,

    paddingTop: 6,
    paddingBottom: 40,

  },

  footerLine: {
    borderTopWidth: 3,
    borderTopColor: "#000",
    marginBottom: 4,
  },

  footerCompany: {
    fontSize: 7,
    textAlign: "center",
    marginBottom: 2,
  },

  footerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },

  footerDate: {
    fontSize: 8,
  },

  footerPage: {
    fontSize: 8,
  },
});



// ─── Component ────────────────────────────────────────────────────────────────

const InvoiceDocument: React.FC<InvoiceDocumentProps> = ({ invoice }) => {
  const cust = invoice.customers[0]?.user;
  const veh = invoice.vehicle[0]?.vehicle;
  const date = invoice.invoiceCreated ? invoice.invoiceCreated.split('T')[0] : '';
  const services = [
    ...(invoice?.TechnicianEstimateService || []),
    ...(invoice?.TechnicianItemGeneralService || []),
    ...(invoice?.TechnicianItemTireService || []),
  ];
  const inspections = invoice?.inspections ?? [];
  return (
    <Document>
      <Page size="A4" style={s.page}>

        <View style={s.headerBar}>

          {/* Left Side - Text (50%) */}
          <View style={{ flex: 1 }}>
            <Text style={s.headerCompany}>
              ZhoopZhoop Collision & Mechanical
            </Text>

            <Text style={s.headerTagline}>
              5517 Dundas St W, Etobicoke, ON{"\n"}
              GST/HST 788752152 RT0001{"\n"}
              416 975 4070
            </Text>
            <Text style={s.headerTagline}>
              info@zhoopzhoop.com
            </Text>
          </View>

          {/* Right Side - Image (50%) */}
          <View style={{ flex: 1, alignItems: "flex-end", justifyContent: "center" }}>
            <Image
              source={mediaImg.src}

            />
          </View>

        </View>



        {/* ── Title ── */}
        <View style={s.titleRow}>
          <Text style={s.titleText}>{invoice.type}</Text>

        </View>
        <View style={s.dividerGreen} />

        {/* ── Info Cards ── */}
        <View style={s.infoRow}>
          <View style={[s.infoCard, s.infoCardBorder]}>
            <Text style={s.infoHeading}>BILL TO</Text>
            <Text style={[s.infoLabel, s.infoBold]}>{cust?.name}</Text>
            <Text style={s.infoLabel}>{cust?.email}</Text>
            <Text style={s.infoLabel}>{cust?.contactNum}</Text>
            <Text style={s.infoLabel}>
              Preferred: {cust?.preferredCommunicationType?.toUpperCase() ?? 'N/A'}
            </Text>
          </View>

          <View style={[s.infoCard, s.infoCardBorder, s.infoCardBorderRight]}>
            <Text style={s.infoHeading}>VEHICLE INFO</Text>
            <Text style={s.infoLabel}>Plate  <Text style={s.infoBold}>{veh?.numberPlate}</Text></Text>
            <Text style={s.infoLabel}>Make   <Text style={s.infoBold}>{veh?.make}</Text></Text>
            <Text style={s.infoLabel}>Model  <Text style={s.infoBold}>{veh?.model}</Text></Text>
            <Text style={s.infoLabel}>Year   <Text style={s.infoBold}>{veh?.year}</Text></Text>
            <Text style={s.infoLabel}>Type   {veh?.color ?? 'N/A'}</Text>
          </View>

          <View style={[s.infoCard, s.infoCardBorderRight]}>
            <Text style={s.infoHeading}>ESTIMATE DETAILS</Text>
            <Text style={s.infoLabel}>Estimate #  <Text style={s.infoBold}>{invoice.title}</Text></Text>
            {invoice.invoiceId && (
              <Text style={s.infoLabel}>Invoice ID  <Text style={s.infoBold}>{invoice.invoiceId}</Text></Text>
            )}
            {invoice?.appointment ? (
              <Text style={s.infoLabel}>Appointment : <Text style={s.infoBold}>{new Date(invoice.appointment.scheduled).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}</Text></Text>
            ) : null}

            <Text style={s.infoLabel}>Promised : <Text style={s.infoBold}>{new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}</Text></Text>

            <Text style={s.infoLabel}>Advisor     NA</Text>
            <Text style={s.infoLabel}>Technician  NA</Text>
          </View>
        </View>



        {/* ── TechnicianEstimateService blocks ── */}
        <View>
          {/* ── Section Label ── */}
          <Text style={s.sectionHeader}>Service</Text>
          {services.map((svc, idx) => {
            const ParTotal = svc?.service?.part?.reduce(
              (sum: number, p: any) => sum + (p?.part?.total || 0),
              0);
            const labourTotal = svc?.service?.labour?.reduce(
              (sum: number, l: any) =>
                sum + (l?.requiredHours / 60) * (l?.labour?.ratePerHour || 0),
              0
            );
            return <View key={`svc-${idx}`} wrap={false}>
              <View style={s.serviceTitleBar}>
                <Text style={s.serviceTitleText}>{svc.service.title}</Text>
                <View style={s.serviceMeta}>
                  <Text style={s.serviceStatus}>{svc.serviceStatus}</Text>
                </View>
              </View>

              <Text style={s.serviceDescription}>

                {svc.service.description ? svc.service.description : ''}
              </Text>

              <View>

                <View style={s.tableRowSub}>

                  <Text style={[s.tdBold, s.colAmount]}>
                    Sub ${(ParTotal + labourTotal).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          })}
        </View>

        {/* ── Section Label ── */}
        {inspections?.length > 0 && (
          <Text style={s.sectionHeader}>Inspection</Text>
        )}
        {/* <View style={s.dividerThin} /> */}

        {/* ── Inspection blocks ── */}
        {inspections.map((insp, idx) => (
          <View key={`insp-${idx}`} wrap={false}>
            <View style={s.serviceTitleBar}>
              <Text style={s.serviceTitleText}>{insp.inspectionTitle}</Text>
              <View style={s.serviceMeta}>
                {/* <Text style={s.serviceCode}>{insp.inspectionCode}</Text> */}
                <Text style={s.serviceStatus}> {insp.status}</Text>
              </View>
            </View>

            <Text style={s.serviceDescription}>
              {insp.inspectionDescription?.trim() ? insp.inspectionDescription : ''}
            </Text>

            <View >
              <View style={s.tableRowSub}>
                <Text style={[s.tdBold, s.colAmount]}>Sub ${invoice.inspectionTotalAmount.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* ── Grand Totals ── */}
        <View style={s.totalsWrapper}>
          <View style={s.totalsTable}>

            <View style={[s.totalRow]}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalAmount}>${invoice.totalAmount.toFixed(2)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>HST(13%)</Text>
              <Text style={s.totalAmount}>${(invoice.totalAmount * 0.13).toFixed(2)}</Text>
            </View>
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>GRAND TOTAL</Text>
              <Text style={s.totalAmount}>${(Number((invoice.totalAmount * 0.13).toFixed(2)) + invoice.totalAmount).toFixed(2)}</Text>
            </View>
          </View>
        </View>
        {/* ── Footer ── */}
        <View style={s.footer} fixed>

          {/* separator line */}
          <View style={s.footerLine} />
          {/* bottom row */}
          <View style={s.footerBottom}>
            <Text style={s.footerDate}>
              {new Date().toLocaleString()}
            </Text>

            <Text
              style={s.footerPage}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>

        </View>

      </Page>
    </Document>
  );
};

export default InvoiceDocument;