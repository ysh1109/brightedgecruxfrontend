
import { useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import {
  FormControl,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import type { MetricKey } from "../types/crux";


type Props = {
  handleColumn: (cols: MetricKey[]) => void;
}

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 6;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 240,
    },
  },
};

const options = [
  { label: "FCP", value: "fcp" },
  { label: "LCP", value: "lcp" },
  { label: "CLS", value: "cls" },
  { label: "INP", value: "inp" }
];


 const FilterOptions = ({handleColumn} : Props) => {

  const [selected, setSelected] = useState<string[]>(['fcp','lcp','cls','inp']);

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const value : any = event.target.value as string[];
    setSelected(value);
    handleColumn(value)
  };

  return (
    <FormControl sx={{ width: 300, background:"white" }}>
      <Select
        multiple
        displayEmpty
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) =>
          selected.length === 0 ? "Select columns" : selected.join(", ")
        }
        MenuProps={MenuProps}
        sx={{height: 40}}
      >
        {options.map((opt) => (
          <MenuItem sx={{height : 40}} key={opt.value} value={opt.value}>
            <Checkbox checked={selected.includes(opt.value)} />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FilterOptions