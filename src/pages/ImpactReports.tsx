import { Download, FileText, Users, Target, DollarSign } from "lucide-react";
import { mockImpactReports } from "../data/mockData";

export function ImpactReports() {
  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Impact Reports
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Detailed quarterly reports showcasing our impact and fund utilization
          </p>
        </div>
      </section>

      {/* Reports Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockImpactReports.map((report) => (
              <div 
                key={report.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <FileText className="size-6 text-rose-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{report.quarter}</div>
                    <div className="font-bold text-gray-900">{report.year}</div>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  {report.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Target className="size-4" />
                      <span>Programs</span>
                    </div>
                    <span className="font-semibold text-gray-900">{report.programsCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="size-4" />
                      <span>Beneficiaries</span>
                    </div>
                    <span className="font-semibold text-gray-900">{report.beneficiaries.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="size-4" />
                      <span>Funds Utilized</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{(report.fundsUtilized / 100000).toFixed(1)}L</span>
                  </div>
                </div>
                
                <a 
                  href={report.downloadUrl}
                  className="w-full bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  Download Report
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About Our Impact Reports
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Our quarterly impact reports provide comprehensive insights into:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Detailed breakdown of all active programs and their progress</li>
                <li>Number of beneficiaries reached across different demographics</li>
                <li>Complete financial transparency including fund utilization</li>
                <li>Success stories and testimonials from the community</li>
                <li>Challenges faced and lessons learned</li>
                <li>Plans for the upcoming quarter</li>
              </ul>
              <p className="pt-4">
                All reports are audited by third-party agencies and comply with regulatory requirements under Section 80G and 12A.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
