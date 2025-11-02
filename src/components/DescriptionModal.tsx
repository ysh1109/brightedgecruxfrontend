import { IconButton, Modal, } from '@mui/material'
import type { CruxRow, MetricKey } from '../types/crux';
import { Box } from '@mui/system';
import { MetricCards } from './MetricCards';
import CloseIcon from "@mui/icons-material/Close";





type descriptionModal = {
    handleClose: () => void;
    data: CruxRow | null;
    open: boolean,
    visibleColumn: Record<MetricKey, boolean>
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    background: 'white',
    borderRadius: 6,
    boxShadow: 24,
    p: 4,
};


const DescriptionModal = ({ open, handleClose, data, visibleColumn }: descriptionModal) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <div style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20
                }}>

                    {/* TOP ROW */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 24,
                        flexWrap: "wrap"
                    }}>

                        <span style={{
                            color: "#111",
                            fontWeight: 600,
                            background: "#f4f7fa",
                            padding: "8px 14px",
                            borderRadius: 6,
                            alignItems:'center',
                            display:'flex'
                        }}>
                            URL: <a href={data?.url} target="_blank" rel="noreferrer">{data?.url}</a>
                        </span>

                        {data?.status === "ok" ? (
                            <span style={{
                                fontWeight: 600,
                                color: "#2e7d32",
                                background: "#e8f5e9",
                                padding: "8px 14px",
                                borderRadius: 6
                            }}>
                                Success ✅
                            </span>
                        ) : (
                            <span style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "8px 14px",
                                borderRadius: 6,
                                background: "#ffebee",
                                color: "#c62828",
                                fontWeight: 600
                            }}>
                                Error ❌
                                <span style={{ fontWeight: 400, color: "#9e9e9e" }}>
                                    {data?.errorMessage}
                                </span>
                            </span>
                        )}

                    </div>

                    {/* METRICS */}
                    <div>
                        <MetricCards visibleColumn={visibleColumn} data={data} />
                    </div>

                </div>


            </Box>
        </Modal>
    )
}

export default DescriptionModal