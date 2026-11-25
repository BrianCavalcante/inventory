import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const load = useCallback(async () => {
    setLoading(true); setError('')
    const { data, error: queryError } = await supabase.from('equipment').select('*').order('created_at', { ascending: false })
    if (queryError) setError(`Não foi possível carregar o inventário: ${queryError.message}`)
    else setItems(data || [])
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])
  async function remove(item) {
    if (!window.confirm(`Excluir "${item.name}" do inventário?`)) return
    const { error: deleteError } = await supabase.from('equipment').delete().eq('id', item.id)
    if (deleteError) setError(`Não foi possível excluir: ${deleteError.message}`)
    else setItems(prev => prev.filter(x => x.id !== item.id))
  }
  const totalUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const totalValue = items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0)
  return <section className="content-page"><div className="page-heading"><div><span className="eyebrow">VISÃO GERAL</span><h1>Inventário</h1><p>Gerencie seus componentes e acompanhe o estoque.</p></div><Link to="/inventory/novo" className="btn primary">＋ Novo equipamento</Link></div>
    <div className="stats-grid"><div className="stat-card"><span className="stat-icon blue">▦</span><div><span className="stat-label">Tipos cadastrados</span><strong>{items.length}</strong></div></div><div className="stat-card"><span className="stat-icon purple">⌁</span><div><span className="stat-label">Unidades em estoque</span><strong>{totalUnits}</strong></div></div><div className="stat-card"><span className="stat-icon green">R$</span><div><span className="stat-label">Valor estimado</span><strong>{money(totalValue)}</strong></div></div></div>
    {error && <div className="alert error">{error} <button onClick={load}>Tentar novamente</button></div>}
    <div className="table-card"><div className="table-heading"><div><h2>Peças cadastradas</h2><p>Lista de componentes do seu inventário</p></div><span className="count-pill">{items.length} registros</span></div>
      {loading ? <div className="empty-state"><span className="loader"/>Carregando equipamentos...</div> : items.length === 0 ? <div className="empty-state"><div className="empty-icon">▦</div><h3>Seu inventário está vazio</h3><p>Adicione seu primeiro componente para começar.</p><Link className="btn primary" to="/inventory/novo">Cadastrar equipamento</Link></div> :
      <div className="table-scroll"><table><thead><tr><th>Equipamento</th><th>Categoria</th><th>Fabricante / modelo</th><th>Estoque</th><th>Preço</th><th className="actions-head">Ações</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td><div className="item-name"><span className="item-symbol">▧</span><div><strong>{item.name}</strong><small>Adicionado ao inventário</small></div></div></td><td><span className="category-pill">{item.category}</span></td><td>{[item.manufacturer, item.model].filter(Boolean).join(' · ') || '—'}</td><td><span className={`stock ${item.quantity === 0 ? 'out' : ''}`}>{item.quantity} un.</span></td><td className="price-cell">{money(item.price)}</td><td><div className="row-actions"><button title="Visualizar" onClick={() => navigate(`/inventory/${item.id}`)}>◉</button><button title="Editar" onClick={() => navigate(`/inventory/${item.id}/editar`)}>✎</button><button title="Excluir" className="delete-action" onClick={() => remove(item)}>×</button></div></td></tr>)}</tbody></table></div>}
    </div><p className="page-footnote">Os dados exibidos pertencem à conta autenticada.</p></section>
}
