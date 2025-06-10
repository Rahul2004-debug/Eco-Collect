import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        completedRequests: 0,
        pendingRequests: 0,
        totalUsers: 0
    });
    const [pickupRequests, setPickupRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsResponse, requestsResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/admin/requests', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setStats(statsResponse.data);
                setPickupRequests(requestsResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching admin data');
                setLoading(false);
                console.error('Error fetching admin data:', error);
            }
        };

        fetchData();
    }, []);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">{error}</div>
            </div>
        );
    }

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
                        <p className="text-sm text-gray-500 mt-2">
                            {((stats.completedRequests / stats.totalRequests) * 100).toFixed(1)}% completion rate
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Requests</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {((stats.pendingRequests / stats.totalRequests) * 100).toFixed(1)}% pending
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {stats.totalUsers} registered users
                        </p>
                    </div>
                </div>

                {/* Pickup Requests Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">All Pickup Requests</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pickup Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pickupRequests.map((request) => (
                                        <tr key={request._id}>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{request.user.name}</div>
                                                <div className="text-sm text-gray-500">{request.user.email}</div>
                                                <div className="text-sm text-gray-500">{request.user.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {request.items.map((item, index) => (
                                                        <div key={index} className="mb-1">
                                                            {item.quantity}x {item.type} ({item.condition})
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div>Date: {new Date(request.pickupDate).toLocaleDateString()}</div>
                                                    <div>Time: {request.pickupTime}</div>
                                                    <div>Address: {request.address}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
