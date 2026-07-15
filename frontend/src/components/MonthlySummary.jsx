import { useEffect, useState } from "react"
import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material"
import api from "../api"

export default function MonthlySummary() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [data, setData] = useState(null)
  const load = async () => setData((await api.get(`monthly-summary/?year=${year}&month=${month}`)).data)
  useEffect(() => { load() }, [])
  return <Paper sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>Monthly summary</Typography>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} component="form" onSubmit={(e) => { e.preventDefault(); load() }}>
      <TextField label="Year" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
      <TextField label="Month" type="number" slotProps={{ htmlInput: { min: 1, max: 12 } }} value={month} onChange={(e) => setMonth(e.target.value)} />
      <Button type="submit" variant="contained">Show</Button>
    </Stack>
    {data && <Grid container spacing={2} sx={{ mt: 1 }}>
      {[["Income", data.income], ["Expenses", data.expenses], ["Balance", data.balance]].map(([label, value]) =>
        <Grid key={label} size={{ xs: 12, sm: 4 }}><Paper variant="outlined" sx={{ p: 2 }}><Typography color="text.secondary">{label}</Typography><Typography variant="h5">${Number(value).toFixed(2)}</Typography></Paper></Grid>)}
    </Grid>}
  </Paper>
}
