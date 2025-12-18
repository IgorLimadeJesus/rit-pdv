import AppRoutes from "./routes/AppRoutes"
import { PeriodProvider } from "./context/PeriodContext"
import { InventoryProvider } from "./context/InventoryContext"

export default function App() {
  return (
    <InventoryProvider>
      <PeriodProvider>
        <AppRoutes />
      </PeriodProvider>
    </InventoryProvider>
  )
}