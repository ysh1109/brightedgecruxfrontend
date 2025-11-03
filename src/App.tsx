import React, { Suspense, useState } from 'react'
import './App.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { api } from './api';
import DataTable from './components/DataTable';
import type { CruxRow } from './types/crux';
import FilterOptions from './components/FilterOptions';
import ErrorBoundary from './components/ErrorBoundry';
const DescriptionModal = React.lazy(() => import("./components/DescriptionModal"));
const Summary = React.lazy(() => import("./components/Summary"));

function App() {
  //column keys we allow filtering to hide and show
  type ColumnKey = "fcp" | "lcp" | "cls" | "inp";

  const [input, setInput] = useState("");   // textarea value
  const [cruxData, setCruxData] = useState<CruxRow[]>([]); //main table data (successful and error objects)
  const [isLoading, setIsLoading] = useState(false) //loading UI flag
  const [viewData, setViewData] = useState<CruxRow | null>(null);
  const [open, setOpen] = useState(false);
  const [visibleColumn, setVisibleColumn] = useState<Record<ColumnKey, boolean>>({
    'fcp': true,
    'lcp': true,
    'cls': true,
    'inp': true
  })

  const handleClose = () => setOpen(false);

  const handleView = (row: CruxRow) => {
    setViewData(row);
    setOpen(true);
  };



  const handleClearTable = () => {
    setCruxData([])
    setInput('')
  }
  const handleSubmit = () => {
    setIsLoading(true)
    // split by new lines -> multiple URLS support
    const urls = input
      .split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);

    //append new results
    api.post("/getCrux", { urls })
      .then(res => {
        setCruxData([...cruxData, ...res.data.data]);
        setInput('')
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err)
        setIsLoading(false)
      });
  }

  const handleDeleteRow = (id: string | number) => {
    //delete single row
    setCruxData(prev => prev.filter(item => item.id !== id));
  };

  const handleColumn = (selectedlist: string[]) => {
    //update visible Columns based on selected filters
    let visibleColumnTemp: any = { ...visibleColumn }

    Object.keys(visibleColumn).forEach((col: string) => {

      visibleColumnTemp[col] = selectedlist.includes(col)

    })

    setVisibleColumn(visibleColumnTemp)
  }

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', overflowY: 'auto' }}>

      <h1>BrightEdge CRUX Vitals Dashboard</h1>

      <div className='input-container'>
        <div style={{ marginBottom: "8px", padding: 4, paddingInline: 10 }}>
          <span style={{ color: 'white', fontSize: "16px", fontWeight: 500, }} >
            ** For multiple URLs, add each URL on new line
          </span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <TextField
            id="outlined-textarea"
            placeholder="Enter URLs each on new line"
            multiline
            rows={3}
            fullWidth
            value={input}
            sx={{ background: 'white', borderRadius: 4 }}
            onChange={(e) => setInput(e.target.value)}
          />

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="contained" sx={{ textTransform: 'none', height: 80, borderRadius: 4 }} onClick={handleSubmit}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </div>
        </div>


      </div>


      <div className='table-section' style={{ width: '80%', marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {cruxData.length > 0 && <FilterOptions handleColumn={handleColumn} />}
          </div>
          <div>
            <Button variant="contained" disabled={!cruxData.length} color='error' sx={{ mt: 2, textTransform: 'none' }} onClick={handleClearTable}>
              reset data
            </Button>
          </div>

        </div>
        <div style={{ marginTop: 16, width: '100%' }}>
          <ErrorBoundary>
            <DataTable onDelete={handleDeleteRow} visibleColumn={visibleColumn} rows={cruxData} isLoading={isLoading} onView={handleView} />
          </ErrorBoundary>
          {cruxData.length > 0 && (
            <ErrorBoundary>
              <Suspense fallback={<div style={{ color: "white" }}>Loading summary...</div>}>
                <Summary visibleColumn={visibleColumn} rows={cruxData} />
              </Suspense>
            </ErrorBoundary>
          )}
        </div>

      </div>

      {open && (
        <ErrorBoundary>
          <Suspense fallback={<div style={{ color: "white" }}>Loading details...</div>}>
            <DescriptionModal
              visibleColumn={visibleColumn}
              handleClose={handleClose}
              open={open}
              data={viewData}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  )
}

export default App
