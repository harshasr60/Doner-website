import { BookOpen, Heart, Users, Briefcase, Home, Droplet } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Services() {
  const services = [
    {
      icon: BookOpen,
      title: "Education & Literacy",
      description: "Providing quality education to underprivileged children through schools, scholarships, and learning centers",
      image: "https://images.unsplash.com/photo-1763637675793-da207ba1fe18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjaGlsZHJlbiUyMGVkdWNhdGlvbiUyMGNoYXJpdHl8ZW58MXx8fHwxNzcwOTE0NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "15,000+",
        programs: "8 Active Programs",
        centers: "45 Learning Centers"
      }
    },
    {
      icon: Heart,
      title: "Healthcare & Nutrition",
      description: "Delivering essential healthcare services, medical camps, and nutrition programs to rural and urban poor",
      image: "https://images.unsplash.com/photo-1632999874274-aea6b950a53f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbCUyMHZvbHVudGVlcnMlMjBpbmRpYXxlbnwxfHx8fDE3NzA5MTQ3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "20,000+",
        programs: "12 Active Programs",
        centers: "30 Health Camps/Year"
      }
    },
    {
      icon: Users,
      title: "Women Empowerment",
      description: "Skill training, entrepreneurship support, and leadership development for women and girls",
      image: "https://images.unsplash.com/photo-1623121608226-ca93dec4d94e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwd29ya3Nob3B8ZW58MXx8fHwxNzcwODM0NzUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "8,000+",
        programs: "6 Active Programs",
        centers: "25 Skill Centers"
      }
    },
    {
      icon: Briefcase,
      title: "Skill Development",
      description: "Vocational training and job placement assistance for youth to enhance employability",
      image: "https://images.unsplash.com/photo-1763816589196-45607083c4f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYSUyMHJ1cmFsJTIwZGV2ZWxvcG1lbnR8ZW58MXx8fHwxNzcwOTEyNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "5,000+",
        programs: "4 Active Programs",
        centers: "15 Training Centers"
      }
    },
    {
      icon: Home,
      title: "Community Development",
      description: "Infrastructure development, sanitation, and community building initiatives in rural areas",
      image: "https://images.unsplash.com/photo-1761666507437-9fb5a6ef7b0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB2b2x1bnRlZXJzJTIwaGVscGluZyUyMHBlb3BsZXxlbnwxfHx8fDE3NzA5MTQ3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "10,000+",
        programs: "7 Active Programs",
        centers: "60 Villages"
      }
    },
    {
      icon: Droplet,
      title: "Emergency Relief",
      description: "Rapid response to natural disasters, providing food, shelter, and essential supplies",
      image: "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZG9uYXRpb24lMjBoYW5kc3xlbnwxfHx8fDE3NzA5MTQ3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      stats: {
        beneficiaries: "3,000+",
        programs: "As Needed",
        centers: "Pan-India"
      }
    }
  ];

  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Comprehensive programs designed to create lasting impact across education, health, and community development
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index}
                  className={`grid md:grid-cols-2 gap-8 items-center ${
                    isEven ? "" : "md:grid-flow-dense"
                  }`}
                >
                  <div className={isEven ? "" : "md:col-start-2"}>
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="rounded-2xl shadow-lg w-full h-[350px] object-cover"
                    />
                  </div>
                  
                  <div className={isEven ? "" : "md:col-start-1 md:row-start-1"}>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
                      <Icon className="size-8 text-rose-600" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h2>
                    
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-rose-50 p-4 rounded-lg">
                        <div className="font-bold text-rose-600 text-lg mb-1">
                          {service.stats.beneficiaries}
                        </div>
                        <div className="text-sm text-gray-600">Beneficiaries</div>
                      </div>
                      <div className="bg-rose-50 p-4 rounded-lg">
                        <div className="font-bold text-rose-600 text-lg mb-1">
                          {service.stats.programs}
                        </div>
                        <div className="text-sm text-gray-600">Programs</div>
                      </div>
                      <div className="bg-rose-50 p-4 rounded-lg">
                        <div className="font-bold text-rose-600 text-lg mb-1">
                          {service.stats.centers}
                        </div>
                        <div className="text-sm text-gray-600">Reach</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Support Our Programs
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Your contribution helps us expand these vital services to more communities
          </p>
          <a
            href="/donate"
            className="bg-rose-600 text-white px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors inline-block"
          >
            Donate Now
          </a>
        </div>
      </section>
    </div>
  );
}
