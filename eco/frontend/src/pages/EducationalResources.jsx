import React from 'react';

const EducationalResources = () => {
  const resources = [
    {
      title: 'Understanding E-Waste',
      content: 'Learn about the environmental impact of electronic waste and why proper disposal is crucial.',
      link: 'https://www.epa.gov/international-cooperation/cleaning-electronic-waste-e-waste'
    },
    {
      title: 'Recycling Process',
      content: 'Discover how electronic devices are recycled and what happens to different components.',
      link: 'https://www.epa.gov/recycle/electronics-donation-and-recycling'
    },
    {
      title: 'Data Security',
      content: 'Important information about protecting your personal data when recycling electronic devices.',
      link: 'https://www.consumer.ftc.gov/articles/0002-computer-disposal'
    },
    {
      title: 'Environmental Impact',
      content: 'Understand the environmental consequences of improper e-waste disposal.',
      link: 'https://www.unep.org/explore-topics/resource-efficiency/what-we-do/cities/solid-waste-management/e-waste'
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 bg-primary-50">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Educational Resources</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((resource, index) => (
            <div key={index} className="card">
              <h2 className="text-xl font-semibold mb-3 hover:scaley-110 transition-all duration-1000">{resource.title}</h2>
              <p className="text-gray-600 mb-4">{resource.content}</p>
              <a
                href={resource.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 card bg-primary-50">
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              Proper e-waste management is essential for protecting our environment and conserving valuable resources. 
              When electronic devices are disposed of incorrectly, they can release harmful substances into the environment 
              and contribute to pollution.
            </p>
            <p className="mb-4">
              By recycling your electronic devices through our service, you're contributing to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Reducing environmental pollution</li>
              <li>Conserving natural resources</li>
              <li>Preventing hazardous materials from entering landfills</li>
              <li>Supporting the circular economy</li>
            </ul>
            <p>
              For more detailed information about e-waste management and recycling, please explore the resources above 
              or contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalResources; 