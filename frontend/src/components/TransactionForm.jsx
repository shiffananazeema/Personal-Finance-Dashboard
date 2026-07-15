import { useEffect, useState } from "react"
import { Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"
import api from "../api"

const empty = { title: "", amount: "", transaction_type: "expense", category: "food", date: new Date().toISOString().slice(0, 10), notes: "" }
const categories = ["food", "rent", "transport", "shopping", "salary", "bills", "health", "other"]

export default function TransactionForm({ item, onSaved }) {
  const [form, setForm] = useState(empty)
  useEffect(() => { setForm(item || empty) }, [item])
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    if (item) await api.put(`transactions/${item.id}/`, form)
    else await api.post("transactions/", form)
    setForm(empty)
    onSaved()
  }
  return <Paper component="form" onSubmit={submit} sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>{item ? "Edit" : "Add"} transaction</Typography>
    <Stack spacing={2}>
      <TextField name="title" label="Title" required value={form.title} onChange={change} />
      <TextField name="amount" label="Amount" type="number" required slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }} value={form.amount} onChange={change} />
      <TextField name="transaction_type" select label="Type" value={form.transaction_type} onChange={change}>
        <MenuItem value="income">Income</MenuItem><MenuItem value="expense">Expense</MenuItem>
      </TextField>
      <TextField name="category" select label="Category" value={form.category} onChange={change}>
        {categories.map((category) => <MenuItem key={category} value={category}>{category[0].toUpperCase() + category.slice(1)}</MenuItem>)}
      </TextField>
      <TextField name="date" label="Date" type="date" value={form.date} onChange={change} slotProps={{ inputLabel: { shrink: true } }} />
      <TextField name="notes" label="Notes" multiline value={form.notes} onChange={change} />
      <Button type="submit" variant="contained">Save</Button>
    </Stack>
  </Paper>
}

