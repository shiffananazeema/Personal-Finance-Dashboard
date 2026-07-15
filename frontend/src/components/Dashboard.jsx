import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import api from "../api";
import MonthlySummary from "./MonthlySummary";
import SavingsGoalForm from "./SavingsGoalForm";
import SavingsGoalList from "./SavingsGoalList";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const categoryColors = {
  food: "#ff6b6b",
  rent: "#5b6ee1",
  transport: "#42a5f5",
  shopping: "#ab63d4",
  salary: "#31b77a",
  bills: "#f5a544",
  health: "#20b7a6",
  other: "#8793a8",
};
const navigation = [
  "Overview",
  "Transactions",
  "Savings goals",
  "Monthly summary",
];

export default function Dashboard({ onLogout }) {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [tab, setTab] = useState(0);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [dashboard, transactionData, goalData] = await Promise.all([
        api.get("dashboard/"),
        api.get("transactions/"),
        api.get("savings-goals/"),
      ]);
      setSummary(dashboard.data);
      setTransactions(transactionData.data);
      setGoals(goalData.data);
      setError("");
    } catch {
      setError("Could not load your finance data.");
    }
  };
  useEffect(() => {
    load();
  }, []);

  const saved = () => {
    setEditingTransaction(null);
    setEditingGoal(null);
    load();
  };
  const remove = async (path) => {
    await api.delete(path);
    load();
  };
  const cards = summary
    ? [
        {
          label: "Current balance",
          value: summary.balance,
          color: "#3157d5",
          background: "#eef2ff",
        },
        {
          label: "Total income",
          value: summary.total_income,
          color: "#16a36a",
          background: "#eaf8f2",
        },
        {
          label: "Total expenses",
          value: summary.total_expenses,
          color: "#e05260",
          background: "#fff0f1",
        },
        {
          label: "Monthly income",
          value: summary.monthly_income,
          color: "#16a36a",
          background: "#eaf8f2",
        },
        {
          label: "Monthly expenses",
          value: summary.monthly_expenses,
          color: "#e05260",
          background: "#fff0f1",
        },
        {
          label: "Monthly savings",
          value: summary.monthly_savings,
          color: "#3157d5",
          background: "#eef2ff",
        },
      ]
    : [];
  const expenseTotals = transactions
    .filter((item) => item.transaction_type === "expense")
    .reduce(
      (totals, item) => ({
        ...totals,
        [item.category]: (totals[item.category] || 0) + Number(item.amount),
      }),
      {},
    );
  const expenseData = Object.entries(expenseTotals).sort((a, b) => b[1] - a[1]);
  const expenseTotal = expenseData.reduce(
    (total, [, amount]) => total + amount,
    0,
  );
  let usedPercentage = 0;
  const pieSegments = expenseData.map(([category, amount]) => {
    const start = usedPercentage;
    usedPercentage += (amount / expenseTotal) * 100;
    return `${categoryColors[category]} ${start}% ${usedPercentage}%`;
  });
  const pieBackground = expenseTotal
    ? `conic-gradient(${pieSegments.join(", ")})`
    : "#e9edf4";
  const username = localStorage.getItem("username") || "User";
  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      <Paper
        component="aside"
        square
        elevation={0}
        sx={{
          width: 248,
          flexShrink: 0,
          borderRight: "1px solid #e8ecf3",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          p: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ px: 1, py: 1.5, mb: 3 }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              bgcolor: "primary.main",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            PF
          </Box>
          <Box>
            <Typography fontWeight={800}>Personal Finance</Typography>
            <Typography variant="caption" color="text.secondary">
              Money dashboard
            </Typography>
          </Box>
        </Stack>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ px: 1.5, mb: 1, letterSpacing: 1.3 }}
        >
          Workspace
        </Typography>
        <Stack spacing={0.75}>
          {navigation.map((label, index) => (
            <Button
              key={label}
              fullWidth
              onClick={() => setTab(index)}
              sx={{
                justifyContent: "flex-start",
                px: 1.5,
                py: 1.15,
                color: tab === index ? "primary.main" : "text.secondary",
                bgcolor: tab === index ? "#eef2ff" : "transparent",
                "&:hover": { bgcolor: tab === index ? "#e5ebff" : "#f5f7fb" },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
      </Paper>

      <Box component="main" sx={{ minWidth: 0, flexGrow: 1 }}>
        <Box
          sx={{
            px: { xs: 2, sm: 3, lg: 5 },
            py: 2.5,
            bgcolor: "white",
            borderBottom: "1px solid #e8ecf3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5">{navigation[tab]}</Typography>
            <Typography variant="body2" color="text.secondary">
              {today}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "#e8edff",
                color: "primary.main",
                fontWeight: 800,
              }}
            >
              {username[0].toUpperCase()}
            </Avatar>
            <Typography
              fontWeight={700}
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {username}
            </Typography>
            <Button variant="outlined" size="small" onClick={onLogout}>
              Logout
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: "white",
            borderBottom: "1px solid #e8ecf3",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons={false}
          >
            {navigation.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3, lg: 5 }, maxWidth: 1440, mx: "auto" }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {tab === 0 && (
            <>
              <Grid container spacing={2.5}>
                {cards.map((card) => (
                  <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Paper
                      sx={{
                        p: 2.5,
                        border: "1px solid #e8ecf3",
                        boxShadow: "0 8px 24px rgba(31, 45, 75, 0.04)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography color="text.secondary" fontWeight={600}>
                          {card.label}
                        </Typography>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: card.color,
                          }}
                        />
                      </Stack>
                      <Typography
                        variant="h4"
                        sx={{ mt: 2, color: card.color }}
                      >
                        {money(card.value)}
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          height: 5,
                          borderRadius: 4,
                          bgcolor: card.background,
                        }}
                      >
                        <Box
                          sx={{
                            width: "42%",
                            height: "100%",
                            borderRadius: 4,
                            bgcolor: card.color,
                          }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={2.5} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      border: "1px solid #e8ecf3",
                      boxShadow: "0 8px 24px rgba(31, 45, 75, 0.04)",
                    }}
                  >
                    <Typography variant="h6">Spending breakdown</Typography>
                    <Typography variant="body2" color="text.secondary">
                      All expenses by category
                    </Typography>
                    <Grid
                      container
                      spacing={2.5}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Grid
                        size={{ xs: 12, sm: 5 }}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          role="img"
                          aria-label="Donut chart showing expenses by category"
                          sx={{
                            width: 174,
                            height: 174,
                            borderRadius: "50%",
                            background: pieBackground,
                            position: "relative",
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              inset: 34,
                              borderRadius: "50%",
                              bgcolor: "white",
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 7 }}>
                        {expenseData.slice(0, 6).map(([category, amount]) => (
                          <Box
                            key={category}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1.1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                bgcolor: categoryColors[category],
                                mr: 1,
                                borderRadius: "50%",
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ flexGrow: 1, textTransform: "capitalize" }}
                            >
                              {category}
                            </Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {((amount / expenseTotal) * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        ))}
                        {!expenseData.length && (
                          <Typography variant="body2" color="text.secondary">
                            Add an expense to display the chart.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 7 }}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      border: "1px solid #e8ecf3",
                      boxShadow: "0 8px 24px rgba(31, 45, 75, 0.04)",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="h6">
                          Recent transactions
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your latest activity
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => setTab(1)}>
                        View all
                      </Button>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Stack spacing={1.5}>
                      {transactions.slice(0, 5).map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: 2.5,
                              bgcolor:
                                item.transaction_type === "income"
                                  ? "#eaf8f2"
                                  : "#fff0f1",
                              color:
                                item.transaction_type === "income"
                                  ? "success.main"
                                  : "error.main",
                              display: "grid",
                              placeItems: "center",
                              fontWeight: 800,
                            }}
                          >
                            {item.transaction_type === "income" ? "+" : "-"}
                          </Box>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>
                              {item.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {item.category} - {item.date}
                            </Typography>
                          </Box>
                          <Typography
                            fontWeight={800}
                            color={
                              item.transaction_type === "income"
                                ? "success.main"
                                : "text.primary"
                            }
                          >
                            {item.transaction_type === "income" ? "+" : "-"}
                            {money(item.amount)}
                          </Typography>
                        </Box>
                      ))}
                      {!transactions.length && (
                        <Typography variant="body2" color="text.secondary">
                          No transactions yet.
                        </Typography>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <TransactionForm item={editingTransaction} onSaved={saved} />
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <TransactionList
                  items={transactions}
                  onEdit={setEditingTransaction}
                  onDelete={(id) => remove(`transactions/${id}/`)}
                />
              </Grid>
            </Grid>
          )}
          {tab === 2 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 4 }}>
                <SavingsGoalForm item={editingGoal} onSaved={saved} />
              </Grid>
              <Grid size={{ xs: 12, lg: 8 }}>
                <SavingsGoalList
                  items={goals}
                  onEdit={setEditingGoal}
                  onDelete={(id) => remove(`savings-goals/${id}/`)}
                />
              </Grid>
            </Grid>
          )}
          {tab === 3 && <MonthlySummary />}
        </Box>
      </Box>
    </Box>
  );
}
