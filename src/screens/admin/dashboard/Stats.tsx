import { Icon } from "@iconify/react/dist/iconify.js";
import { Row, Col } from "react-bootstrap";
import { DashboardStats } from "@/services";

interface StatsProps {
    data?: DashboardStats;
}

const defaultStats = {
    total_users: 0,
    total_dogs: 0,
    breedings_completed: 0,
    playmates_completed: 0,
    total_revenue: 0,
    total_active_users: 0,
    total_inactive_users: 0,
    total_approved_dogs: 0,
    total_pending_dogs: 0,
    recent_registrations: [],
    recent_dog_registrations: []
};

const Stats: React.FC<StatsProps> = ({ data = defaultStats }) => {
    const statsData = [
        {
            title: "Total Users",
            value: data.total_users.toLocaleString(),
            icon: "lucide:users",
            bgColor: "#DAD9FF",
            iconColor: "#7878FF"
        },
        {
            title: "Total Dogs",
            value: data.total_dogs.toLocaleString(),
            icon: "mdi:dog",
            bgColor: "#FFF3D5",
            iconColor: "#FEC53D"
        },
        {
            title: "Breedings Completed",
            value: data.breedings_completed.toLocaleString(),
            icon: "mdi:dog-service",
            bgColor: "#D5E9FF",
            iconColor: "#0F66CC"
        },
        {
            title: "Playmates Completed",
            value: data.playmates_completed.toLocaleString(),
            icon: "mdi:dog-side",
            bgColor: "#FFE1E1",
            iconColor: "#FF4D4D"
        },
        {
            title: "Revenue",
            value: `$${data.total_revenue.toLocaleString()}`,
            icon: "qlementine-icons:money-16",
            bgColor: "#D8FFE1",
            iconColor: "#1F8F39"
        }
    ];

    return (
        <Row className="g-3 stats-row">
            {statsData.map((stat, index) => (
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