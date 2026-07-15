import { useState } from "react"
import { Button, Paper, Stack, TextField, Typography } from "@mui/material"
import api from "../api"

export default function Login({ onSuccess, onError }) {
  const [form, setForm] = useState({ username: "", password: "" })
  const submit = async (event) => {
    event.preventDefault()
    try { onSuccess((await api.post("login/", form)).data) }
    catch (error) { onError(error.response?.data?.detail || "Login failed.") }
  }
  return <Paper component="form" elevation={0} onSubmit={submit} sx={{ p: 0 }}>
    <Typography variant="h5">Welcome back</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Sign in to view your finance dashboard.</Typography>
    <Stack spacing={2}>
      <TextField label="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <TextField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button type="submit" variant="contained" fullWidth sx={{ py: 1.15 }}>Login</Button>
    </Stack>
  </Paper>
}
