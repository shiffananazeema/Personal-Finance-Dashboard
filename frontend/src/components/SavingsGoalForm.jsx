import { useEffect, useState } from "react"
import { Button, Paper, Stack, TextField, Typography } from "@mui/material"
import api from "../api"

const empty = { name: "", target_amount: "", current_amount: "0", deadline: "" }

export default function SavingsGoalForm({ item, onSaved }) {
  const [form, setForm] = useState(empty)
  useEffect(() => { setForm(item || empty) }, [item])
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault()
    if (item) await api.put(`savings-goals/${item.id}/`, form)
    else await api.post("savings-goals/", form)
    setForm(empty)
    onSaved()
  }
  return <Paper component="form" onSubmit={submit} sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>{item ? "Edit" : "Add"} savings goal</Typography>
    <Stack spacing={2}>
      <TextField name="name" label="Goal name" required value={form.name} onChange={change} />
      <TextField name="target_amount" label="Target amount" type="number" required slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }} value={form.target_amount} onChange={change} />
      <TextField name="current_amount" label="Current saved" type="number" required slotProps={{ htmlInput: { min: 0, step: 0.01 } }} value={form.current_amount} onChange={change} />
      <TextField name="deadline" label="Deadline" type="date" required value={form.deadline} onChange={change} slotProps={{ inputLabel: { shrink: true } }} />
      <Button type="submit" variant="contained">Save</Button>
    </Stack>
  </Paper>
}

