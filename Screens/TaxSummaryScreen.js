import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
};

const TaxSummaryScreen = ({ route }) => {
  const { userData, authData, taxSurveyData, totalTax, pendingTax, discount, lateFee } = route.params || {};
  // Merge userData and authData for best coverage
  const mergedUser = { ...(authData || {}), ...(userData || {}) };
  const {
    firstName, username, houseNumber, colonyName, localityName, zoneName, mobileNumber, emailID
  } = mergedUser;

  // GST and Other Tax
  const gst = 18;
  const otherTax = 2;
  const gstAmount = (pendingTax * gst) / 100;
  const otherTaxAmount = (pendingTax * otherTax) / 100;
  const totalAmount = parseFloat(pendingTax) + gstAmount + otherTaxAmount;

  const [isPaid, setIsPaid] = useState(false);
  const [paymentRefId, setPaymentRefId] = useState('');

  const handlePay = () => {
    // Generate a random payment reference ID
    const refId = 'PAY' + Math.floor(100000 + Math.random() * 900000);
    setPaymentRefId(refId);
    Alert.alert('Success', `Your tax amount ₹${totalAmount.toFixed(2)} has been paid.\nPayment Ref: ${refId}`);
    setIsPaid(true);
  };

  // Export invoice as PDF
  const handleExport = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; }
            .header { text-align: center; font-size: 18px; font-weight: bold; }
            .subHeader { text-align: center; font-size: 14px; }
            .invoiceTitle { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            .metaRow { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .metaCol { font-size: 12px; }
            .detailsBox { margin-bottom: 10px; }
            .detail { font-size: 12px; }
            .detailLabel { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 4px; font-size: 10px; text-align: center; }
            .summaryBox { margin-top: 10px; display: flex; flex-direction: column; align-items: flex-end; }
            .summaryText { font-weight: bold; font-size: 12px; }
            .refText { color: #007bff; margin-top: 6px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">Nagar Panchayat Babrala</div>
          <div class="subHeader">District Sambhal</div>
          <div class="invoiceTitle">PROPERTY TAX INVOICE</div>
          <div class="metaRow">
            <div class="metaCol">
              <div><span class="detailLabel">GSTIN:</span> NA</div>
              <div><span class="detailLabel">PAN No.:</span> NA</div>
              <div><span class="detailLabel">REVERSE CHARGE:</span> N.A.</div>
            </div>
            <div class="metaCol">
              <div><span class="detailLabel">INVOICE DATE:</span> ${formatDate(taxSurveyData?.[0]?.TaxCalculatedDate)}</div>
              <div><span class="detailLabel">INVOICE NO.:</span> ${taxSurveyData?.[0]?.ReferenceNo || 'N/A'}</div>
              <div><span class="detailLabel">DUE DATE:</span> ${formatDate(taxSurveyData?.[0]?.TaxModifiedDate)}</div>
            </div>
          </div>
          <div class="detailsBox">
            <div class="detail"><span class="detailLabel">INVOICE TO:</span> ${firstName || ''}</div>
            <div class="detail"><span class="detailLabel">HOUSE NO.:</span> ${houseNumber || '-'}</div>
            <div class="detail"><span class="detailLabel">COLONY:</span> ${colonyName || '-'}</div>
            <div class="detail"><span class="detailLabel">LOCALITY:</span> ${localityName || '-'}</div>
            <div class="detail"><span class="detailLabel">ZONE:</span> ${zoneName || '-'}</div>
            <div class="detail"><span class="detailLabel">MOBILE NO.:</span> ${mobileNumber || '-'}</div>
            <div class="detail"><span class="detailLabel">EMAIL:</span> ${emailID || 'N/A'}</div>
          </div>
          <table>
            <tr>
              <th>Sno</th>
              <th>Tax Amount</th>
              <th>Tax Paid Amount</th>
              <th>Remaining Amount</th>
              <th>Tax Calculated Date</th>
              <th>Tax Pending</th>
              <th>Paid Status</th>
              <th>Tax Paid Date</th>
              <th>Tax Paid Mode</th>
              <th>UTR No</th>
              <th>Remark</th>
            </tr>
            ${
              taxSurveyData && taxSurveyData.length > 0
                ? taxSurveyData.map((row, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>₹${row.TaxAmount?.toFixed(2) || '0.00'}</td>
                    <td>₹${row.TaxPaidAmount?.toFixed(2) || 'N/A'}</td>
                    <td>₹${(row.TaxAmount - (row.TaxPaidAmount || 0)).toFixed(2)}</td>
                    <td>${formatDate(row.TaxCalculatedDate)}</td>
                    <td>${row.TaxPending ? 'Yes' : 'No'}</td>
                    <td>${row.PaidStatus ? 'Paid' : 'Pending'}</td>
                    <td>${formatDate(row.TaxPaidDate)}</td>
                    <td>${row.TaxPaidMode || 'N/A'}</td>
                    <td>${row.UtrNo || 'N/A'}</td>
                    <td>${row.Remark || 'N/A'}</td>
                  </tr>
                `).join('')
                : '<tr><td colspan="11">No tax data available.</td></tr>'
            }
          </table>
          <div class="summaryBox">
            <div class="summaryText">Subtotal: ₹${pendingTax?.toFixed(2) || '0.00'}</div>
            <div class="summaryText">GST (18%): ₹${gstAmount.toFixed(2)}</div>
            <div class="summaryText">Other Tax (2%): ₹${otherTaxAmount.toFixed(2)}</div>
            <div class="summaryText">Total Amount: ₹${totalAmount.toFixed(2)}</div>
            ${(isPaid && paymentRefId) ? `<div class="refText">Payment Ref: ${paymentRefId}</div>` : ''}
          </div>
        </body>
      </html>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: `invoice_${Date.now()}`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('PDF Saved', `Invoice PDF saved at: ${file.filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save invoice PDF.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Nagar Panchayat Babrala</Text>
        <Text style={styles.subHeader}>District Sambhal</Text>
        <Text style={styles.invoiceTitle}>PROPERTY TAX INVOICE</Text>
        {/* Invoice meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.meta}><Text style={styles.metaLabel}>GSTIN:</Text> NA</Text>
            <Text style={styles.meta}><Text style={styles.metaLabel}>PAN No.:</Text> NA</Text>
            <Text style={styles.meta}><Text style={styles.metaLabel}>REVERSE CHARGE:</Text> N.A.</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.meta}><Text style={styles.metaLabel}>INVOICE DATE:</Text> {formatDate(taxSurveyData?.[0]?.TaxCalculatedDate)}</Text>
            <Text style={styles.meta}><Text style={styles.metaLabel}>INVOICE NO.:</Text> {taxSurveyData?.[0]?.ReferenceNo || 'N/A'}</Text>
            <Text style={styles.meta}><Text style={styles.metaLabel}>DUE DATE:</Text> {formatDate(taxSurveyData?.[0]?.TaxModifiedDate)}</Text>
          </View>
        </View>
        <View style={styles.detailsBox}>
          <Text style={styles.detail}><Text style={styles.detailLabel}>INVOICE TO:</Text> {firstName || ''}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>HOUSE NO.:</Text> {houseNumber || '-'}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>COLONY:</Text> {colonyName || '-'}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>LOCALITY:</Text> {localityName || '-'}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>ZONE:</Text> {zoneName || '-'}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>MOBILE NO.:</Text> {mobileNumber || '-'}</Text>
          <Text style={styles.detail}><Text style={styles.detailLabel}>EMAIL:</Text> {emailID || 'N/A'}</Text>
        </View>
        {/* Table header */}
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeader}>Sno</Text>
          <Text style={styles.tableHeader}>Tax Amount</Text>
          <Text style={styles.tableHeader}>Tax Paid Amount</Text>
          <Text style={styles.tableHeader}>Remaining Amount</Text>
          <Text style={styles.tableHeader}>Tax Calculated Date</Text>
          <Text style={styles.tableHeader}>Tax Pending</Text>
          <Text style={styles.tableHeader}>Paid Status</Text>
          <Text style={styles.tableHeader}>Tax Paid Date</Text>
          <Text style={styles.tableHeader}>Tax Paid Mode</Text>
          <Text style={styles.tableHeader}>UTR No</Text>
          <Text style={styles.tableHeader}>Remark</Text>
        </View>
        {/* Table rows */}
        {taxSurveyData && taxSurveyData.length > 0 ? (
          taxSurveyData.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tableCell}>{idx + 1}</Text>
              <Text style={styles.tableCell}>₹{row.TaxAmount?.toFixed(2) || '0.00'}</Text>
              <Text style={styles.tableCell}>₹{row.TaxPaidAmount?.toFixed(2) || 'N/A'}</Text>
              <Text style={styles.tableCell}>₹{(row.TaxAmount - (row.TaxPaidAmount || 0)).toFixed(2)}</Text>
              <Text style={styles.tableCell}>{formatDate(row.TaxCalculatedDate)}</Text>
              <Text style={styles.tableCell}>{row.TaxPending ? 'Yes' : 'No'}</Text>
              <Text style={styles.tableCell}>{row.PaidStatus ? 'Paid' : 'Pending'}</Text>
              <Text style={styles.tableCell}>{formatDate(row.TaxPaidDate)}</Text>
              <Text style={styles.tableCell}>{row.TaxPaidMode || 'N/A'}</Text>
              <Text style={styles.tableCell}>{row.UtrNo || 'N/A'}</Text>
              <Text style={styles.tableCell}>{row.Remark || 'N/A'}</Text>
            </View>
          ))
        ) : (
          <Text>No tax data available.</Text>
        )}
        {/* Summary */}
        <View style={[styles.summaryBox, { alignItems: 'flex-end' }]}> {/* Right align summary */}
          <Text style={styles.summaryText}>Subtotal: ₹{pendingTax?.toFixed(2) || '0.00'}</Text>
          <Text style={styles.summaryText}>GST (18%): ₹{gstAmount.toFixed(2)}</Text>
          <Text style={styles.summaryText}>Other Tax (2%): ₹{otherTaxAmount.toFixed(2)}</Text>
          <Text style={styles.summaryText}>Total Amount: ₹{totalAmount.toFixed(2)}</Text>
          {isPaid && paymentRefId ? (
            <Text style={[styles.summaryText, { color: '#007bff', marginTop: 6 }]}>Payment Ref: {paymentRefId}</Text>
          ) : null}
        </View>
      </ScrollView>
      {/* Download button OUTSIDE the invoiceRef so it is not captured in the image */}
      {isPaid && (
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Download Invoice (PDF)</Text>
        </TouchableOpacity>
      )}
      {!isPaid && (
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pay ₹{totalAmount.toFixed(2)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8, backgroundColor: '#fff' },
  header: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 6 },
  subHeader: { fontSize: 12, textAlign: 'center', marginBottom: 2 },
  invoiceTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  metaCol: {},
  meta: { fontSize: 10 },
  metaLabel: { fontWeight: 'bold' },
  detailsBox: { marginBottom: 6 },
  detail: { fontSize: 10 },
  detailLabel: { fontWeight: 'bold' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f2f2f2', paddingVertical: 3, marginTop: 6 },
  tableHeader: { flex: 1, fontWeight: 'bold', fontSize: 9, textAlign: 'center' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingVertical: 2 },
  tableCell: { flex: 1, fontSize: 8, textAlign: 'center' },
  summaryBox: { marginTop: 8, marginBottom: 6 },
  summaryText: { fontWeight: 'bold', fontSize: 10, marginBottom: 1 },
  payButton: { backgroundColor: '#222', padding: 10, borderRadius: 6, margin: 8 },
  payButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 6, margin: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
});

export default TaxSummaryScreen;
