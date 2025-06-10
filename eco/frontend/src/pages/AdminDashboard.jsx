import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    totalUsers: 0
  });
  const [pickupRequests, setPickupRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [statsResponse, requestsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats', { headers }),
          axios.get('http://localhost:5000/api/admin/requests', { headers })
        ]);

        setStats(statsResponse.data);
        setPickupRequests(requestsResponse.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
        console.error('Dashboard Error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `http://localhost:5000/api/admin/requests/${requestId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPickupRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? response.data.request : request
        )
      );

      const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request status');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading dashboard data...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>;
  }

  const filteredRequests = statusFilter === 'all'
    ? pickupRequests
    : pickupRequests.filter(request => request.status === statusFilter);

  const completionRate = stats.totalRequests
    ? ((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)
    : 0;
  const pendingRate = stats.totalRequests
    ? ((stats.pendingRequests / stats.totalRequests) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Requests</h3>
            <p className="text-3xl font-bold text-primary-600">{stats.totalRequests}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed Requests</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedRequests}</p>
            <p className="text-sm text-gray-500 mt-2">{completionRate}% completion rate</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            <p className="text-sm text-gray-500 mt-2">{pendingRate}% pending</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500 mt-2">Registered users</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Pickup Requests</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.user?.name}</div>
                        <div className="text-sm text-gray-500">{request.user?.email}</div>
                        <div className="text-sm text-gray-500">{request.user?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold mb-2">Items:</p>
                          {request.items.map((item, idx) => (
                            <div key={idx} className="text-sm text-gray-600 mb-1">
                              {item.quantity}x {item.type} ({item.condition})
                              {item.description && <span className="text-gray-500"> - {item.description}</span>}
                            </div>
                          ))}
                          <p className="font-semibold mt-3 mb-1">Pickup Details:</p>
                          <p className="text-sm text-gray-600">Date: {new Date(request.preferredDate).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">
                            Address: {request.pickupAddress.street}, {request.pickupAddress.city}, {request.pickupAddress.state} {request.pickupAddress.zipCode}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100'
                          }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={request.status}
                          onChange={(e) => handleStatusUpdate(request._id, e.target.value)}
                          disabled={isSubmitting}
                          className="p-2 border rounded text-sm"
                        >
                          <option value="pending">Mark as Pending</option>
                          <option value="completed">Mark as Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No {statusFilter !== 'all' ? statusFilter : ''} requests found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;