import { Spinner, Form, Row, Col, Card } from "react-bootstrap";
const StatusMessage = ({ isLoading }) => (
    <div className="text-center my-2">
        <Spinner animation="border" variant="primary" size="sm" />
        <span className="ms-2">{isLoading ? "Processing..." : "Loading data..."}</span>
    </div>
);

const InfoCard = ({ title, children }) => (
    <Card className="mb-3 bg-light">
        <Card.Body className="py-2">
            <h5 className="text-center mb-2">{title}</h5>
            {children}
        </Card.Body>
    </Card>
);

const InfoRow = ({ label, value }) => (
    <Row className="g-2">
        <Col xs={3} md={2} className="text-end pt-1">
            <Form.Label className="mb-0">{label}:</Form.Label>
        </Col>
        <Col xs={9} md={10}>
            <Form.Control plaintext readOnly value={value || ""} size="sm" />
        </Col>
    </Row>
);

const InputRow = ({ label, name, type = "text", value, onChange, required, readOnly, placeholder }) => (
    <Row className="g-2 mb-2">
        <Col xs={3} md={2} className="text-end pt-1">
            <Form.Label className="mb-0">{label}:</Form.Label>
        </Col>
        <Col xs={9} md={10}>
            <Form.Control
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                readOnly={readOnly}
                size="sm"
                placeholder={placeholder}
            />
        </Col>
    </Row>
);

const SelectRow = ({ label, name, value, onChange, options, required }) => (
    <Row className="g-2 mb-2">
        <Col xs={3} md={2} className="text-end pt-1">
            <Form.Label className="mb-0">{label}:</Form.Label>
        </Col>
        <Col xs={9} md={10}>
            <Form.Select name={name} value={value} onChange={onChange} required={required} size="sm">
                <option value="">Select {label}</option>
                {options.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                ))}
            </Form.Select>
        </Col>
    </Row>
);


export { StatusMessage, InfoCard, InfoRow, SelectRow, InputRow };