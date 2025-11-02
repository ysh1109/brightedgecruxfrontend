import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const BarChartContainer = ({ data, metric, color }: any) => {
    return (
        <div style={{ width: "100%", height: 300 }}>
            <h3>{metric.toUpperCase()}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="url" />
                    <YAxis />
                    <Tooltip
                        formatter={(value, _name, props) => [
                            `${metric.toUpperCase()}: ${value}`,
                            props?.payload?.url
                        ]}
                    />
                    <Bar dataKey={metric} fill={color} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartContainer