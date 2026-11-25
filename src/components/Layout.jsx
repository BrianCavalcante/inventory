import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) window.alert(`Não foi possível sair: ${error.message}`)
    else navigate('/login', { replace: true })
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">H</span><span>Hardware<span className="brand-light">Stock</span></span></div>
      <p className="nav-caption">MENU PRINCIPAL</p>
      <NavLink to="/inventory" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><span>▦</span> Inventário</NavLink>
      <div className="sidebar-bottom"><div className="user-chip"><div className="avatar">{user?.email?.[0]?.toUpperCase() || 'U'}</div><div className="user-info"><strong>Conta conectada</strong><span title={user?.email}>{user?.email}</span></div></div><button className="logout-btn" onClick={logout}>↪ Encerrar sessão</button></div>
    </aside>
    <main className="main-area"><header className="topbar"><span>PAINEL DE CONTROLE</span><span className="status"><i /> Sistema conectado</span></header><Outlet /></main>
  </div>
}
