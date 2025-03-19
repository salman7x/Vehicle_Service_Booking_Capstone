import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../AuthContext";
import "./Login.css";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Customer");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // For navigation

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("https://localhost:7059/api/Auth/login", {
                email,
                password,
                role,
            });

            const { token, user } = response.data;
            if (!user || !user.role) {
                throw new Error("Role not assigned coorectly . Please try again");
            }

            login(user, token);
            const id = user.id;
            console.log("Password entered:", password);
            console.log("User id : ", id);
            

            alert(`Login successful ${role}!`);

            if (role === "Customer") {
                console.log("Navigating to /Customers");
                localStorage.setItem("customerid" , id);
                navigate(`/CustomerDashboard/${user.id}`);

            } else if (role === "Mechanic") {
                console.log("Navigating to Mechanics ");
                localStorage.setItem("mechanicid" , id);
                navigate(`/MechanicDashboard/${user.id}`);
            }
            else {
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email, password, or role. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="login-box p-4 shadow-lg rounded">
                <h2 className="text-center mb-4">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleLogin} className="d-flex flex-column">
                    <label className="form-label text-start">Email:</label>
                    <input type="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} required />

                    <label className="form-label text-start">Password:</label>
                    <input type="password" className="form-control mb-3" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <label className="form-label text-start">Role:</label>
                    <select className="form-control mb-4" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Customer">Customer</option>
                        <option value="Mechanic">Mechanic</option>
                    </select>

                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                {/* New User? Register Link */}
            <p className="text-center mt-3">
                <span className="new-user-text">New User? </span>
                <a href="/Register" className="text-primary text-decoration-underline">Register here</a>
            </p>
            </div>
        </div>
    );

};

export default Login;
