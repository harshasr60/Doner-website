import { useEffect, useState } from "react";
import { Heart, Award, Calendar, DollarSign } from "lucide-react";
// import { mockDonors } from "../data/mockData"; // Removed mock data

export function DonorWall() {
  const [donors, setDonors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/donors/wall')
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch donors", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-20">Loading Donor Wall...</div>;
  }

  // Sort donors by amount (highest first)
  const sortedDonors = [...donors].sort((a, b) => b.amount - a.amount);

  // Group donors by amount tiers
  const platinumDonors = sortedDonors.filter(d => d.amount >= 100000);
  const goldDonors = sortedDonors.filter(d => d.amount >= 50000 && d.amount < 100000);
  const silverDonors = sortedDonors.filter(d => d.amount >= 25000 && d.amount < 50000);
  const bronzeDonors = sortedDonors.filter(d => d.amount < 25000);

  const DonorCard = ({ donor }: { donor: any }) => {
    const displayName = donor.isPublic ? donor.name : `Donor ${donor.id}`;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <Heart className="size-6 text-rose-600 fill-rose-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">{displayName}</h3>
              {donor.isPublic && (
                <p className="text-sm text-gray-500">Verified Donor</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="size-4" />
              <span>Contribution</span>
            </div>
            <span className="font-bold text-rose-600">₹{donor.amount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="size-4" />
              <span>Date</span>
            </div>
            <span className="text-gray-900">{new Date(donor.date).toLocaleDateString()}</span>
          </div>
        </div>

        {!donor.isPublic && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            Anonymous donor - Identity protected by choice
          </div>
        )}
      </div>
    );
  };

  const TierSection = ({
    title,
    donors,
    color,
    icon: Icon
  }: {
    title: string;
    donors: any[];
    color: string;
    icon: any;
  }) => {
    if (donors.length === 0) return null;

    return (
      <div className="mb-12">
        <div className={`flex items-center gap-3 mb-6 pb-4 border-b-2 border-${color}-200`}>
          <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
            <Icon className={`size-6 text-${color}-600`} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">{donors.length} generous donor{donors.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Donor Wall
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-4">
            Celebrating our generous supporters who make our work possible
          </p>
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <Heart className="size-5 text-rose-600 fill-rose-600" />
            <span className="font-semibold text-gray-900">
              Total Donors: {donors.length}
            </span>
          </div>
        </div>
      </section>

      {/* Donor Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TierSection
            title="Platinum Circle"
            donors={platinumDonors}
            color="purple"
            icon={Award}
          />

          <TierSection
            title="Gold Circle"
            donors={goldDonors}
            color="yellow"
            icon={Award}
          />

          <TierSection
            title="Silver Circle"
            donors={silverDonors}
            color="gray"
            icon={Award}
          />

          <TierSection
            title="Bronze Circle"
            donors={bronzeDonors}
            color="orange"
            icon={Heart}
          />
        </div>
      </section>

      {/* Privacy Notice */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Privacy & Recognition
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                We respect our donors' privacy choices. When making a donation, you can choose to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Display your name publicly on our Donor Wall (with your consent)</li>
                <li>Remain anonymous with a system-generated Donor ID</li>
              </ul>
              <p className="pt-4">
                All donors receive the same benefits including 80G/12A certificates and regular progress reports, regardless of their visibility preference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Community of Changemakers
          </h2>
          <p className="text-lg mb-8 text-rose-100">
            Your contribution, big or small, makes a real difference
          </p>
          <a
            href="/donate"
            className="bg-white text-rose-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-semibold"
          >
            Become a Donor
            <Heart className="size-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
