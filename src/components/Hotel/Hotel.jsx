import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hotel = () => {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    hotelName: '',
    location: '',
    rating: '',
    contactNumber: ''
  });
  const [editingHotel, setEditingHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/hotel');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingHotel({ ...editingHotel, [name]: value });
    } else {
      setNewHotel({ ...newHotel, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newHotel.hotelName || !newHotel.location || !newHotel.rating || !newHotel.contactNumber) {
      alert('Please fill in all the fields before adding a hotel.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/createHotel', newHotel);
      setNewHotel({ hotelName: '', location: '', rating: '', contactNumber: '' });
      fetchHotels(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateHotel/${editingHotel.hotelId}`, editingHotel);
      setEditingHotel(null);
      setIsEditing(false);
      fetchHotels(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error updating hotel:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await axios.delete(`http://localhost:5000/deleteHotel/${id}`);
        fetchHotels(); 
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Hotel Admin Dashboard</h1>
        
        <button
          onClick={() => {
            setNewHotel({ hotelName: '', location: '', rating: '', contactNumber: '' });
            setEditingHotel(null);
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Add New Hotel
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? 'Edit Hotel' : 'Add New Hotel'}</h3>
                <form onSubmit={isEditing ? handleUpdate : handleAdd} className="mt-2 space-y-4">
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="hotelName"
                      type="text"
                      name="hotelName"
                      placeholder="Hotel Name"
                      value={isEditing ? editingHotel.hotelName : newHotel.hotelName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="location"
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={isEditing ? editingHotel.location : newHotel.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="rating"
                      type="number"
                      name="rating"
                      placeholder="Rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={isEditing ? editingHotel.rating : newHotel.rating}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="contactNumber"
                      type="tel"
                      name="contactNumber"
                      placeholder="Contact Number"
                      value={isEditing ? editingHotel.contactNumber : newHotel.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      {isEditing ? 'Update Hotel' : 'Add Hotel'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hotel List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Hotel Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.hotelId} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{hotel.hotelName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{hotel.location}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{hotel.rating}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{hotel.contactNumber}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.hotelId)}
                        className="text-red-600 hover:text-red-900 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;