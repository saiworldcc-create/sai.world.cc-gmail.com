export default function InvoiceGenerator({ shipment }) {
  const handlePrint = () => {
    // Basic print setup - in a real app, you might use a library like react-to-print
    // or open a new window with just the invoice HTML and call print()
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Commercial Invoice - ${shipment.awb}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 5px; vertical-align: top; }
            .invoice-box table tr.top table td { padding-bottom: 20px; }
            .invoice-box table tr.top table td.title { font-size: 35px; line-height: 45px; color: #333; }
            .invoice-box table tr.information table td { padding-bottom: 40px; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.details td { padding-bottom: 20px; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.item.last td { border-bottom: none; }
            .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            .barcode { font-family: 'Libre Barcode 39', monospace; font-size: 40px; margin-top: 10px; }
            @media print { .invoice-box { box-shadow: none; border: none; } }
          </style>
          <!-- Using Google Fonts for Barcode simulation -->
          <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="invoice-box">
            <table>
              <tr class="top">
                <td colspan="2">
                  <table>
                    <tr>
                      <td class="title">
                        <strong style="color: #0d2840;">SAI</strong><br/>
                        <span style="font-size: 14px; color: #777;">International Couriers & Cargo</span>
                      </td>
                      <td style="text-align: right;">
                        Invoice #: INV-${Math.floor(Math.random() * 100000)}<br>
                        Created: ${new Date(shipment.createdAt).toLocaleDateString()}<br>
                        <strong>AWB: ${shipment.awb}</strong>
                        <div class="barcode">*${shipment.awb}*</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="information">
                <td colspan="2">
                  <table>
                    <tr>
                      <td>
                        <strong>Shipper (Sender)</strong><br>
                        ${shipment.senderName}<br>
                        ${shipment.originHub}<br>
                        Andhra Pradesh, India
                      </td>
                      <td style="text-align: right;">
                        <strong>Consignee (Receiver)</strong><br>
                        ${shipment.receiverName}<br>
                        ${shipment.destination}<br>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr class="heading">
                <td>Item Description</td>
                <td style="text-align: right;">Details</td>
              </tr>
              <tr class="item">
                <td>Declared Contents</td>
                <td style="text-align: right;">${shipment.items}</td>
              </tr>
              <tr class="item">
                <td>Total Chargeable Weight</td>
                <td style="text-align: right;">${shipment.weight}</td>
              </tr>
              <tr class="item last">
                <td>Service Type</td>
                <td style="text-align: right;">Express International Freight</td>
              </tr>
              <tr class="total">
                <td></td>
                <td style="text-align: right;">Total Paid: ${shipment.price}</td>
              </tr>
            </table>
            
            <div style="margin-top: 50px; font-size: 12px; color: #888; text-align: center;">
              This is a computer generated commercial invoice. <br>
              Track your shipment at www.saicouriers.com/tracking
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <button onClick={handlePrint} className="btn btn-teal">
      <i className="fa-solid fa-print"></i> Print Commercial Invoice
    </button>
  );
}
