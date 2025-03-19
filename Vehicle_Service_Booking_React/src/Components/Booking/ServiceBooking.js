import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { StatusMessage, InfoCard, InfoRow, InputRow } from "../formelements";

const ServiceBooking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState(null);
    const [services, setServices] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [formData, setFormData] = useState({
        vehicleId: "",
        serviceId: "",
        userId: id,
        description: "",
        price: "",
        bookingDate: new Date().toISOString().split("T")[0],
        status: "Book Now",
        createdAt: new Date().toISOString()
    });

    useEffect(() => {
        const fetchData = async () => {
            setFetchingData(true);
            try {
                const userResponse = await axios.get(`https://localhost:7059/api/Users/${id}`);
                setUserData(userResponse.data);

                const serviceResponse = await axios.get('https://localhost:7059/api/Services');
                setServices(serviceResponse.data);

                const vehicleResponse = await axios.get(`https://localhost:7059/api/Vehicles?userId=${id}`);
                const uniqueVehicles = vehicleResponse.data.reduce((acc, vehicle) => {
                    if (!acc.some(v => v.vehicleId === vehicle.vehicleId)) {
                        acc.push(vehicle);
                    }
                    return acc;
                }, []);
                setVehicles(uniqueVehicles);
            } catch (error) {
                console.error("API Error:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, [id]);

    const handleVehicleChange = (e) => {
        setFormData(prev => ({ ...prev, vehicleId: e.target.value }));
    };

    const handleServiceChange = (e) => {
        const selectedService = services.find(service => service.serviceId.toString() === e.target.value);
        if (selectedService) {
            setFormData(prev => ({
                ...prev,
                serviceId: selectedService.serviceId,
                description: selectedService.description,
                price: selectedService.price.toString()
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const bookingData = {
                VehicleId: parseInt(formData.vehicleId),
                ServiceId: parseInt(formData.serviceId),
                UserId: parseInt(id),
                BookingDate: new Date().toISOString(),
                Status: "Pending", 
                CreatedAt: new Date().toISOString(),
                Booking_Price: parseFloat(formData.price)
            };
    
            console.log("Sending booking data:", bookingData);
    
            const response = await axios.post(
                "https://localhost:7059/api/Bookings1",
                bookingData,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
    
            console.log("Response:", response);
            
            setSuccess(true);
            setTimeout(() => navigate(`/Payment/${id}`), 2000);
        } catch (error) {
            console.error("API Error:", error);
            setError("Failed to book the service. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-3" style={{ maxWidth: "700px" }}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-dark text-white text-center py-2">
                    <h4 className="mb-0">Service Booking</h4>
                </Card.Header>
                <Card.Body className="p-3">
                    {(loading || fetchingData) && <StatusMessage isLoading={true} />}

                    {error && <Alert variant="danger">{error}</Alert> }

                    {success && <Alert variant="success">Booking successful! Redirecting to Payment...</Alert>}
                    
                    {!success && !fetchingData && (
                        <Form onSubmit={handleSubmit}>
                            <InfoCard title="Customer Information">
                                <InfoRow label="Full Name" value={userData?.fullName} />
                                <InfoRow label="Email" value={userData?.email} />
                            </InfoCard>

                            <InfoCard title="Vehicle Information">
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Vehicle</Form.Label>
                                    <Form.Select
                                        name="vehicleId"
                                        value={formData.vehicleId}
                                        onChange={handleVehicleChange}
                                        required
                                        
                                    >
                                        <option value="">Select a vehicle</option>
                                        {vehicles.map(vehicle => (
                                            <option key={vehicle.vehicleId} value={vehicle.vehicleId.toString()}>
                                                {vehicle.name} - {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </InfoCard>


                            <InfoCard title="Service Information">
                                <Form.Group className="mb-3">
                                    <Form.Label>Service Name</Form.Label>
                                    <Form.Select
                                        name="serviceId"
                                        value={formData.serviceId}
                                        onChange={handleServiceChange}
                                        required

                                    >
                                        <option value="">Select a service</option>
                                        {services.map(service => (
                                            <option key={service.serviceId} value={service.serviceId.toString()}>
                                                {service.serviceName}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <InputRow label="Description" name="description" value={formData.description} readOnly />
                                <InputRow label="Price" name="price" value={formData.price} readOnly />
                            </InfoCard>
                            <div className="d-flex justify-content-between">
                                <Button variant="secondary" size="sm" onClick={() => navigate(`/CustomerDashboard/${id}`)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" type="submit" disabled={loading || fetchingData}>
                                    Book Service
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ServiceBooking;
