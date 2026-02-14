const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
    static async generateCertificate(donation, donor, program, type) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();
            const fileName = `${type}_${donation.id}.pdf`;
            const filePath = path.join(__dirname, '../../uploads', fileName); // Ensure uploads dir exists

            // Create uploads dir if it doesn't exist
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Certificate Content
            doc.fontSize(25).text('Certificate of Donation', 100, 80, { align: 'center' });
            doc.moveDown();
            doc.fontSize(15).text(`This is to certify that`, { align: 'center' });
            doc.moveDown();
            doc.fontSize(20).text(donor.name, { align: 'center' });
            doc.moveDown();
            doc.fontSize(15).text(`has donated a sum of INR ${donation.amount}`, { align: 'center' });
            doc.text(`towards ${program.name}`, { align: 'center' });
            doc.moveDown();
            doc.text(`Date: ${new Date(donation.donation_date).toLocaleDateString()}`, { align: 'center' });
            doc.text(`Certificate Type: ${type}`, { align: 'center' });

            doc.end();

            stream.on('finish', () => {
                // Return relative path or URL
                resolve(`/uploads/${fileName}`);
            });

            stream.on('error', (err) => {
                reject(err);
            });
        });
    }
}

module.exports = PDFService;
