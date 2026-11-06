const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const Shipment = require('../models/Shipment');
const Booking = require('../models/Booking');

exports.generateAWB = async (req, res) => {
  try {
    const rawAwb = req.params.awb.toUpperCase();
    
    // Find shipment or booking
    let data = await Shipment.findOne({ awb: rawAwb }).lean();
    if (!data) {
      data = await Booking.findOne({ awb: rawAwb }).lean();
    }

    if (!data) {
      return res.status(404).json({ success: false, message: 'AWB not found' });
    }

    // Prepare Document
    const doc = new PDFDocument({
      size: [288, 432], // 4x6 inches standard shipping label (72 points per inch)
      margins: { top: 15, bottom: 15, left: 15, right: 15 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=AWB_${rawAwb}.pdf`);
    doc.pipe(res);

    // Header section
    doc.rect(15, 15, 258, 402).stroke(); // Outer border
    doc.fontSize(16).font('Helvetica-Bold').text('SAI INTERNATIONAL', 15, 25, { align: 'center' });
    doc.fontSize(8).font('Helvetica').text('Express Courier & Cargo', 15, 45, { align: 'center' });
    doc.moveTo(15, 55).lineTo(273, 55).stroke(); // Header divider

    // Barcode Generation
    try {
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',
        text: rawAwb,
        scale: 3,
        height: 15,
        includetext: false,
      });
      doc.image(barcodeBuffer, 44, 65, { width: 200, height: 40 });
      doc.fontSize(12).font('Helvetica-Bold').text(rawAwb, 15, 110, { align: 'center', letterSpacing: 2 });
    } catch (bcErr) {
      console.error('Barcode Gen Error:', bcErr);
      doc.fontSize(12).font('Helvetica-Bold').text(rawAwb, 15, 85, { align: 'center', letterSpacing: 2 });
    }
    doc.moveTo(15, 130).lineTo(273, 130).stroke(); // Barcode divider

    // Routing info
    doc.fontSize(24).font('Helvetica-Bold').text(data.destination?.substring(0, 3).toUpperCase() || 'STD', 20, 140);
    doc.fontSize(10).font('Helvetica-Bold').text(data.status || 'STANDARD', 210, 150);
    doc.moveTo(15, 175).lineTo(273, 175).stroke();

    // From / To sections
    doc.fontSize(9).font('Helvetica-Bold').text('FROM:', 20, 185);
    doc.fontSize(8).font('Helvetica').text(data.senderName || data.sender || 'Sender', 20, 200);
    doc.text(data.senderPhone || 'N/A', 20, 212);
    doc.text(data.senderAddress || 'Address unavailable', 20, 224, { width: 110 });

    doc.moveTo(144, 175).lineTo(144, 275).stroke(); // Vertical divider

    doc.fontSize(9).font('Helvetica-Bold').text('TO:', 150, 185);
    doc.fontSize(9).font('Helvetica-Bold').text(data.receiverName || data.receiver || 'Receiver', 150, 200);
    doc.fontSize(8).font('Helvetica').text(data.receiverPhone || 'N/A', 150, 212);
    doc.text(data.destination || data.receiverAddress || 'Address unavailable', 150, 224, { width: 110 });

    doc.moveTo(15, 275).lineTo(273, 275).stroke();

    // Box details
    doc.fontSize(8).font('Helvetica-Bold').text('Description:', 20, 285);
    doc.fontSize(8).font('Helvetica').text(data.contents || data.itemCategory || 'General Merchandise', 20, 300);

    doc.fontSize(8).font('Helvetica-Bold').text('Weight:', 150, 285);
    doc.fontSize(8).font('Helvetica').text(`${data.weight || data.totalWeight || 1} KG`, 150, 300);

    doc.moveTo(15, 330).lineTo(273, 330).stroke();

    // Footer/Declarations
    doc.fontSize(6).font('Helvetica').text('I declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified, packaged, marked and labelled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations.', 20, 340, { width: 248, align: 'justify' });
    
    doc.fontSize(7).font('Helvetica-Bold').text('Signature: __________________________', 20, 395);

    doc.end();

  } catch (err) {
    console.error('PDF Generation error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate PDF label' });
  }
};
