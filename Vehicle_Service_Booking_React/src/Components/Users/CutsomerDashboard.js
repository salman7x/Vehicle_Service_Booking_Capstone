import { useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Card, Spinner, Nav, Navbar, Dropdown, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"

const CustomerDashboard = () => {
    const { id } = useParams();
    const [user, setuser] = useState(null);
    const [vehicle, setVehicle] = useState([]);
    const [service, setservice] = useState([]);
    const [servicebooked, setservicebooked] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, setError] = useState(null);
    const [activetab, setActivetab] = useState("service");

    // to fetch the bookedservicehistory to handle that creating state of servicehostory and setservicehistory

    const[bookedservicehistory , setbookedservicehistory ] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {

        if (!id) {
            setError("Invalid id");
            setloading(false);
            return;
        }
        const fetchdataofCustomers = async () => {
            try {

                const response = await axios.get(`https://localhost:7059/api/Users/${id}`);
                setuser(response.data);
            }
            catch (error) {
                setError("Error while fetching data from backend");
            }
            finally {
                setloading(false);
            }

        };
        fetchdataofCustomers();

        // fetching data of vehicles of that particulat user either customer or mechanic
        const fetchDataofVehicles = async () => {
            try {
                const responsevehicles = await axios.get(`https://localhost:7059/api/Vehicles/`);
                const uservehicles = responsevehicles.data.filter(vehicle => vehicle.userId === Number(id));
                setVehicle(uservehicles)
            }
            catch (error) {
                console.log("Error while fetching the data.")
            }
            finally {
                setloading(false);
            }

        };
        fetchDataofVehicles();

        // Fetchinng data of services from backend 
        const fetchServiceData = async () => {
            try {
                const ServiceresponseData = await axios.get(`https://localhost:7059/api/Services`);
                setservice(ServiceresponseData.data);
            }
            catch (error) {
                console.log("Error fetching the data from the Service ");
                setError("Failed to load the data of services");
            }
        };
        fetchServiceData();


        const fetchBookedServiceHistory = async () =>{
            try{
                const servicehistory = await axios.get(`https://localhost:7059/api/Bookings1/bookedSevice/${id}`);
                setbookedservicehistory(servicehistory.data);

                console.log("Users history: ",servicehistory.data)
            }
            catch(error){
                console.log("Error fetching the service history of user");
                setError("Failed to load the booking history " ,error);
            }
        };
        fetchBookedServiceHistory();

    }, [id ,setservicebooked]);
    
    // Navigating to Booking Page after clicking on the book a vehicle button
    const handleBookingPage = () => {
        if (!user) {
            console.error("Invalid User ID!");
            alert("Invalid User ID. Cannot navigate.");
            return;
        }
        console.log("Navigating to:", `/ServiceBooking/${id}`);
        navigate(`/ServiceBooking/${id}`);
    };


    // Adding a logout function 
    const handlelogout = () => {
        localStorage.removeItem("token");
        navigate("/Login");

    }


    if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    return (
        <>

            <Navbar bg="dark" expand="lg" className="shadow-sm px-4 ">
                <Navbar.Brand style={{ color: "white", paddingLeft: "50px" }}>Customer Dashboard</Navbar.Brand>

                <Nav className="ms-auto">
                    <Dropdown aligh="end" style={{ paddingRight: "30px" }}>
                        <Dropdown.Toggle variant="light" className="border-0 shadow-none" >
                            <FaUserCircle size={30} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={handlelogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Navbar>


            <Container className="container mt-4">

                <h2 className="text-center mb-4">Customer Information</h2>
                {user ? (
                    <Card className="mx-auto shadow-lg p-4 border-0" style={{ maxWidth: "600px" }}>
                        <Card.Body className="text-center">
                            <Card.Title>Customer Info</Card.Title>
                            <br />
                            <p><strong>Full Name:</strong> {user.fullName}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Role:</strong> {user.role}</p>
                            <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                        </Card.Body>
                    </Card>
                ) : (
                    <p className="text-center text-danger">Customer data is not available.</p>
                )}

                <br /><br />

                <Button type="button" onClick={handleBookingPage} disabled={!user}>Book a Service</Button>

                <br />

                <Nav variant="tabs" className="mt-4">
                    <Nav.Link
                        active={activetab === "BookingDetails"}
                        onClick={() => setActivetab("BookingDetails")}
                    >
                        Booked Services History
                    </Nav.Link>

                    <Nav.Item>
                        <Nav.Link active={activetab === "vehicle"} onClick={() => setActivetab("vehicle")}>
                            Customer Vehicle Details
                        </Nav.Link>
                    </Nav.Item>


                    <Nav.Item>
                        <Nav.Link active={activetab === "service"} onClick={() => setActivetab("service")}>
                            Available Services
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link active={activetab === "payment"} onClick={() => setActivetab("payment")}>
                            Payment
                        </Nav.Link>
                    </Nav.Item>
                </Nav>




                <Card className="shadow-sm p-4 mt-3">
                    <Card.Body>

                        {activetab === "BookingDetails" && (
                            <>
                                <h5>Booked Services</h5>
                                {bookedservicehistory.length > 0 ? (
                                    bookedservicehistory.map(item => (
                                        <Card key={item.bookingId} className="mb-3 p-3 border-0 shadow-sm">
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Booking Id: </p>
                                                <p className="ms-2">{item.bookingId}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Vehicle Id: </p>
                                                <p className="ms-2">{item.vehicleId}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Service Id: </p>
                                                <p className="ms-2">{item.serviceId}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">User Id: </p>
                                                <p className="ms-2">{item.userId}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Booking Date </p>
                                                <p className="ms-2">{new Date(item.bookingDate).toLocaleString()}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Status:  </p>
                                                <p className="ms-2">{item.status}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Created At: </p>
                                                <p className="ms-2">{new Date(item.createdAt).toLocaleString()}</p>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <p>Start Booking your services now</p>
                                )}
                                
                            </>
                        )}


                        {activetab === "service" && (
                            <>
                                <h5>Services Available</h5>
                                {service.length > 0 ? (
                                    service.map(item => (
                                        <Card key={item.id} className="mb-3 p-3 border-0 shadow-sm">
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Service Id:</p>
                                                <p className="ms-2">{item.serviceId}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Service Name:</p>
                                                <p className="ms-2">{item.serviceName}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Description:</p>
                                                <p className="ms-2">{item.description}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Plate:</p>
                                                <p className="ms-2">{item.price}</p>
                                            </div>

                                        </Card>

                                    ))
                                ) : (
                                    <p>No Services are available</p>
                                )}

                            </>

                        )}

                        {activetab === "vehicle" && (
                            <>
                                <h5> Vehicle Details </h5>
                                {vehicle.length > 0 ? (
                                    vehicle.map(item => (
                                        <Card key={item.id} className="mb-3 p-3 border-0 shadow-sm">
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Vehicle Name:</p>
                                                <p className="ms-2">{item.make}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Vehicle Model:</p>
                                                <p className="ms-2">{item.model}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">Year:</p>
                                                <p className="ms-2">{item.year}</p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="fw-bold me-2">License Plate:</p>
                                                <p className="ms-2">{item.licensePlate}</p>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <p> No Registered Vehicles</p>
                                )}
                            </>

                        )}

                        {activetab === "payment" && <h5>💳 Payment Details Coming Soon...</h5>}
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default CustomerDashboard;