import AppRoutes from "./routes/AppRoutes"
import { PeriodProvider } from "./context/PeriodContext"
import { InventoryProvider } from "./context/InventoryContext"
import { ThemeProvider } from "./context/ThemeContext"

export default function App() {
  return (
    <ThemeProvider>
      <InventoryProvider>
        <PeriodProvider>
          <AppRoutes />
        </PeriodProvider>
      </InventoryProvider>
    </ThemeProvider>
  )
}