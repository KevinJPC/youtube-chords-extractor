import './App.css'
import { Header } from './components/Header.jsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient.js'
import { Toaster } from './components/Toaster.jsx'
import { Routes } from './Routes.jsx'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Header />
      <Routes />
    </QueryClientProvider>
  )
}
export default App
