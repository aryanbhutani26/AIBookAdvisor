import { Lightbulb, MessageSquare, Building } from "lucide-react";

const FeaturesSection = () => {
  return (
    <section className="mt-16 mb-12">
      <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-8 text-center">
        What makes BookMind special
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold mb-2 text-gray-900">AI-Powered Recommendations</h4>
          <p className="text-gray-600">
            Our Gemini AI understands the nuances of your preferences, finding books that match your unique tastes.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold mb-2 text-gray-900">Natural Language Search</h4>
          <p className="text-gray-600">
            Simply describe what you're looking for in everyday language, and we'll find books that match your description.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Building className="w-6 h-6 text-primary-600" />
          </div>
          <h4 className="text-lg font-semibold mb-2 text-gray-900">Diverse Book Collection</h4>
          <p className="text-gray-600">
            Access recommendations from our extensive library covering all genres, authors, and time periods.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
