import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

export default function TransactionList({ items, onEdit, onDelete }) {
  return <TableContainer component={Paper}>
    <Typography variant="h6" sx={{ p: 2 }}>Transactions</Typography>
    <Table size="small"><TableHead><TableRow>
      <TableCell>Date</TableCell><TableCell>Title</TableCell><TableCell>Category</TableCell><TableCell>Type</TableCell><TableCell align="right">Amount</TableCell><TableCell />
    </TableRow></TableHead><TableBody>
      {items.map((item) => <TableRow key={item.id}>
        <TableCell>{item.date}</TableCell><TableCell>{item.title}</TableCell><TableCell>{item.category}</TableCell><TableCell>{item.transaction_type}</TableCell>
        <TableCell align="right">${Number(item.amount).toFixed(2)}</TableCell>
        <TableCell><Button size="small" onClick={() => onEdit(item)}>Edit</Button><Button size="small" color="error" onClick={() => onDelete(item.id)}>Delete</Button></TableCell>
      </TableRow>)}
      {!items.length && <TableRow><TableCell colSpan={6}>No transactions yet.</TableCell></TableRow>}
    </TableBody></Table>
  </TableContainer>
}

