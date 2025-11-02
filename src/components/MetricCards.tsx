import { LinearProgress, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import { colorScale, percent, ratingText } from "../utils/metricsUtils";
import type { MetricKey } from "../types/crux";

const Card = ({ title, value, unit, color, metric }: any) => {

    const status = ratingText(metric, value);

    return (
        <Box sx={{
            background: '#2f3336',
            borderRadius: 2,
            padding: 2,
            color: '#fff',
            minHeight: 120,
            width: 250
        }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>

            {value !== null ? (
                <div style={{ fontSize: 32, fontWeight: 700, color }}>
                    {value}{unit}
                </div>
            ) : (
                <div>-</div>
            )}

            {value !== null ? <Tooltip title={value ?? "no data"}>
                <LinearProgress
                    variant="determinate"
                    value={percent(metric, value)}
                    sx={{
                        height: 10,
                        borderRadius: 5,
                        "& .MuiLinearProgress-bar": {
                            backgroundColor: colorScale(metric, value)
                        }
                    }}
                />
            </Tooltip> : ''}
            {value !== null && (
                <div style={{ fontSize: 12, marginTop: 8, background: '#5c5a5ac4', borderRadius: 4, padding: 4 }}>
                    <span>
                        Your local {metric.toUpperCase()} value of {value}{unit} -{" "}
                        <span style={{ color }}>{status}</span>.
                    </span>
                </div>
            )}
        </Box>
    )
};

type props = {
    data: any;
    visibleColumn: Record<MetricKey, boolean>
}

const metricTitles = {
    fcp: "First Contentful Paint (FCP)",
    lcp: "Largest Contentful Paint (LCP)",
    cls: "Cumulative Layout Shift (CLS)",
    inp: "Interaction to Next Paint (INP)"
} 


export const MetricCards = ({ data, visibleColumn }: props) => {
    return (
        <div className="metric-cards-container">

            {(["fcp", "lcp", "cls", "inp"] as MetricKey[]).map(metric =>
                visibleColumn[metric] && (
                    <Card
                        key={metric}
                        title={metricTitles[metric]}
                        value={data[metric]}
                        unit={metric === "cls" ? "" : " ms"}
                        color={colorScale(metric, data[metric])}
                        metric={metric}
                    />
                )
            )
            }

        </div>
    )
}
