import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Hotel from './components/Hotel/Hotel';
import Room from './components/Room/Room';
import Guest from './components/Guest/Guest';
import Booking from './components/Booking/Booking';
import Payment from './components/Payment/Payment';
function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/hotel" element={<Hotel />} />
            <Route path="/room" element={<Room />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/booking" element={<Booking />} /> 
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;