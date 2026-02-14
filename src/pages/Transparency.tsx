import { DollarSign, TrendingUp, PieChart, BarChart3, CheckCircle } from "lucide-react";
import { getTotalFunds, mockPrograms } from "../data/mockData";

export function Transparency() {
  const { totalReceived, totalUtilized } = getTotalFunds();
  const utilizationPercentage = ((totalUtilized / totalReceived) * 100).toFixed(1);
  const availableBalance = totalReceived - totalUtilized;

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Transparency Dashboard
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Real-time tracking of every rupee donated and utilized
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="size-12 text-green-600" />
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <h3 className="text-gray-600 mb-2">Total Funds Received</h3>
              <p className="text-4xl font-bold text-gray-900">
                ₹{(totalReceived / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-sm text-green-600 mt-2">From {mockPrograms.reduce((sum, p) => sum + p.raisedAmount, 0) / totalReceived > 0 ? 'generous donors' : 'community support'}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <PieChart className="size-12 text-blue-600" />
                <CheckCircle className="size-6 text-blue-600" />
              </div>
              <h3 className="text-gray-600 mb-2">Total Funds Utilized</h3>
              <p className="text-4xl font-bold text-gray-900">
                ₹{(totalUtilized / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-sm text-blue-600 mt-2">{utilizationPercentage}% utilization rate</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-xl border-2 border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="size-12 text-amber-600" />
                <DollarSign className="size-6 text-amber-600" />
              </div>
              <h3 className="text-gray-600 mb-2">Available Balance</h3>
              <p className="text-4xl font-bold text-gray-900">
                ₹{(availableBalance / 100000).toFixed(2)} Lakh
              </p>
              <p className="text-sm text-amber-600 mt-2">Reserved for active programs</p>
            </div>
          </div>

          {/* Utilization Bar */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Fund Utilization Progress</h3>
              <span className="text-sm font-bold text-gray-900">{utilizationPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${utilizationPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>₹0</span>
              <span>₹{(totalReceived / 100000).toFixed(2)} Lakh</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program-wise Breakdown */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Program-wise Fund Breakdown
          </h2>

          <div className="space-y-6">
            {mockPrograms.map((program) => {
              const raised = program.raisedAmount;
              const utilized = program.utilizedAmount;
              const utilizedPercentage = ((utilized / raised) * 100).toFixed(1);
              const targetProgress = ((raised / program.targetAmount) * 100).toFixed(1);

              return (
                <div 
                  key={program.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">{program.name}</h3>
                        <p className="text-sm text-gray-600">{program.description}</p>
                      </div>
                      <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                        {program.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Target Amount</div>
                      <div className="font-bold text-lg text-gray-900">
                        ₹{(program.targetAmount / 100000).toFixed(1)}L
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Amount Raised</div>
                      <div className="font-bold text-lg text-green-700">
                        ₹{(raised / 100000).toFixed(1)}L ({targetProgress}%)
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Amount Utilized</div>
                      <div className="font-bold text-lg text-blue-700">
                        ₹{(utilized / 100000).toFixed(1)}L ({utilizedPercentage}%)
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-gray-600">Utilization Progress</span>
                      <span className="font-semibold text-gray-900">{utilizedPercentage}% of raised</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-600 to-orange-500 h-full rounded-full"
                        style={{ width: `${utilizedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audit Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-xl border-2 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Third-Party Audited & Verified
            </h2>
            <p className="text-gray-700 text-center mb-6">
              All financial data is verified by independent auditors and updated in real-time. Our commitment to transparency ensures that every rupee is accounted for and used effectively.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-indigo-700">Monthly Audits</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-indigo-700">Real-time Updates</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <span className="font-semibold text-indigo-700">100% Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
