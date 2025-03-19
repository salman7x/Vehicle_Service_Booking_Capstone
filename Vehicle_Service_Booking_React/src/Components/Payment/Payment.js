import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    paymentId: "",
    bookingId: "",
    amountPaid: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: ""
  });

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const respbookings = await axios.get(`https://localhost:7059/api/Bookings1/bookedSevice/${id}`);
        const validBookings = respbookings.data.filter(booking => booking.serviceId);
        setBookings(validBookings);

        if (validBookings.length === 0) {
          setError("No bookings with selected service found");
        }
      } catch (error) {
        console.error("Error fetching bookings.", error);
        setError("Failed to load bookings data from bookings table");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [id]);

  const handleBookingChange = async (e) => {
    const selectedBookingId = e.target.value;
    console.log("Selected booking:", bookings.find(b => b.bookingId.toString() === selectedBookingId));
    setFormData(prev => ({ ...prev, bookingId: selectedBookingId }));


    if (selectedBookingId) {
      try {
        setLoading(true);
        const respfetchprice = await axios.get(`https://localhost:7059/api/Payments/GetPaymentDetails/${selectedBookingId}`);

        let amount;
        if (respfetchprice.data) {
          amount = respfetchprice.data.amountPaid !== undefined 
            ? respfetchprice.data.amountPaid 
            : respfetchprice.data.AmountPaid;
        }

        if (amount === undefined) {
          const selectedBooking = bookings.find(b => b.bookingId.toString() === selectedBookingId);
          if (selectedBooking && selectedBooking.price) {
            amount = selectedBooking.price;
          } else {
            throw new Error("Amount not found in response");
          }
        }

        setFormData(prev => ({ ...prev, amountPaid: amount.toString() }));
      } catch (error) {
        console.error("Error fetching the payment details.", error);
        setError("Failed to fetch the payment details");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.bookingId || !formData.paymentMethod || !formData.amountPaid) {
      setError("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const selectedBooking = bookings.find(b => b.bookingId.toString() === formData.bookingId);
    console.log("Selected booking data : ",selectedBooking);

    const paymentData = {
      BookingId: parseInt(formData.bookingId),
      AmountPaid: parseFloat(formData.amountPaid),
      PaymentDate: new Date().toISOString(),
      PaymentMethod: formData.paymentMethod,
      ServiceId: selectedBooking?.serviceId || null 

    };

    console.log("Payment payload:", JSON.stringify(paymentData));

    try {
      const response = await axios.post(
        "https://localhost:7059/api/Payments",
        paymentData,
        {
          headers: { 
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Success response:", response);
      setSuccess(true);
      setTimeout(() => navigate(`/CustomerDashboard/${id}`), 2000);
    } catch (error) {
      console.error("Payment error: ", error);
      let errorMessage = "Payment Failed";

      if (error.response) {
        // Add more detailed error information if available
        errorMessage += `: ${error.response.data?.message || error.response.data || error.message}`;
        console.log("Error response data:", error.response.data);
      } else {
        errorMessage += `: ${error.message}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-3" style={{ maxWidth: "600px" }}>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-dark text-white text-center py-2">
          <h4 className="mb-0">Make a Payment</h4>
        </Card.Header>
        <Card.Body className="p-3">
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Payment Successful! Redirecting to Customer Dashboard...</Alert>}

          {!success && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Booking</Form.Label>
                <Form.Select 
                  value={formData.bookingId} 
                  onChange={handleBookingChange} 
                  required
                  disabled={loading}
                >
                  <option value="">Select a Booking</option>
                  {bookings.map(booking => (
                    <option key={booking.bookingId} value={booking.bookingId}>
                      Booking #{booking.bookingId} - {booking.status} {booking.serviceId ? ` - Service #${booking.serviceId}` : " (No Service)"}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Amount to be Paid</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.amountPaid || "Loading..."} 
                  readOnly 
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select 
                  value={formData.paymentMethod} 
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))} 
                  required
                  disabled={loading}
                >
                  <option value="">Select a Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Online">Online</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-between">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => navigate(`/CustomerDashboard/${id}`)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Payment;



