import './App.css';
import { AuthProvider } from "./AuthContext"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import CustomerDashboard from './Components/Users/CutsomerDashboard';
import MechanicDashboard from './Components/Users/MechanicDashboard';
import ServiceBooking from './Components/Booking/ServiceBooking';
import Payment from './Components/Payment/Payment';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/CustomerDashboard/:id" element={<CustomerDashboard/>} />
          <Route path="/ServiceBooking/:id" element={<ServiceBooking/>} />
          <Route path="/Payment/:id" element={<Payment/>}/>


          <Route path="/MechanicDashboard" element={<MechanicDashboard/>}/>
          
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
