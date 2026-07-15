import React from "react"
import ReactDOM from "react-dom/client"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import App from "./App"

const theme = createTheme({
  palette: {
    primary: { main: "#3157d5", dark: "#2342aa" },
    success: { main: "#16a36a" },
    error: { main: "#e05260" },
    background: { default: "#f5f7fb", paper: "#ffffff" },
    text: { primary: "#172033", secondary: "#6f7890" }
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    h4: { fontWeight: 750 },
    h5: { fontWeight: 750 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: "none" }
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiTableCell: { styleOverrides: { root: { borderColor: "#edf0f6" }, head: { color: "#6f7890", fontWeight: 700 } } }
  }
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><ThemeProvider theme={theme}><CssBaseline /><App /></ThemeProvider></React.StrictMode>
)
