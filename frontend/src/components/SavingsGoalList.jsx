import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material"

export default function SavingsGoalList({ items, onEdit, onDelete }) {
  return <Paper sx={{ p: 3 }}><Typography variant="h6" gutterBottom>Savings goals</Typography><Stack spacing={3}>
    {items.map((item) => <Box key={item.id}>
      <Typography>{item.name} - ${Number(item.current_amount).toFixed(2)} of ${Number(item.target_amount).toFixed(2)}</Typography>
      <LinearProgress variant="determinate" value={item.progress} sx={{ my: 1, height: 10, borderRadius: 1 }} />
      <Typography variant="body2">{item.progress}% - due {item.deadline}</Typography>
      <Button size="small" onClick={() => onEdit(item)}>Edit</Button><Button size="small" color="error" onClick={() => onDelete(item.id)}>Delete</Button>
    </Box>)}
    {!items.length && <Typography>No savings goals yet.</Typography>}
  </Stack></Paper>
}

