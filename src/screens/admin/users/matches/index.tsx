import React from "react";
import Confirmed from "./Confirmed";
import SentRequests from "./SentRequests";
import ReceivedRequests from "./ReceivedRequests";
import LostMatches from "./LostMatches";


const Matches: React.FC = () => {
    return (
        <React.Fragment>
            <Confirmed />
            <SentRequests />
            <ReceivedRequests />
            <LostMatches />

        </React.Fragment>
    );
};

export default Matches;
