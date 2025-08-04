import { Icon } from "@iconify/react/dist/iconify.js";
import { Row, Col } from "react-bootstrap";

const Data = [
    {
        title: "Total Users",
        value: "40,689",
        icon: "lucide:users",
        bgColor: "#DAD9FF",
        iconColor: "#7878FF"
    },
    {
        title: "Total Dogs",
        value: "1,289",
        icon: "mdi:dog",
        bgColor: "#FFF3D5",
        iconColor: "#FEC53D"
    },
    {
        title: "Breedings Completed",
        value: "469",
        icon: "mdi:dog-service",
        bgColor: "#D5E9FF",
        iconColor: "#0F66CC"
    },
    {
        title: "Playmates Completed",
        value: "892",
        icon: "mdi:dog-side",
        bgColor: "#FFE1E1",
        iconColor: "#FF4D4D"
    },
    {
        title: "Revenue",
        value: "$68,456",
        icon: "qlementine-icons:money-16",
        bgColor: "#D8FFE1",
        iconColor: "#1F8F39"
    }
];

const Stats = () => {
    return (
        <Row className="g-3 stats-row">
            {Data.map((stat, index) => (
                <Col className="col-md-4 mb-0" key={index}>
                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="flex-grow-1">
                                <h6 className="card-title text-muted mb-1">{stat.title}</h6>
                                <h4 className="card-text fw-bold mb-0">{stat.value}</h4>
                            </div>
                            <div className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    backgroundColor: stat.bgColor
                                }}>
                                <Icon icon={stat.icon} color={stat.iconColor} fontSize={24} />
                            </div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    );
};

export default Stats;