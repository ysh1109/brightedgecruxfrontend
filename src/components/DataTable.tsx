import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { Box, Button, Skeleton, TableFooter, TableSortLabel } from '@mui/material';
import type { CruxRow, MetricKey } from '../types/crux';
import { colorScale, percent } from '../utils/metricsUtils';
import TablePagination from '@mui/material/TablePagination';


type ColumnKey = "fcp" | "lcp" | "cls" | "inp";

type props = {
  rows: CruxRow[],
  onDelete: (id: string | number) => void,
  isLoading: boolean,
  onView: (row: CruxRow) => void,
  visibleColumn: Record<ColumnKey, boolean>
}

const metrics: MetricKey[] = ["fcp", "lcp", "cls", "inp"];



const DataTable = ({ rows, onDelete, isLoading, onView, visibleColumn }: props) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortBy, setSortBy] = useState<keyof CruxRow>("url");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");



  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleSort = (col: keyof CruxRow) => {
    if (sortBy === col) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const sortedRows = React.useMemo(() => {
    return [...rows].sort((a, b) => {
      const va = a[sortBy] ?? "";
      const vb = b[sortBy] ?? "";

      // numeric
      if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
        return sortOrder === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
      }

      // string based (url, status, errorMessage)
      return sortOrder === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
  }, [rows, sortBy, sortOrder]);


  return (
    <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto", minHeight: 300, maxHeight: 600 }} >
      <Table stickyHeader sx={{ minWidth: '100%' }} aria-label="simple table">
        <TableHead>
          <TableRow sx={{ "& .MuiTableCell-root": { fontWeight: 600 } }}>
            <TableCell>
              <TableSortLabel
                active={sortBy === "url"}
                direction={sortBy === "url" ? sortOrder : "asc"}
                onClick={() => handleSort("url")}
              >
                URL
              </TableSortLabel>
            </TableCell>

            <TableCell >Status</TableCell>
            {visibleColumn['fcp'] && <TableCell align="right">
              <TableSortLabel
                active={sortBy === "fcp"}
                direction={sortBy === "fcp" ? sortOrder : "asc"}
                onClick={() => handleSort("fcp")}
              >
                FCP
              </TableSortLabel>
            </TableCell>}
            {visibleColumn['lcp'] && <TableCell align="right">
              <TableSortLabel
                active={sortBy === "lcp"}
                direction={sortBy === "lcp" ? sortOrder : "asc"}
                onClick={() => handleSort("lcp")}
              >
                LCP
              </TableSortLabel>
            </TableCell>}
            {visibleColumn['cls'] && <TableCell align="right">
              <TableSortLabel
                active={sortBy === "cls"}
                direction={sortBy === "cls" ? sortOrder : "asc"}
                onClick={() => handleSort("cls")}
              >
                CLS
              </TableSortLabel>
            </TableCell>}
            {visibleColumn['inp'] && <TableCell align="right">
              <TableSortLabel
                active={sortBy === "inp"}
                direction={sortBy === "inp" ? sortOrder : "asc"}
                onClick={() => handleSort("inp")}
              >
                INP
              </TableSortLabel>
            </TableCell>}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#777" }}>
                {isLoading ?
                  <>
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                    <Skeleton animation="wave" />
                  </>
                  : "No URLs added yet"}
              </TableCell>
            </TableRow>
          ) :
            sortedRows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{
                  maxWidth: 240,        // fix column width
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  <Tooltip title={row.url}>
                    <span>{row.url}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  {row.status === "ok" ? (
                    <span style={{ color: "green", fontWeight: 600 }}>Success ✅</span>
                  ) : (
                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: "red", fontWeight: 600 }}>Error ❌</span>
                      <span>{row.errorMessage}</span>
                    </span>
                  )}
                </TableCell>
                {metrics.map((metric) => (
                  visibleColumn[metric] &&
                  <TableCell key={metric} sx={{ width: 140 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", md: "center" }}
                      sx={{ width: "100%" }}
                    >
                      <div style={{ width: "100%" }}>
                        <Tooltip title={row[metric] ?? "no data"}>
                          <LinearProgress
                            variant="determinate"
                            value={percent(metric, row[metric])}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: colorScale(metric, row[metric])
                              }
                            }}
                          />
                        </Tooltip>
                      </div>

                      <span>{row[metric] ?? "-"}</span>
                    </Stack>
                  </TableCell>
                ))}
                <TableCell >
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'end', }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: "none" }}
                      onClick={() => onView(row)}
                    >
                      View
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ textTransform: "none" }}
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
       <TableFooter>
  <TableRow>
    {rows.length > 5 && <TableCell colSpan={100}>  {/* large number → always full width */}
      <Box sx={{ display:'flex', justifyContent:'flex-end', pr:2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </TableCell>}
  </TableRow>
</TableFooter>
      </Table>
    </TableContainer>
  );
}

export default DataTable
