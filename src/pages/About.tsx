import { Heart, Target, Eye, Award, Users, Globe } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We lead with empathy and care for every individual we serve"
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on measurable outcomes and sustainable change"
    },
    {
      icon: Globe,
      title: "Transparency",
      description: "We maintain complete openness in our operations and finances"
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in collaborative solutions and local empowerment"
    }
  ];

  const milestones = [
    { year: "2015", event: "WOMBTO18 founded with a vision to empower underserved communities" },
    { year: "2017", event: "Received 80G and 12A certifications for tax exemption" },
    { year: "2019", event: "Reached 10,000+ beneficiaries across 5 states" },
    { year: "2021", event: "Launched transparency dashboard for real-time fund tracking" },
    { year: "2023", event: "Expanded to 40+ partner organizations" },
    { year: "2025", event: "Impacted 50,000+ lives through comprehensive programs" }
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About WOMBTO18
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Building bridges to opportunity through education, healthcare, and sustainable development
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-8 rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-600 rounded-full mb-6">
                <Target className="size-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To empower underserved communities by providing access to quality education, healthcare, and sustainable livelihood opportunities. We believe in creating lasting change through transparent, community-driven initiatives that address root causes of poverty and inequality.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
                <Eye className="size-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                A world where every individual has equal access to opportunities for growth and development. We envision thriving communities where education, health, and economic prosperity are accessible to all, regardless of their background or circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  WOMBTO18 was founded in 2015 by a group of social activists who recognized the urgent need for transparent, accountable, and effective development work in India. The name "WOMBTO18" symbolizes our commitment to nurturing communities from inception to maturity, supporting individuals from birth through their formative years (0-18).
                </p>
                <p>
                  What started as a small education initiative in rural Maharashtra has grown into a comprehensive development organization working across multiple states. Our journey has been guided by one core principle: complete transparency in every aspect of our operations.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 beneficiaries through programs spanning education, healthcare, women's empowerment, skill development, and emergency relief. Every program is designed with community input and measured for real impact.
                </p>
              </div>
            </div>
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZyUyMHBlb3BsZXxlbnwxfHx8fDE3NzA5MTQ3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Community volunteers"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              These principles guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                    <Icon className="size-8 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">
              Key milestones in our growth and impact
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    <Award className="size-6" />
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-rose-200 mt-2"></div>
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-rose-600 font-bold text-lg mb-1">{milestone.year}</div>
                  <p className="text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl text-center">
            <Award className="size-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Certified & Registered
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-6">
              WOMBTO18 is registered under Section 80G and 12A of the Income Tax Act, 1961. All donations are eligible for tax exemption. We maintain complete compliance with all regulatory requirements and undergo regular audits.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
                <span className="font-semibold text-green-700">80G Certified</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
                <span className="font-semibold text-green-700">12A Registered</span>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200">
                <span className="font-semibold text-green-700">FCRA Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
