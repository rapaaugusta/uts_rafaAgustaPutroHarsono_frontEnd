import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({
    checkInDate: '',
    checkOutDate: '',
    totalPrice: ''
  });
  const [editingBooking, setEditingBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/booking'); // Ensure the endpoint is correct
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingBooking({ ...editingBooking, [name]: value });
    } else {
      setNewBooking({ ...newBooking, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBooking.checkInDate || !newBooking.checkOutDate || !newBooking.totalPrice) {
      alert('Please fill in all the fields before adding a booking.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/createBooking', newBooking);
      setNewBooking({ checkInDate: '', checkOutDate: '', totalPrice: '' });
      fetchBookings(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error adding booking:', error);
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateBooking/${editingBooking.bookingId}`, editingBooking);
      setEditingBooking(null);
      setIsEditing(false);
      fetchBookings(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://localhost:5000/deleteBooking/${id}`);
        fetchBookings(); 
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Booking Management Dashboard</h1>
        
        <button
          onClick={() => {
            setNewBooking({ checkInDate: '', checkOutDate: '', totalPrice: '' });
            setEditingBooking(null);
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Add New Booking
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? 'Edit Booking' : 'Add New Booking'}</h3>
                <form onSubmit={isEditing ? handleUpdate : handleAdd} className="mt-2 space-y-4">
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="checkInDate"
                      type="date"
                      name="checkInDate"
                      placeholder="Check-In Date"
                      value={isEditing ? editingBooking.checkInDate : newBooking.checkInDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="checkOutDate"
                      type="date"
                      name="checkOutDate"
                      placeholder="Check-Out Date"
                      value={isEditing ? editingBooking.checkOutDate : newBooking.checkOutDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="totalPrice"
                      type="number"
                      name="totalPrice"
                      placeholder="Total Price"
                      value={isEditing ? editingBooking.totalPrice : newBooking.totalPrice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      {isEditing ? 'Update Booking' : 'Add Booking'}
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

        {/* Booking List */}
        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Booking List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check-In Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Check-Out Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(booking.checkInDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{booking.totalPrice}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.bookingId)}
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

export default Booking;
