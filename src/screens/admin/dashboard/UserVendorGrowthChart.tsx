import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserGrowthData } from '@/services';

interface UserVendorGrowthChartProps {
    data?: UserGrowthData[];
}

const UserVendorGrowthChart: React.FC<UserVendorGrowthChartProps> = ({ data }) => {
    // Default fallback data
    const defaultData = [
        { month: 'Jan', users: 0, dogs: 0 },
        { month: 'Feb', users: 0, dogs: 0 },
        { month: 'Mar', users: 0, dogs: 0 },
        { month: 'Apr', users: 0, dogs: 0 },
        { month: 'May', users: 0, dogs: 0 },
        { month: 'Jun', users: 0, dogs: 0 },
    ];

    const chartData = data && data.length > 0 ? data : defaultData;

    return (
        <div>
            <div className="dropSelect_option">
                <h3 className="mb-0">Users & Dogs Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => [value, name === 'users' ? 'Users' : 'Dogs']}
                        labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#4BBFF9"
                        activeDot={{ r: 8 }}
                        name="Users"
                    />
                    <Line
                        type="monotone"
                        dataKey="dogs"
                        stroke="#FEC53D"
                        activeDot={{ r: 8 }}
                        name="Dogs"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserVendorGrowthChart;
