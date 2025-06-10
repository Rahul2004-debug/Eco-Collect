import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Responsible E-Waste Management Made Easy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join us in creating a sustainable future by properly disposing of your electronic waste.
            </p>
            <Link to="/request-pickup" className="btn-primary text-lg px-8 py-3">
              Request Pickup
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Eco-Collect?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Easy Scheduling</h3>
              <p className="text-gray-600">Schedule a pickup at your convenience with our simple online system.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Certified Recycling</h3>
              <p className="text-gray-600">Your e-waste is handled by certified professionals following environmental standards.</p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-gray-600">Monitor your pickup status and recycling process in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 