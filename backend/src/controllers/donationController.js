const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Program = require('../models/Program');
const razorpay = require('../services/razorpayService');
const pdfService = require('../services/pdfService');
const emailService = require('../services/emailService');
const crypto = require('crypto');

exports.createDonationOrder = async (req, res) => {
    try {
        const { amount, programId, donorDetails } = req.body;

        if (!amount || !programId || !donorDetails) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if donor exists, else create
        let donor = await Donor.findByEmail(donorDetails.email);
        if (!donor) {
            const donorData = {
                id: `DON${Date.now()}`,
                name: donorDetails.name,
                email: donorDetails.email,
                mobile: donorDetails.mobile,
                pan_number: donorDetails.panNumber, // Ensure frontend sends this key
                is_public: donorDetails.isPublic || false
            };
            donor = await Donor.create(donorData);
        }

        // Create Razorpay Order
        const options = {
            amount: amount * 100, // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                program_id: programId,
                donor_id: donor.id
            }
        };

        const order = await razorpay.orders.create(options);

        // Create Donation Record
        const donationData = {
            id: `TXN${Date.now()}`,
            donor_id: donor.id,
            program_id: programId,
            amount: amount,
            razorpay_order_id: order.id,
            payment_status: 'pending',
            transaction_id: `TXN${Date.now()}` // Temporary, can be updated later
        };

        const donation = await Donation.create(donationData);

        res.json({
            orderId: order.id,
            amount: order.amount,
            donorId: donor.id,
            donationId: donation.id,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            donationId
        } = req.body;

        // Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update Donation Status
            await Donation.updatePaymentStatus(donationId, {
                razorpay_payment_id,
                razorpay_signature,
                payment_status: 'success'
            });

            const donation = await Donation.findById(donationId);
            const program = await Program.findById(donation.program_id);
            const donor = await Donor.findById(donation.donor_id);

            // Update Program Amount
            await Program.incrementRaisedAmount(program.id, donation.amount);

            // Generate Certificates
            // (Simplified: generating paths, actual file creation logic in service)
            const cert80gPath = await pdfService.generateCertificate(donation, donor, program, '80G');
            const cert12aPath = await pdfService.generateCertificate(donation, donor, program, '12A');

            await Donation.updateCertificates(donationId, cert80gPath, cert12aPath);

            // Send Email
            try {
                await emailService.sendEmail(
                    donor.email,
                    'Donation Successful - Welcome to the Family',
                    `Thank you for your generous donation of INR ${donation.amount}.`,
                    `
                    <h3>Dear ${donor.name},</h3>
                    <p>Thank you for your generous donation of <b>INR ${donation.amount}</b> to <b>${program.name}</b>.</p>
                    <p>We have attached your tax exemption certificates (80G & 12A) to this email.</p>
                    <p>Your name has been added to our <b>Donor Wall</b>.</p>
                    <p>You will now receive structured progress reports <b>every 7 days</b> until the program is completed, so you can see exactly how your contribution is making an impact.</p>
                    <p>Warm regards,<br/>WOMBTO18 Team</p>
                    `,
                    [
                        { path: `.${cert80gPath}` },
                        { path: `.${cert12aPath}` }
                    ]
                );
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Do not fail the request if email fails, but log it
            }

            res.json({ success: true, message: 'Payment verified and processed' });
        } else {
            console.error('Signature mismatch:', { expectedSignature, razorpay_signature });
            await Donation.updatePaymentStatus(donationId, {
                razorpay_payment_id: null,
                razorpay_signature: null,
                payment_status: 'failed'
            });
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
};
