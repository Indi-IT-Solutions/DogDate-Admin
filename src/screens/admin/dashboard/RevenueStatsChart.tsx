import React from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RevenueData } from '@/services';

interface RevenueStatsChartProps {
    data?: RevenueData[];
}

const RevenueStatsChart: React.FC<RevenueStatsChartProps> = ({ data }) => {
    // Default fallback data
    const defaultData = [
        { month: 'Jan', income: 0, subscriptions: 0, total_transactions: 0 },
        { month: 'Feb', income: 0, subscriptions: 0, total_transactions: 0 },
        { month: 'Mar', income: 0, subscriptions: 0, total_transactions: 0 },
        { month: 'Apr', income: 0, subscriptions: 0, total_transactions: 0 },
        { month: 'May', income: 0, subscriptions: 0, total_transactions: 0 },
        { month: 'Jun', income: 0, subscriptions: 0, total_transactions: 0 },
    ];

    const toDollars = (cents: number) => Number(cents || 0) / 1000;
    const chartData = (data && data.length > 0 ? data : defaultData).map(item => ({
        ...item,
        income: toDollars(item.income as any),
    }));

    return (
        <div>
            <div className="dropSelect_option">
                <h3 className="mb-0">Revenue Stats <span style={{ fontWeight: 400, fontSize: 14, color: '#888' }}>(Total Income per Month, GBP)</span></h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <Tooltip
                        cursor={{ fill: 'rgba(148, 235, 0, 0.1)' }}
                        contentStyle={{ backgroundColor: '#000000', color: '#ffffff' }}
                        formatter={(value, name) => {
                            switch (name) {
                                case 'income':
                                    return [
                                        `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                        'Total Income'
                                    ];
                                case 'subscriptions':
                                    return [value, 'Subscriptions'];
                                case 'total_transactions':
                                    return [value, 'Total Transactions'];
                                default:
                                    return [value, name];
                            }
                        }}
                        labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar
                        dataKey="income"
                        fill="#4bbff9"
                        name="Total Income (GBP)"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueStatsChart;
