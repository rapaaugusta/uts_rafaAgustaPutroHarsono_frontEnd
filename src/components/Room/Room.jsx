import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Room = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    roomType: '',
    price: '',
    availability: true,
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/room'); 
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingRoom({ ...editingRoom, [name]: value });
    } else {
      setNewRoom({ ...newRoom, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newRoom.roomNumber || !newRoom.roomType || !newRoom.price) {
      alert('Please fill in all the fields before adding a room.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/createRoom', newRoom);
      setNewRoom({ roomNumber: '', roomType: '', price: '', availability: true });
      fetchRooms(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/updateRoom/${editingRoom.roomId}`, editingRoom);
      setEditingRoom(null);
      setIsEditing(false);
      fetchRooms(); 
      setShowModal(false);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await axios.delete(`http://localhost:5000/deleteRoom/${id}`);
        fetchRooms(); 
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Room Management Dashboard</h1>
        
        <button
          onClick={() => {
            setNewRoom({ roomNumber: '', roomType: '', price: '', availability: true });
            setEditingRoom(null);
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Add New Room
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{isEditing ? 'Edit Room' : 'Add New Room'}</h3>
                <form onSubmit={isEditing ? handleUpdate : handleAdd} className="mt-2 space-y-4">
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="roomNumber"
                      type="text"
                      name="roomNumber"
                      placeholder="Room Number"
                      value={isEditing ? editingRoom.roomNumber : newRoom.roomNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="roomType"
                      type="text"
                      name="roomType"
                      placeholder="Room Type"
                      value={isEditing ? editingRoom.roomType : newRoom.roomType}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                      id="price"
                      type="number"
                      name="price"
                      placeholder="Price"
                      min="0"
                      value={isEditing ? editingRoom.price : newRoom.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={isEditing ? editingRoom.availability : newRoom.availability}
                        onChange={(e) => {
                          const value = e.target.checked;
                          if (isEditing) {
                            setEditingRoom({ ...editingRoom, availability: value });
                          } else {
                            setNewRoom({ ...newRoom, availability: value });
                          }
                        }}
                      />
                      <span className="ml-2 text-gray-700">Available</span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="submit"
                      className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    >
                      {isEditing ? 'Update Room' : 'Add Room'}
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
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Room List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.roomId} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{room.roomNumber}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{room.roomType}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{room.price}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{room.availability ? 'Available' : 'Not Available'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(room)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(room.roomId)}
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

export default Room;
