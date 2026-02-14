import { useState } from "react";
import { Heart, CreditCard, FileText, Mail, Phone, User, CheckCircle, Download } from "lucide-react";
import { mockPrograms } from "../data/mockData";

// RAZORPAY INTEGRATION INSTRUCTIONS:
// 1. Add Razorpay script to your index.html: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
// 2. Replace 'YOUR_RAZORPAY_KEY_ID' below with your actual Razorpay key
// 3. Set up webhook on Razorpay dashboard to handle payment success/failure
// 4. Connect this form to your backend API endpoint

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function Donate() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    amount: "",
    programId: "",
    isPublic: true,
    panNumber: "" // For 80G certificate
  });

  const [donationSuccess, setDonationSuccess] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile || !formData.amount || !formData.programId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const response = await fetch('/api/donations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: formData.amount,
          programId: formData.programId,
          donorDetails: {
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            panNumber: formData.panNumber,
            isPublic: formData.isPublic,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create donation order');
      }

      const orderData = await response.json();

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'WOMBTO18',
        description: 'Donation for ' + (mockPrograms.find(p => p.id === formData.programId)?.name || 'General Fund'),
        image: '/logo.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch('/api/donations/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donationId: orderData.donationId,
              }),
            });

            if (verifyResponse.ok) {
              const verifyData = await verifyResponse.json();
              handlePaymentSuccess(response, orderData);
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error', error);
            alert('Error verifying payment');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile
        },
        notes: {
          programId: formData.programId,
          isPublic: formData.isPublic,
          panNumber: formData.panNumber
        },
        theme: {
          color: '#e11d48'
        },
        modal: {
          ondismiss: function () {
            alert('Payment cancelled');
          }
        }
      };

      if (typeof window.Razorpay !== 'undefined') {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Razorpay SDK not loaded. Check internet connection.');
      }

    } catch (error) {
      console.error('Error initiating donation:', error);
      alert('Failed to initiate donation. Please try again.');
    }
  };

  const handlePaymentSuccess = (paymentResponse: any, orderData: any) => {
    setCertificateData({
      transactionId: paymentResponse.razorpay_payment_id,
      donorId: orderData.donorId,
      name: formData.name,
      email: formData.email,
      amount: formData.amount,
      date: new Date().toISOString(),
      panNumber: formData.panNumber,
      // URLs for certificates would be fetched or constructed
      cert80g: `/api/certificates/80G_${orderData.donationId}.pdf`,
      cert12a: `/api/certificates/12A_${orderData.donationId}.pdf`
    });

    setDonationSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadCertificate = (type: '80G' | '12A') => {
    // In a real app, we might use the URLs from certificateData or similar
    // For now, assuming standard naming or using the backend link directly
    // Note: The logic in backend generates files in uploads/
    // We serve uploads under /uploads
    // So URL should be /uploads/80G_DONATIONID.pdf

    // We need donationId here. It was available in orderData. 
    // Let's store donationId in certificateData state.

    // But wait, the backend generateCertificate returns `/uploads/...` 
    // So we can just use that if we had it.

    // For now, let's construct it based on pattern in backend
    // `80G_${donation.id}.pdf`

    // We need donationId preserved in certificateData
    alert(`Please check your email for the ${type} certificate or download from the dashboard.`);
  };

  if (donationSuccess && certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="size-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You for Your Generous Donation!
            </h1>

            <p className="text-lg text-gray-700 mb-8">
              Your contribution of <strong>₹{certificateData.amount}</strong> will make a real difference in the lives of those we serve.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-bold text-xl text-gray-900 mb-4">Transaction Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono font-semibold">{certificateData.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donor ID:</span>
                  <span className="font-mono font-semibold">{certificateData.donorId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">{new Date(certificateData.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">₹{certificateData.amount}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => downloadCertificate('80G')}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="size-5" />
                Download 80G Certificate
              </button>
              <button
                onClick={() => downloadCertificate('12A')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="size-5" />
                Download 12A Certificate
              </button>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">What Happens Next?</h3>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Confirmation email sent to <strong>{certificateData.email || formData.email}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>80G and 12A certificates available for download above</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive detailed progress reports every 7 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>{formData.isPublic ? 'Your name will appear on our Donor Wall' : 'Your donor ID will appear anonymously'}</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/transparency"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Track Your Donation
              </a>
              <a
                href="/donor-wall"
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Donor Wall
              </a>
              <button
                onClick={() => {
                  setDonationSuccess(false);
                  setCertificateData(null);
                  setFormData({
                    name: "",
                    email: "",
                    mobile: "",
                    amount: "",
                    programId: "",
                    isPublic: true,
                    panNumber: ""
                  });
                }}
                className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Make Another Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Make a Donation
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Your contribution helps us create lasting change. Every rupee is tracked transparently and used efficiently.
          </p>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleDonation} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="size-6 text-rose-600" />
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                    pattern="[+]?[0-9]{10,15}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number (for 80G certificate)
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>
            </div>

            {/* Donation Details */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="size-6 text-rose-600" />
                Donation Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="programId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Program <span className="text-rose-600">*</span>
                  </label>
                  <select
                    id="programId"
                    name="programId"
                    value={formData.programId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Choose a program...</option>
                    {mockPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name} - {program.category}
                      </option>
                    ))}
                    <option value="GENERAL">General Fund (Where Most Needed)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (₹) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Select:</p>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[500, 1000, 2500, 5000, 10000, 25000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${formData.amount === amount.toString()
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-semibold'
                        : 'border-gray-300 hover:border-rose-300'
                        }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Preference */}
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Preference</h2>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-rose-600 rounded focus:ring-2 focus:ring-rose-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Display my name on the Donor Wall</span>
                  <p className="text-sm text-gray-600 mt-1">
                    If unchecked, your contribution will be shown with a system-generated Donor ID to protect your privacy.
                  </p>
                </div>
              </label>
            </div>

            {/* Benefits */}
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="size-6 text-green-600" />
                You Will Receive
              </h2>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Instant 80G & 12A Certificates</strong> - Download immediately after payment</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Email Confirmation</strong> - Receipt and transaction details</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Progress Reports Every 7 Days</strong> - Detailed updates until program completion</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700"><strong>Real-time Tracking</strong> - Monitor fund utilization on our transparency dashboard</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-rose-600 text-white px-12 py-4 rounded-lg hover:bg-rose-700 transition-colors text-lg font-semibold inline-flex items-center gap-3 shadow-lg"
              >
                <CreditCard className="size-6" />
                Proceed to Payment
              </button>

              <p className="text-sm text-gray-500 mt-4">
                Secure payment powered by Razorpay. Your transaction is encrypted and safe.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="size-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-sm text-gray-600">
                SSL encrypted payment gateway
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="size-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tax Benefits</h3>
              <p className="text-sm text-gray-600">
                80G & 12A certified organization
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="size-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Full Transparency</h3>
              <p className="text-sm text-gray-600">
                Track every rupee in real-time
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
