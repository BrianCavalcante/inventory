import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './components/Layout.jsx'
import AuthPage from './pages/AuthPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import { CreateEquipment, EditEquipment, EquipmentDetails } from './pages/EquipmentPages.jsx'
import { configError } from './lib/supabase.js'

export default function App() {
  if (configError) return <div className="config-screen"><div className="config-box"><span className="brand-mark">H</span><h1>Configuração necessária</h1><p>{configError}</p><p>Copie o arquivo <code>.env.example</code> para <code>.env</code>, preencha os dados do projeto Supabase e reinicie o servidor.</p></div></div>
  return <Routes><Route path="/login" element={<AuthPage />} /><Route path="/cadastro" element={<AuthPage mode="signup" />} /><Route element={<ProtectedRoute />}><Route element={<Layout />}><Route path="/inventory" element={<InventoryPage />} /><Route path="/inventory/novo" element={<CreateEquipment />} /><Route path="/inventory/:id" element={<EquipmentDetails />} /><Route path="/inventory/:id/editar" element={<EditEquipment />} /></Route></Route><Route path="/" element={<Navigate to="/inventory" replace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}
