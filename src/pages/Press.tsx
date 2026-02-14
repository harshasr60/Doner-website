import { Calendar, Newspaper, ExternalLink } from "lucide-react";
import { mockPressReleases } from "../data/mockData";

export function Press() {
  return (
    <div>
      {/* Header Section */}
      <section className="bg-gradient-to-br from-rose-50 to-orange-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Press & Media
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Latest news and coverage about WOMBTO18
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {mockPressReleases.map((press) => (
              <article 
                key={press.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                      <Newspaper className="size-6 text-rose-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="font-bold text-xl text-gray-900 mb-2">
                      {press.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">
                      {press.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Newspaper className="size-4" />
                        <span className="font-medium">{press.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{new Date(press.date).toLocaleDateString()}</span>
                      </div>
                      <a 
                        href={press.link}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium ml-auto"
                      >
                        Read Full Article
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Media Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Media Inquiries
            </h2>
            <p className="text-gray-700 mb-6">
              For press inquiries, interviews, or media kits, please contact our communications team.
            </p>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Email:</strong> <a href="mailto:media@wombto18.org" className="text-rose-600 hover:text-rose-700">media@wombto18.org</a>
              </p>
              <p>
                <strong>Phone:</strong> <a href="tel:+911234567890" className="text-rose-600 hover:text-rose-700">+91 123 456 7890</a>
              </p>
              <p>
                <strong>Press Kit:</strong> <a href="#" className="text-rose-600 hover:text-rose-700">Download Media Kit (PDF)</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
