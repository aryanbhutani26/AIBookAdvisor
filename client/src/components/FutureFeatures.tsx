import { Check } from "lucide-react";

const futureFeatures = [
  {
    title: "User Accounts & Saved Libraries",
    description: "Save your favorite books and track your reading history",
  },
  {
    title: "Reading Analytics",
    description: "Visualize your reading patterns and preferences",
  },
  {
    title: "Mobile App",
    description: "Take BookMind with you on iOS and Android",
  },
  {
    title: "AI Feedback Learning",
    description: "Recommendations that improve based on your feedback",
  },
  {
    title: "Expanded Book Database",
    description: "More diverse titles across all genres and languages",
  },
  {
    title: "Reading Group Integration",
    description: "Form and join reading groups with like-minded readers",
  },
];

const FutureFeatures = () => {
  return (
    <section className="mt-16 mb-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
      <h3 className="text-2xl font-playfair font-semibold text-gray-900 mb-4">Coming Soon</h3>
      <p className="text-gray-600 mb-8">
        We're constantly improving BookMind with new features to enhance your reading experience.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {futureFeatures.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-900">{feature.title}</h4>
              <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FutureFeatures;
