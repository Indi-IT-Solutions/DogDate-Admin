import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserVendorGrowthChart: React.FC = () => {
    // Sample data for Users growth over time
    const data = [
        { name: 'Jan', users: 50 },
        { name: 'Feb', users: 75 },
        { name: 'Mar', users: 120 },
        { name: 'Apr', users: 180 },
        { name: 'May', users: 250 },
        { name: 'Jun', users: 350 },
    ];

    return (
        <div>
            <div className="dropSelect_option">
                <h3 className="mb-0">Users Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#4BBFF9" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserVendorGrowthChart;
