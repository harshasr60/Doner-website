import { Link } from "react-router";
import { Heart, Users, Target, TrendingUp, ArrowRight, DollarSign, FileText, Award } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Home() {
  const stats = [
    { label: "Lives Impacted", value: "50,000+", icon: Users },
    { label: "Active Programs", value: "25", icon: Target },
    { label: "Funds Utilized", value: "₹2.5 Cr", icon: DollarSign },
    { label: "Partner Organizations", value: "40+", icon: Award },
  ];

  const features = [
    {
      title: "Complete Transparency",
      description: "Track every rupee donated through our real-time transparency dashboard",
      icon: TrendingUp,
      link: "/transparency"
    },
    {
      title: "Instant Tax Certificates",
      description: "Receive 80G and 12A certificates immediately after donation",
      icon: FileText,
      link: "/donate"
    },
    {
      title: "Regular Updates",
      description: "Get detailed progress reports every 7 days until program completion",
      icon: Heart,
      link: "/impact-reports"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 to-orange-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Transforming Lives, Building Futures
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                WOMBTO18 is committed to creating sustainable change through education, healthcare, and community development. Join us in making a difference.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/donate"
                  className="bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors inline-flex items-center gap-2"
                >
                  Donate Now
                  <ArrowRight className="size-5" />
                </Link>
                <Link
                  to="/about"
                  className="bg-white text-rose-600 border-2 border-rose-600 px-8 py-3 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1763637675793-da207ba1fe18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGNoYXJpdHl8ZW58MXx8fHwxNzcwOTE0NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Children learning"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-4">
                    <Icon className="size-8 text-rose-600" />
                  </div>
                  <div className="font-bold text-3xl text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose WOMBTO18?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to transparency, accountability, and measurable impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-lg mb-4">
                    <Icon className="size-6 text-rose-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <span className="text-rose-600 inline-flex items-center gap-1 font-medium">
                    Learn more <ArrowRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Make a Difference Today
          </h2>
          <p className="text-lg mb-8 text-rose-100">
            Your contribution can change lives. Every donation is tracked transparently and used efficiently.
          </p>
          <Link
            to="/donate"
            className="bg-white text-rose-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-semibold"
          >
            Start Donating
            <Heart className="size-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
