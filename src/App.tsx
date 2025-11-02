import {  useState } from 'react'
import './App.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { api } from './api';
import DataTable from './components/DataTable';
import type { CruxRow } from './types/crux';
import DescriptionModal from './components/DescriptionModal';
import FilterOptions from './components/FilterOptions';
import Summary from './components/Summary';
import ErrorBoundary from './components/ErrorBoundry';

function App() {

  type ColumnKey = "fcp" | "lcp" | "cls" | "inp";

  const [input, setInput] = useState("");   // textarea value
  const [cruxData, setCruxData] = useState<CruxRow[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [viewData, setViewData] = useState<CruxRow | null>(null);
  const [open, setOpen] = useState(false);
  const [visibleColumn, setVisibleColumn] = useState<Record<ColumnKey,boolean>>({
      'fcp' : true,
      'lcp': true,
      'cls' : true,
      'inp' : true
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
    // split by new line
    setIsLoading(true)
    const urls = input
      .split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);

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
    console.log("handle delete render")
    setCruxData(prev => prev.filter(item => item.id !== id));
  };

  const handleColumn = (selectedlist : string[]) => {
      let visibleColumnTemp : any  = {...visibleColumn}

      Object.keys(visibleColumn).forEach((col : string)=> {
          
            visibleColumnTemp[col] = selectedlist.includes(col)
          
      })

      setVisibleColumn(visibleColumnTemp)
  }

  return (
   <div style={{ padding: 32, display:'flex', flexDirection:'column', alignItems:'center', height:'100vh', overflowY:'auto' }}>

      <h1>BrightEdge Crux</h1>

      <div className='input-container'>
        <div style={{ marginBottom: "8px", padding: 4, paddingInline: 10 }}>
          <span style={{ color: 'white', fontSize: "16px", fontWeight: 500, }} >
            ** For multiple URLs, add each URL on new line
          </span>
        </div>

        <div style={{display:'flex', gap:12}}>
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

          <div style={{ display:'flex', alignItems:'center'}}>
            <Button variant="contained" sx={{ textTransform: 'none', height:80, borderRadius:4 }} loading={isLoading} onClick={handleSubmit}>
              Search
            </Button>
          </div>
        </div>


      </div>


      <div className='table-section' style={{ width: '80%', marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',alignItems:'center' }}>
          <div>
            <FilterOptions handleColumn={handleColumn} />
          </div>
          <div>
            <Button variant="contained" color='error' sx={{ mt: 2, textTransform: 'none' }} onClick={handleClearTable}>
              reset data
            </Button>
          </div>

        </div>
        <div style={{ marginTop: 16, width: '100%' }}>
          <ErrorBoundary>
          <DataTable onDelete={handleDeleteRow} visibleColumn={visibleColumn} rows={cruxData} isLoading={isLoading} onView={handleView} />
          </ErrorBoundary>
          {cruxData.length > 0 ? <ErrorBoundary><Summary visibleColumn={visibleColumn}  rows={cruxData}  /></ErrorBoundary> : <></>}
        </div>

      </div>

      {open && <ErrorBoundary><DescriptionModal visibleColumn={visibleColumn} handleClose={handleClose} open={open} data={viewData} /></ErrorBoundary>}
    </div>
  )
}

export default App
