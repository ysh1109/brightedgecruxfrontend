import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { MetricKey } from '../types/crux';




type ColumnKey = "fcp" | "lcp" | "cls" | "inp";

type props = {
    data: any;
    visibleColumn: Record<ColumnKey, boolean>
}

const areaColors = {
    fcp: "#1e88e5",
    lcp: "#010101ff",
    cls: "#f9a825",
    inp: "#e53935",
}
const AreaChartContainer = ({ data, visibleColumn }: props) => {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                responsive
                data={data}
                margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="fcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e88e5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1e88e5" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="lcp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#43a047" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#43a047" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="cls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f9a825" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f9a825" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient id="inp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#e53935" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#e53935" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="url" />
                <YAxis width="auto" />
                <Tooltip
                    formatter={(value, metric, props) => [`${metric}: ${value}`, props.payload.url]}
                />
               {(["fcp","lcp","cls","inp"] as MetricKey[]).map(metric => (
                visibleColumn[metric] && (
                <Area
                    key={metric}
                    type="monotone"
                    dataKey={metric}
                    stroke={areaColors[metric]}
                    fill={`url(#${metric})`}
                />
                )
                ))}
            </AreaChart>
        </ResponsiveContainer>
    )
}
    ;

export default AreaChartContainer;