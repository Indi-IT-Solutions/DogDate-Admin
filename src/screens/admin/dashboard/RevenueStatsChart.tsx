import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueStatsChart: React.FC = () => {
    // Updated sample data for monthly total income in USD
    const data = [
        { month: 'Jan', income: 5400 },
        { month: 'Feb', income: 6100 },
        { month: 'Mar', income: 7200 },
        { month: 'Apr', income: 6800 },
        { month: 'May', income: 7900 },
        { month: 'Jun', income: 8500 },
    ];

    return (
        <div>
            <div className="dropSelect_option">
                <h3 className="mb-0">Revenue Stats <span style={{ fontWeight: 400, fontSize: 14, color: '#888' }}>(Total Income per Month, USD)</span></h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />

                    <Tooltip
                        cursor={{ fill: 'rgba(148, 235, 0, 0.1)' }}
                        contentStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Total Income']}
                        labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#4bbff9" name="Total Income (USD)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueStatsChart;
