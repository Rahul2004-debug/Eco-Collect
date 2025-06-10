import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestPickup = () => {
  const [formData, setFormData] = useState({
    items: [{
      type: 'laptop',  // Set default value
      quantity: 1,
      condition: 'working',
      description: ''
    }],
    preferredDate: new Date().toISOString().split('T')[0], // Set today's date as default
    pickupAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { 
        type: 'laptop', 
        quantity: 1, 
        condition: 'working',
        description: ''
      }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      pickupAddress: { ...formData.pickupAddress, [field]: value }
    });
  };

  const validateForm = () => {
    // Check if all items have required fields
    for (const item of formData.items) {
      if (!item.type || !item.quantity || !item.condition) {
        return false;
      }
    }

    // Check if pickup address has all fields
    if (!formData.pickupAddress.street || 
        !formData.pickupAddress.city || 
        !formData.pickupAddress.state || 
        !formData.pickupAddress.zipCode) {
      return false;
    }

    // Check if preferred date is set
    if (!formData.preferredDate) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setError('Please login first');
        return;
      }

      const requestData = {
        ...formData,
        userId: user.id
      };

      await axios.post('http://localhost:5000/api/pickup', requestData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while submitting the request');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Request E-Waste Pickup</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Items for Pickup</h2>
            {formData.items.map((item, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      value={item.type}
                      onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="laptop">Laptop</option>
                      <option value="mobile">Mobile Phone</option>
                      <option value="desktop">Desktop Computer</option>
                      <option value="printer">Printer</option>
                      <option value="monitor">Monitor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                    <select
                      value={item.condition}
                      onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="working">Working</option>
                      <option value="not_working">Not Working</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="input-field"
                    placeholder="Additional details about the item"
                  />
                </div>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Remove Item
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="btn-secondary"
            >
              Add Another Item
            </button>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Pickup Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date *</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  value={formData.pickupAddress.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.pickupAddress.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={formData.pickupAddress.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.pickupAddress.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPickup; 