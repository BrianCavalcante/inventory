import { useState } from 'react'

const empty = { name: '', category: '', manufacturer: '', model: '', quantity: '0', price: '0', notes: '' }
export default function EquipmentForm({ initial = empty, onSubmit, submitting, onCancel, submitLabel = 'Salvar equipamento' }) {
  const [form, setForm] = useState({ ...empty, ...initial, quantity: String(initial.quantity ?? 0), price: String(initial.price ?? 0) })
  const [validation, setValidation] = useState('')
  function change(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); setValidation('') }
  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.category.trim()) { setValidation('Preencha o nome e a categoria.'); return }
    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0) { setValidation('A quantidade deve ser um número inteiro igual ou maior que zero.'); return }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) { setValidation('Informe um preço válido, igual ou maior que zero.'); return }
    await onSubmit({ name: form.name.trim(), category: form.category.trim(), manufacturer: form.manufacturer.trim(), model: form.model.trim(), quantity: Number(form.quantity), price: Number(form.price), notes: form.notes.trim() || null })
  }
  return <form className="equipment-form" onSubmit={submit}>
    {validation && <div className="alert error">{validation}</div>}
    <div className="form-grid">
      <label className="field full">Nome da peça *<input name="name" value={form.name} onChange={change} maxLength="120" placeholder="Ex.: Memória RAM 16 GB" required /></label>
      <label className="field">Categoria *<select name="category" value={form.category} onChange={change} required><option value="">Selecione</option>{['Processador','Placa de vídeo','Memória RAM','Armazenamento','Placa-mãe','Fonte','Gabinete','Periférico','Outro'].map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="field">Fabricante<input name="manufacturer" value={form.manufacturer} onChange={change} maxLength="100" placeholder="Ex.: Kingston" /></label>
      <label className="field">Modelo<input name="model" value={form.model} onChange={change} maxLength="120" placeholder="Ex.: Fury Beast" /></label>
      <label className="field">Quantidade em estoque *<input type="number" min="0" step="1" name="quantity" value={form.quantity} onChange={change} required /></label>
      <label className="field">Preço unitário (R$) *<input type="number" min="0" step="0.01" name="price" value={form.price} onChange={change} required /></label>
      <label className="field full">Observações<textarea name="notes" value={form.notes} onChange={change} rows="4" maxLength="2000" placeholder="Informações adicionais (opcional)" /></label>
    </div>
    <div className="form-actions"><button type="button" className="btn secondary" onClick={onCancel}>Cancelar</button><button className="btn primary" disabled={submitting}>{submitting ? 'Salvando...' : submitLabel}</button></div>
  </form>
}
