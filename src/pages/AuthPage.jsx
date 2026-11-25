import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthPage({ mode = 'login' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const signup = mode === 'signup'
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('')
    try {
      const result = signup
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (result.error) throw result.error
      if (signup && !result.data.session) setMessage('Cadastro realizado. Verifique seu e-mail para confirmar a conta antes de entrar.')
      else navigate(location.state?.from?.pathname || '/inventory', { replace: true })
    } catch (err) { setError(err.message || 'Não foi possível autenticar. Tente novamente.') }
    finally { setBusy(false) }
  }
  return <div className="auth-page"><div className="auth-decoration"><div className="deco-orbit orbit-one" /><div className="deco-orbit orbit-two" /><div className="auth-brand"><span className="brand-mark">H</span> Hardware<span className="brand-light">Stock</span></div><div className="auth-message"><span className="eyebrow">GESTÃO INTELIGENTE</span><h1>Seu hardware.<br/><span>Seu controle.</span></h1><p>Organize seu estoque de componentes em um só lugar.</p></div><div className="auth-footer">INVENTÁRIO DE EQUIPAMENTOS · MVP</div></div>
    <div className="auth-panel"><div className="auth-card"><div className="mobile-brand"><span className="brand-mark">H</span> HardwareStock</div><span className="eyebrow">ACESSO AO SISTEMA</span><h2>{signup ? 'Criar conta' : 'Bem-vindo de volta'}</h2><p className="auth-subtitle">{signup ? 'Cadastre seu e-mail para começar.' : 'Entre com suas credenciais para continuar.'}</p>
      {error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}
      <form onSubmit={submit} className="auth-form"><label className="field">E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@exemplo.com" autoComplete="email" required /></label><label className="field">Senha<input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="6" placeholder="Mínimo de 6 caracteres" autoComplete={signup ? 'new-password' : 'current-password'} required /></label><button className="btn primary auth-submit" disabled={busy}>{busy ? 'Aguarde...' : signup ? 'Criar minha conta' : 'Entrar no sistema'} <span>→</span></button></form>
      <p className="auth-switch">{signup ? 'Já possui uma conta?' : 'Ainda não possui uma conta?'} <Link to={signup ? '/login' : '/cadastro'}>{signup ? 'Fazer login' : 'Cadastre-se'}</Link></p><p className="auth-note">Acesso protegido por autenticação Supabase.</p></div></div></div>
}
