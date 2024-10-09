import React, { useState, useEffect } from "react";
import axios from "axios";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    paymentDate: "",
    paymentMethod: "",
  });
  const [editingPayment, setEditingPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/payment");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingPayment({ ...editingPayment, [name]: value });
    } else {
      setNewPayment({ ...newPayment, [name]: value });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (
      !newPayment.amount ||
      !newPayment.paymentDate ||
      !newPayment.paymentMethod
    ) {
      alert("Please fill in all the fields before adding a payment.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/createPayment", newPayment);
      setNewPayment({ amount: "", paymentDate: "", paymentMethod: "" });
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/updatePayment/${editingPayment.paymentId}`,
        editingPayment
      );
      setEditingPayment(null);
      setIsEditing(false);
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await axios.delete(`http://localhost:5000/deletePayment/${id}`);
        fetchPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Payment Management Dashboard
        </h1>

        <button
          onClick={() => {
            setNewPayment({ amount: "", paymentDate: "", paymentMethod: "" });
            setEditingPayment(null);
            setIsEditing(false);
            setShowModal(true);
          }}
          className="mb-4 bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
        >
          Add New Payment
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {isEditing ? "Edit Payment" : "Add New Payment"}
              </h3>
              <form
                onSubmit={isEditing ? handleUpdate : handleAdd}
                className="mt-2 space-y-4"
              >
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                    id="amount"
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={
                      isEditing ? editingPayment.amount : newPayment.amount
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                    id="paymentDate"
                    type="date"
                    name="paymentDate"
                    placeholder="Payment Date"
                    value={
                      isEditing
                        ? editingPayment.paymentDate
                        : newPayment.paymentDate
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-gray-500"
                    id="paymentMethod"
                    type="text"
                    name="paymentMethod"
                    placeholder="Payment Method"
                    value={
                      isEditing
                        ? editingPayment.paymentMethod
                        : newPayment.paymentMethod
                    }
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  >
                    {isEditing ? "Update Payment" : "Add Payment"}
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
        )}

        <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Payment List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.paymentId} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {payment.amount}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {payment.paymentMethod}
                      </p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        onClick={() => handleEdit(payment)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(payment.paymentId)}
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

export default Payment;
