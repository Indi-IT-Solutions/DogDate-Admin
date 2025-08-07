import React from "react";
import { Card } from "react-bootstrap";
import Confirmed from "./Confirmed";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";
import LostMatches from "./LostMatches";

const Matches: React.FC = () => {
    return (
        <React.Fragment>
            {/* Confirmed Matches Section */}
            <Card className="mb-4">
                <Card.Body>
                    <Confirmed />
                </Card.Body>
            </Card>

            {/* Sent Requests Section */}
            <Card className="mb-4">
                <Card.Body>
                    <SentRequests />
                </Card.Body>
            </Card>

            {/* Received Requests Section */}
            <Card className="mb-4">
                <Card.Body>
                    <ReceivedRequests />
                </Card.Body>
            </Card>

            {/* Lost Matches Section */}
            <Card className="mb-4">
                <Card.Body>
                    <LostMatches />
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default Matches;
