import { useState } from "react"
import { Button, Paper, Stack, TextField, Typography } from "@mui/material"
import api from "../api"

export default function Register({ onSuccess, onError }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const submit = async (event) => {
    event.preventDefault()
    try { onSuccess((await api.post("register/", form)).data) }
    catch (error) {
      const data = error.response?.data
      onError(data ? Object.values(data).flat().join(" ") : "Registration failed.")
    }
  }
  return <Paper component="form" elevation={0} onSubmit={submit} sx={{ p: 0 }}>
    <Typography variant="h5">Create your account</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>Start tracking your money in one place.</Typography>
    <Stack spacing={2}>
      <TextField label="Username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <TextField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button type="submit" variant="contained" fullWidth sx={{ py: 1.15 }}>Create account</Button>
    </Stack>
  </Paper>
}
