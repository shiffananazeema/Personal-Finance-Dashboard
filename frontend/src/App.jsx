import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import api from "./api";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const authenticate = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setLoggedIn(true);
    setError("");
  };

  const logout = async () => {
    try {
      await api.post("logout/");
    } catch {}
    localStorage.clear();
    setLoggedIn(false);
  };

  if (!loggedIn)
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: 5,
          background:
            "linear-gradient(135deg, #eef2ff 0%, #f8faff 48%, #e9f8f2 100%)",
        }}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              overflow: "hidden",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" },
              boxShadow: "0 24px 70px rgba(35, 66, 170, 0.14)",
            }}
          >
            <Box
              sx={{
                bgcolor: "#2342aa",
                color: "white",
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{ opacity: 0.75, letterSpacing: 2 }}
                >
                  Personal Finance
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ mt: 1, fontWeight: 800, lineHeight: 1.1 }}
                >
                  Your money, clearly organised.
                </Typography>
                <Typography sx={{ mt: 2, opacity: 0.78, lineHeight: 1.7 }}>
                  Track daily spending, understand your balance, and make steady
                  progress toward savings goals.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: { xs: 3, sm: 5 } }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {registering ? (
                <Register onSuccess={authenticate} onError={setError} />
              ) : (
                <Login onSuccess={authenticate} onError={setError} />
              )}
              <Button
                fullWidth
                onClick={() => {
                  setRegistering(!registering);
                  setError("");
                }}
                sx={{ mt: 2 }}
              >
                {registering
                  ? "Already registered? Login"
                  : "Need an account? Register"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );

  return <Dashboard onLogout={logout} />;
}
