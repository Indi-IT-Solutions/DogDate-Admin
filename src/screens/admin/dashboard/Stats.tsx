import { Icon } from "@iconify/react/dist/iconify.js";
import { Row, Col } from "react-bootstrap";
import { DashboardStats, AuthService } from "@/services";
import { usePermissions } from "@/context/PermissionsContext";

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
    const formatDollars = (cents: number) => `£${(Number(cents || 0) / 1000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const { allowedRoutes } = usePermissions();

    // Check if user has payments permission
    const user = AuthService.getCurrentUser();
    const isAdmin = (user as any)?.type === 'admin';
    const hasPaymentsPermission = isAdmin || allowedRoutes.includes('/payments');

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
        // Only show revenue if user has payments permission
        ...(hasPaymentsPermission ? [{
            title: "Revenue",
            value: formatDollars(data.total_revenue),
            icon: "qlementine-icons:money-16",
            bgColor: "#D8FFE1",
            iconColor: "#1F8F39"
        }] : [])
    ];

    return (
        <Row className="g-3 stats-row">
            {statsData.map((stat, index) => (
                <Col className={`${'col-md-4'} mb-0`} key={index}>
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