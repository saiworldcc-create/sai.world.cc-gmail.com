const PDFDocument = require('pdfkit');

/**
 * Generate a professional booking invoice PDF as a Buffer
 */
function generateBookingInvoicePDF(bookingData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
          Title: `Booking Invoice - ${bookingData.awb}`,
          Author: 'Sai International Couriers & Cargo',
          Subject: 'Booking Invoice',
        },
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const {
        awb,
        senderName,
        senderPhone,
        senderAddress,
        branchZone,
        pickupDate,
        pickupTimeSlot,
        destCountry,
        receiverName,
        receiverPhone,
        itemCategory,
        estimatedWeight,
        specialInstructions,
        createdAt,
      } = bookingData;

      const invoiceDate = createdAt
        ? new Date(createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      // ── Colors ──
      const darkBlue = '#1E3446';
      const teal = '#3C9290';
      const blue = '#0056B3';
      const gray = '#64748B';
      const lightGray = '#F1F5F9';
      const black = '#1A202C';
      const white = '#FFFFFF';
      const green = '#166534';
      const greenBg = '#F0FDF4';

      // ── Header Banner ──
      doc.rect(0, 0, doc.page.width, 100).fill(darkBlue);
      
      doc.fontSize(20).fillColor(white).font('Helvetica-Bold')
        .text('SAI INTERNATIONAL COURIERS & CARGO', 50, 30, { align: 'center' });
      doc.fontSize(10).fillColor(teal).font('Helvetica')
        .text('Worldwide Express Courier & Cargo Solutions', 50, 55, { align: 'center' });
      doc.fontSize(8).fillColor('#94A3B8').font('Helvetica')
        .text('GSTIN: 37BOPPS1121H1Z5 | www.saiinternationalcouriers.com', 50, 72, { align: 'center' });

      // ── BOOKING CONFIRMED badge ──
      const badgeY = 115;
      const badgeWidth = 200;
      const badgeX = (doc.page.width - badgeWidth) / 2;
      doc.roundedRect(badgeX, badgeY, badgeWidth, 28, 14).fill(greenBg);
      doc.roundedRect(badgeX, badgeY, badgeWidth, 28, 14).lineWidth(1).stroke('#BBF7D0');
      doc.fontSize(11).fillColor(green).font('Helvetica-Bold')
        .text('✓ BOOKING CONFIRMED', badgeX, badgeY + 8, { width: badgeWidth, align: 'center' });

      // ── AWB Box ──
      const awbY = 155;
      doc.roundedRect(50, awbY, doc.page.width - 100, 65, 8).fill(greenBg);
      doc.roundedRect(50, awbY, doc.page.width - 100, 65, 8).lineWidth(1).stroke('#BBF7D0');
      doc.fontSize(9).fillColor(green).font('Helvetica-Bold')
        .text('AIR WAYBILL (AWB) REFERENCE', 50, awbY + 10, { width: doc.page.width - 100, align: 'center' });
      doc.fontSize(26).fillColor(blue).font('Helvetica-Bold')
        .text(awb, 50, awbY + 28, { width: doc.page.width - 100, align: 'center' });

      // ── Invoice Meta Line ──
      const metaY = awbY + 75;
      doc.fontSize(9).fillColor(gray).font('Helvetica')
        .text(`Invoice Date: ${invoiceDate}`, 50, metaY);
      doc.text(`Invoice No: INV-${awb}`, 50, metaY, { align: 'right', width: doc.page.width - 100 });

      // ── Horizontal Divider ──
      const divY = metaY + 18;
      doc.moveTo(50, divY).lineTo(doc.page.width - 50, divY).lineWidth(1).stroke('#E2E8F0');

      // ── Helper: Section Header ──
      function sectionHeader(title, y) {
        doc.fontSize(12).fillColor(darkBlue).font('Helvetica-Bold')
          .text(title, 50, y);
        doc.moveTo(50, y + 17).lineTo(doc.page.width - 50, y + 17).lineWidth(1).stroke('#E2E8F0');
        return y + 25;
      }

      // ── Helper: Table Row ──
      function tableRow(label, value, y) {
        doc.fontSize(10).fillColor(gray).font('Helvetica')
          .text(label, 60, y, { width: 150 });
        doc.fontSize(10).fillColor(black).font('Helvetica')
          .text(value || '-', 210, y, { width: 300 });
        return y + 20;
      }

      function tableRowBold(label, value, y, valueColor) {
        doc.fontSize(10).fillColor(gray).font('Helvetica')
          .text(label, 60, y, { width: 150 });
        doc.fontSize(11).fillColor(valueColor || blue).font('Helvetica-Bold')
          .text(value || '-', 210, y, { width: 300 });
        return y + 22;
      }

      // ── Section 1: Sender Details ──
      let currentY = sectionHeader('Sender Details (Pickup Location)', divY + 12);
      currentY = tableRow('Sender Name:', senderName, currentY);
      currentY = tableRow('Phone:', senderPhone, currentY);
      currentY = tableRow('Pickup Address:', senderAddress || 'As provided', currentY);
      // Handle multi-line address
      if (senderAddress && senderAddress.length > 55) {
        currentY += 10;
      }
      currentY = tableRow('Branch Zone:', branchZone || 'Kadapa Main', currentY);
      currentY = tableRow('Pickup Date:', pickupDate || 'Earliest available', currentY);
      currentY = tableRow('Pickup Time:', pickupTimeSlot || 'Standard', currentY);

      // ── Divider ──
      currentY += 5;
      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).lineWidth(0.5).stroke('#E2E8F0');
      currentY += 10;

      // ── Section 2: Shipment & Destination ──
      currentY = sectionHeader('Shipment & Destination Details', currentY);
      currentY = tableRowBold('Destination Country:', destCountry, currentY, blue);
      currentY = tableRow('Receiver Name:', receiverName, currentY);
      currentY = tableRow('Receiver Phone:', receiverPhone, currentY);
      currentY = tableRow('Item Category:', itemCategory || 'NRI Food & Pickles', currentY);
      currentY = tableRow('Estimated Weight:', estimatedWeight || 'Standard', currentY);
      if (specialInstructions) {
        currentY = tableRow('Special Instructions:', specialInstructions, currentY);
        if (specialInstructions.length > 55) {
          currentY += 10;
        }
      }

      // ── Divider ──
      currentY += 5;
      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).lineWidth(0.5).stroke('#E2E8F0');
      currentY += 12;

      // ── What Happens Next Box ──
      doc.roundedRect(50, currentY, doc.page.width - 100, 90, 6).fill(lightGray);
      doc.fontSize(11).fillColor(darkBlue).font('Helvetica-Bold')
        .text('What happens next?', 65, currentY + 10);
      doc.fontSize(9).fillColor('#475569').font('Helvetica');
      const nextSteps = [
        '• Our pickup executive will arrive at your address with digital weighing scales, export cartons, and vacuum sealing machine.',
        '• You will receive a WhatsApp notification with live tracking updates.',
        '• For any queries, contact us immediately on the numbers below.',
      ];
      let stepY = currentY + 28;
      nextSteps.forEach(step => {
        doc.text(step, 65, stepY, { width: doc.page.width - 140 });
        stepY += 18;
      });
      currentY += 100;

      // ── Contact Info Box ──
      doc.roundedRect(50, currentY, doc.page.width - 100, 70, 6).fill('#EFF6FF');
      doc.roundedRect(50, currentY, doc.page.width - 100, 70, 6).lineWidth(1).stroke('#BFDBFE');
      doc.fontSize(10).fillColor(darkBlue).font('Helvetica-Bold')
        .text('Contact Us Anytime', 50, currentY + 10, { width: doc.page.width - 100, align: 'center' });
      doc.fontSize(9).fillColor('#475569').font('Helvetica')
        .text('Phone: +91 90599 49365 | +91 96031 49365 | +91 96030 49365', 50, currentY + 28, { width: doc.page.width - 100, align: 'center' })
        .text('WhatsApp: +91 90599 49365 | Email: saiinternationalcouriers83@gmail.com', 50, currentY + 42, { width: doc.page.width - 100, align: 'center' })
        .text('Address: 41/1248, Ratna Sabhapathi Building, Co-operative Colony, Kadapa, A.P.', 50, currentY + 56, { width: doc.page.width - 100, align: 'center' });

      currentY += 80;

      // ── Footer ──
      const footerY = doc.page.height - 50;
      doc.rect(0, footerY - 10, doc.page.width, 60).fill(darkBlue);
      doc.fontSize(8).fillColor('#94A3B8').font('Helvetica')
        .text('Sai International Couriers & Cargo · GSTIN: 37BOPPS1121H1Z5 · Kadapa, Andhra Pradesh', 50, footerY, { width: doc.page.width - 100, align: 'center' })
        .text('This is a computer-generated invoice and does not require a signature.', 50, footerY + 14, { width: doc.page.width - 100, align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateBookingInvoicePDF };
