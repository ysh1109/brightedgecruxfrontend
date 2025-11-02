import { Box } from '@mui/material';
import type { CruxRow, MetricKey } from '../types/crux'
import { calculateAverages, getSummaryCounts } from '../utils/metricsUtils'
import React, { useEffect, useState } from 'react';
import AreaChartContainer from './AreaChartContainer'
import BarChartContainer from './BarChartContainer';
import ErrorBoundary from './ErrorBoundry';


type props = {
    rows: CruxRow[],
    visibleColumn: Record<MetricKey, boolean>
}

const barChartColors = {
    fcp: "#0088FE",
    lcp: "#00C49F",
    cls: "#FFBB28",
    inp: "#FF8042"
}

const Card = ({ title, value }: { title: string, value: number | string | null }) => {
    return (
        <Box sx={{
            background: '#2f3336',
            borderRadius: 2,
            padding: 2,
            color: '#fff',
            minHeight: 120,
            width: 220,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{ fontWeight: 600 }}>{title}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>
                {value ?? "-"}
            </div>
        </Box>
    )
}


const Summary = ({ rows, visibleColumn }: props) => {
    

    const [chartData, setChartData] = useState<Record<MetricKey, number | string | null>[]>([])
    const avg = React.useMemo(() => calculateAverages(rows), [rows])
    const counts = React.useMemo(() => getSummaryCounts(rows), [rows])
    
    useEffect(() => {
        const chartDataResult = rows
            .filter(r => r.status === "ok")   // only valid data
            .map(r => ({
                url: r.url,
                fcp: r.fcp,
                lcp: r.lcp,
                cls: typeof r.cls === "string" ? parseFloat(r.cls) : r.cls,
                inp: r.inp
            }));
        setChartData(chartDataResult)
    }, [rows])



    return (
        <div className='summary-section'>

            
            <h1 style={{ marginTop: 16 }}>Summary</h1>
            <div style={{ width: "100%", height: 400 }}>
                <AreaChartContainer visibleColumn={visibleColumn} data={chartData} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32, width: '100%' }}>
                {(["fcp", "lcp", "cls", "inp"] as MetricKey[]).map(metric => (
                    visibleColumn[metric] && (
                        <ErrorBoundary>
                            <BarChartContainer
                                key={metric}
                                data={chartData}
                                metric={metric}
                                color={barChartColors[metric]}
                            />
                        </ErrorBoundary>
                    )))}
            </div>


            <div style={{ marginTop: 16 }}>

                <h1>Averages</h1>
                <span style={{ fontSize: 14, color: "#aaa", marginBottom: 12, display: "block" }}>
                    These are average Core Web Vitals values calculated from all successful URLs you added.
                </span>

                <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                    {visibleColumn['fcp'] && <Card title="AVG FCP" value={avg.fcp} />}
                    {visibleColumn['lcp'] && <Card title="AVG LCP" value={avg.lcp} />}
                    {visibleColumn['cls'] && <Card title="AVG CLS" value={avg.cls} />}
                    {visibleColumn['inp'] && <Card title="AVG INP" value={avg.inp} />}
                </div>

            </div>

            <div style={{ marginTop: 16 }}>
                <h1 >Sum</h1>
                <span style={{ fontSize: 14, color: "#aaa", marginBottom: 12, display: "block" }}>
                    This shows total count of URLs based on their overall performance rating.
                </span>
                <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                    <Card title="GOOD" value={counts.good} />
                    <Card title="NEEDS IMPROVEMENT" value={counts.ni} />
                    <Card title="POOR" value={counts.poor} />
                </div>
            </div>


        </div>
    )
}

export default React.memo(Summary, (prev, next) => {
    return prev.rows === next.rows && prev.visibleColumn === next.visibleColumn
})
