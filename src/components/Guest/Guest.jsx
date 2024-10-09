import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Guest = () => {
  const [guests, setGuests] = useState([]);
  const [newGuest, setNewGuest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [editingGuest, setEditingGuest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/guest'); 
      setGuests(response.data);
    } catch (error) {
      console.error('Error fetching guests:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingGuest({ ...editingGuest, [name]: value });
    } else {
      setNewGuest({ ...newGuest, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGuest.firstName || !newGuest.lastName || !newGuest.email || !newGuest.phoneNumber) {
      alert('Please fill in all the fields before adding a guest.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/createGuest', newGuest);
      setNewGuest({ firstName: '', lastName: '', email: '', phoneNumber: '' });
      fetchGuests(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateGuest/${editingGuest.guestId}`, editingGuest);
      setEditingGuest(null);
      setIsEditing(false);
      fetchGuests(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error updating guest:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await axios.delete(`http://localhost:5000/deleteGuest/${id}`);
        fetchGuests(); 
      } catch (error) {
        console.error('Error deleting guest:', error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Guest Management Dashboard</h1>
        
        <button
          onClick={() => {
            setNewGuest({ firstName: '', lastName: '', email: '', phoneNumber: '' });
            setEditingGuest(null);
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Add New Guest
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? 'Edit Guest' : 'Add New Guest'}</h3>
                <form onSubmit={isEditing ? handleUpdate : handleAdd} className="mt-2 space-y-4">
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={isEditing ? editingGuest.firstName : newGuest.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={isEditing ? editingGuest.lastName : newGuest.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={isEditing ? editingGuest.email : newGuest.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={isEditing ? editingGuest.phoneNumber : newGuest.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      {isEditing ? 'Update Guest' : 'Add Guest'}
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Guest List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.guestId} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{guest.firstName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{guest.lastName}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{guest.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{guest.phoneNumber}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(guest)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(guest.guestId)}
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

export default Guest;
