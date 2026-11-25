import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import EquipmentForm from '../components/EquipmentForm'
const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export function CreateEquipment() {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const navigate = useNavigate()
  async function save(values) {
    setBusy(true); setError('')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) { setError('Sua sessão expirou. Entre novamente.'); setBusy(false); return }
    const { error: insertError } = await supabase.from('equipment').insert({ ...values, user_id: user.id })
    setBusy(false)
    if (insertError) setError(`Erro ao cadastrar: ${insertError.message}`)
    else navigate('/inventory', { replace: true })
  }
  return <FormPage title="Novo equipamento" subtitle="Adicione uma peça ao seu inventário" error={error}><EquipmentForm onSubmit={save} submitting={busy} onCancel={() => navigate('/inventory')} /></FormPage>
}
export function EditEquipment() {
  const { id } = useParams(); const [item, setItem] = useState(null); const [busy, setBusy] = useState(false); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const navigate = useNavigate()
  useEffect(() => { let active = true; supabase.from('equipment').select('*').eq('id', id).single().then(({ data, error: e }) => { if (!active) return; if (e) setError(`Não foi possível carregar o equipamento: ${e.message}`); else setItem(data); setLoading(false) }); return () => { active = false } }, [id])
  async function save(values) { setBusy(true); setError(''); const { error: e } = await supabase.from('equipment').update(values).eq('id', id); setBusy(false); if (e) setError(`Erro ao atualizar: ${e.message}`); else navigate(`/inventory/${id}`, { replace: true }) }
  return <FormPage title="Editar equipamento" subtitle="Atualize os dados da peça" error={error}>{loading ? <p>Carregando...</p> : item && <EquipmentForm initial={item} onSubmit={save} submitting={busy} onCancel={() => navigate(`/inventory/${id}`)} submitLabel="Salvar alterações" />}</FormPage>
}
export function EquipmentDetails() {
  const { id } = useParams(); const [item, setItem] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState('')
  useEffect(() => { let active = true; supabase.from('equipment').select('*').eq('id', id).single().then(({ data, error: e }) => { if (!active) return; if (e) setError(`Não foi possível abrir o equipamento: ${e.message}`); else setItem(data); setLoading(false) }); return () => { active = false } }, [id])
  return <section className="content-page narrow-page"><Link to="/inventory" className="back-link">← Voltar ao inventário</Link><div className="page-heading"><div><span className="eyebrow">DETALHES DO ITEM</span><h1>Equipamento</h1></div>{item && <Link to={`/inventory/${id}/editar`} className="btn primary">✎ Editar</Link>}</div>{error && <div className="alert error">{error}</div>}{loading ? <p>Carregando...</p> : item && <div className="detail-card"><div className="detail-title"><span className="item-symbol large">▧</span><div><h2>{item.name}</h2><span className="category-pill">{item.category}</span></div></div><div className="detail-grid">{[['Fabricante', item.manufacturer],['Modelo', item.model],['Quantidade', `${item.quantity} unidades`],['Preço unitário', money(item.price)],['Valor em estoque', money(Number(item.quantity) * Number(item.price))],['Cadastrado em', new Date(item.created_at).toLocaleDateString('pt-BR')]].map(([label, value]) => <div className="detail-field" key={label}><span>{label}</span><strong>{value || '—'}</strong></div>)}</div><div className="notes-block"><span>Observações</span><p>{item.notes || 'Nenhuma observação cadastrada.'}</p></div></div>}</section>
}
function FormPage({ title, subtitle, error, children }) { return <section className="content-page narrow-page"><Link to="/inventory" className="back-link">← Voltar ao inventário</Link><div className="page-heading"><div><span className="eyebrow">GESTÃO DE ESTOQUE</span><h1>{title}</h1><p>{subtitle}</p></div></div><div className="form-card">{error && <div className="alert error">{error}</div>}{children}</div></section> }
