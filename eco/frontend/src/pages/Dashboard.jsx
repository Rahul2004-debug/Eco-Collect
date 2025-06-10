import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPickupRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.id) {
          setError('Please login to view your pickup requests');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/pickup/my-requests?userId=${user.id}`);
        setPickupRequests(response.data);
      } catch (err) {
        console.error('Error fetching pickup requests:', err);
        setError(err.response?.data?.message || 'Failed to fetch pickup requests');
      } finally {
        setLoading(false);
      }
    };

    fetchPickupRequests();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {pickupRequests.map(request => (
            <div key={request._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Pickup Request #{request._id.slice(-6)}</h3>
                  <p className="text-gray-600">Status: <span className="font-medium">{request.status}</span></p>
                  <p className="text-gray-600">Preferred Date: {new Date(request.preferredDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Created: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Items:</h4>
                <ul className="space-y-2">
                  {request.items.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item.quantity}x {item.type} ({item.condition})
                      {item.description && <span className="text-sm text-gray-500"> - {item.description}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h4 className="font-medium mb-2">Pickup Address:</h4>
                <p className="text-gray-600">
                  {request.pickupAddress.street}, {request.pickupAddress.city}, {request.pickupAddress.state} {request.pickupAddress.zipCode}
                </p>
              </div>
            </div>
          ))}

          {pickupRequests.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No pickup requests found.</p>
              <a href="/request-pickup" className="text-primary-600 hover:text-primary-800 mt-2 inline-block">
                Create your first pickup request
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 