'use client';

import { use, useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import RequireAuth from '@/components/RequireAuth';
import AppHeader from '@/components/AppHeader';
import { api } from '@/lib/api';

interface Funcionario {
  id: string; nome: string; cargo: string | null; contato: string | null;
  foto_url: string | null; ativo: boolean;
}
interface Tarefa {
  id: string; funcionario_id: string | null; funcionario_nome?: string | null;
  tipo: 'tarefa' | 'checklist' | 'vistoria'; titulo: string; descricao: string | null;
  local: string | null; frequencia: 'unica' | 'diaria' | 'semanal' | 'mensal';
  checklist: string[]; qr_token: string; ativo: boolean;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <RequireAuth><Funcionarios condoId={id} /></RequireAuth>;
}

function Funcionarios({ condoId }: { condoId: string }) {
  const [aba, setAba] = useState<'funcionarios' | 'tarefas'>('tarefas');
  const [funcs, setFuncs] = useState<Funcionario[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [qrTarefa, setQrTarefa] = useState<Tarefa | null>(null);
  const [editFunc, setEditFunc] = useState<Partial<Funcionario> | null>(null);
  const [editTarefa, setEditTarefa] = useState<Partial<Tarefa> | null>(null);

  async function carregar() {
    try {
      const [f, t] = await Promise.all([
        api.get<Funcionario[]>(`/condominios/${condoId}/funcionarios`),
        api.get<Tarefa[]>(`/condominios/${condoId}/tarefas`),
      ]);
      setFuncs(f); setTarefas(t);
    } catch (e) { setErro((e as Error).message); }
  }
  useEffect(() => { carregar(); }, [condoId]);

  async function salvarFunc() {
    if (!editFunc?.nome?.trim()) return;
    try {
      if (editFunc.id) {
        await api.patch(`/condominios/${condoId}/funcionarios/${editFunc.id}`, editFunc);
      } else {
        await api.post(`/condominios/${condoId}/funcionarios`, editFunc);
      }
      setEditFunc(null); carregar();
    } catch (e) { setErro((e as Error).message); }
  }
  async function deleteFunc(id: string) {
    if (!confirm('Excluir funcionário?')) return;
    try { await api.delete(`/condominios/${condoId}/funcionarios/${id}`); carregar(); }
    catch (e) { setErro((e as Error).message); }
  }

  async function salvarTarefa() {
    if (!editTarefa?.titulo?.trim()) return;
    try {
      const body = { ...editTarefa, checklist: editTarefa.checklist || [] };
      if (editTarefa.id) {
        await api.patch(`/condominios/${condoId}/tarefas/${editTarefa.id}`, body);
      } else {
        await api.post(`/condominios/${condoId}/tarefas`, body);
      }
      setEditTarefa(null); carregar();
    } catch (e) { setErro((e as Error).message); }
  }
  async function deleteTarefa(id: string) {
    if (!confirm('Excluir tarefa?')) return;
    try { await api.delete(`/condominios/${condoId}/tarefas/${id}`); carregar(); }
    catch (e) { setErro((e as Error).message); }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader subtitle="Funcionários" />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Funcionários e tarefas</h1>
        <p className="text-sm text-slate-600 mb-6">Cadastre funcionários, crie tarefas com QR Code e acompanhe execuções.</p>

        <div className="flex gap-2 mb-4">
          {(['tarefas', 'funcionarios'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setAba(a)}
              className={`text-sm px-4 py-2 rounded-full border ${
                aba === a ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {a === 'tarefas' ? '✅ Tarefas / Vistorias' : '👷 Funcionários'}
            </button>
          ))}
        </div>

        {erro && <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-3 mb-4 text-sm">{erro}</div>}

        {aba === 'funcionarios' && (
          <div>
            <button
              onClick={() => setEditFunc({ nome: '', ativo: true })}
              className="mb-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg"
            >
              + Novo funcionário
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {funcs.map((f) => (
                <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{f.nome}</p>
                      {f.cargo && <p className="text-xs text-slate-500">{f.cargo}</p>}
                      {f.contato && <p className="text-xs text-slate-500 mt-1">{f.contato}</p>}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${f.ativo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {f.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setEditFunc(f)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700">Editar</button>
                    <button onClick={() => deleteFunc(f.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-600 ml-auto">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {aba === 'tarefas' && (
          <div>
            <button
              onClick={() => setEditTarefa({ tipo: 'vistoria', frequencia: 'diaria', titulo: '', checklist: [] })}
              className="mb-4 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg"
            >
              + Nova tarefa
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tarefas.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">
                      {t.tipo} · {t.frequencia}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.ativo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {t.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900">{t.titulo}</p>
                  {t.local && <p className="text-xs text-slate-500">📍 {t.local}</p>}
                  {t.funcionario_nome && <p className="text-xs text-slate-500">👤 {t.funcionario_nome}</p>}
                  {t.checklist.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">{t.checklist.length} itens no checklist</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button onClick={() => setQrTarefa(t)} className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white">QR Code</button>
                    <button onClick={() => setEditTarefa(t)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700">Editar</button>
                    <button onClick={() => deleteTarefa(t.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-600 ml-auto">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {qrTarefa && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setQrTarefa(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-900 mb-1">{qrTarefa.titulo}</h3>
            <p className="text-xs text-slate-500 mb-4">Aponte a câmera ou imprima e cole no local</p>
            <div className="inline-block bg-white p-3 rounded-lg border border-slate-200">
              <QRCodeCanvas value={`${origin}/v/${qrTarefa.qr_token}`} size={220} />
            </div>
            <p className="text-xs text-slate-500 mt-3 break-all">{origin}/v/{qrTarefa.qr_token}</p>
            <button onClick={() => setQrTarefa(null)} className="mt-4 text-sm px-4 py-2 rounded-lg border border-slate-300">Fechar</button>
          </div>
        </div>
      )}

      {editFunc && (
        <FormDrawer titulo={editFunc.id ? 'Editar funcionário' : 'Novo funcionário'} onClose={() => setEditFunc(null)} onSave={salvarFunc}>
          <Field label="Nome">
            <input value={editFunc.nome || ''} onChange={(e) => setEditFunc({ ...editFunc, nome: e.target.value })} className="form-input" />
          </Field>
          <Field label="Cargo"><input value={editFunc.cargo || ''} onChange={(e) => setEditFunc({ ...editFunc, cargo: e.target.value })} className="form-input" /></Field>
          <Field label="Contato"><input value={editFunc.contato || ''} onChange={(e) => setEditFunc({ ...editFunc, contato: e.target.value })} className="form-input" /></Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editFunc.ativo ?? true} onChange={(e) => setEditFunc({ ...editFunc, ativo: e.target.checked })} />
            Ativo
          </label>
        </FormDrawer>
      )}

      {editTarefa && (
        <FormDrawer titulo={editTarefa.id ? 'Editar tarefa' : 'Nova tarefa'} onClose={() => setEditTarefa(null)} onSave={salvarTarefa}>
          <Field label="Título"><input value={editTarefa.titulo || ''} onChange={(e) => setEditTarefa({ ...editTarefa, titulo: e.target.value })} className="form-input" /></Field>
          <Field label="Descrição"><textarea rows={2} value={editTarefa.descricao || ''} onChange={(e) => setEditTarefa({ ...editTarefa, descricao: e.target.value })} className="form-input" /></Field>
          <Field label="Local"><input value={editTarefa.local || ''} onChange={(e) => setEditTarefa({ ...editTarefa, local: e.target.value })} className="form-input" /></Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Tipo">
              <select value={editTarefa.tipo || 'tarefa'} onChange={(e) => setEditTarefa({ ...editTarefa, tipo: e.target.value as Tarefa['tipo'] })} className="form-input">
                <option value="tarefa">Tarefa</option>
                <option value="checklist">Checklist</option>
                <option value="vistoria">Vistoria</option>
              </select>
            </Field>
            <Field label="Frequência">
              <select value={editTarefa.frequencia || 'unica'} onChange={(e) => setEditTarefa({ ...editTarefa, frequencia: e.target.value as Tarefa['frequencia'] })} className="form-input">
                <option value="unica">Única</option>
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
              </select>
            </Field>
          </div>
          <Field label="Funcionário responsável (opcional)">
            <select value={editTarefa.funcionario_id || ''} onChange={(e) => setEditTarefa({ ...editTarefa, funcionario_id: e.target.value || undefined })} className="form-input">
              <option value="">— Qualquer —</option>
              {funcs.filter((f) => f.ativo).map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </Field>
          <Field label="Checklist (um item por linha)">
            <textarea
              rows={4}
              value={(editTarefa.checklist || []).join('\n')}
              onChange={(e) => setEditTarefa({ ...editTarefa, checklist: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean) })}
              className="form-input"
            />
          </Field>
        </FormDrawer>
      )}

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(203 213 225);
          padding: 0.5rem 0.75rem;
          color: rgb(15 23 42);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function FormDrawer({
  titulo, onClose, onSave, children,
}: {
  titulo: string; onClose: () => void; onSave: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl p-5 max-h-[90vh] overflow-y-auto space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-slate-900">{titulo}</h3>
          <button onClick={onClose} className="text-slate-400 text-xl">✕</button>
        </div>
        {children}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded-lg border border-slate-300">Cancelar</button>
          <button onClick={onSave} className="text-sm px-4 py-2 rounded-lg bg-slate-900 text-white">Salvar</button>
        </div>
      </div>
    </div>
  );
}
