'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QA { q: string; a: string }

const SECOES: { titulo: string; itens: QA[] }[] = [
  {
    titulo: '📖 Revista do meu condomínio',
    itens: [
      { q: 'Como acesso a revista do meu condomínio?',
        a: 'Procure pelo QR Code no elevador, hall ou portaria. Ao escanear, você cai direto na revista digital. Você também pode pedir o link ao síndico.' },
      { q: 'Preciso de login para ver a revista?',
        a: 'Não. A revista e os canais públicos (chamados, classificados, caronas, avaliação) são abertos a qualquer pessoa com o link.' },
      { q: 'A revista funciona sem internet?',
        a: 'Parcialmente. Páginas já visitadas ficam em cache e abrem offline. Para ver atualizações novas, é preciso estar online.' },
    ],
  },
  {
    titulo: '🔧 Abrir um chamado',
    itens: [
      { q: 'Como abro um chamado?',
        a: 'Escaneie o QR Code "Abrir chamado" do condomínio ou peça o link ao síndico. Preencha o assunto, descrição e (opcional) seu nome/unidade.' },
      { q: 'O que é o "código" que aparece depois?',
        a: 'É o código único do seu chamado (ex.: A7K3M9Q2). Anote — com ele você acompanha o andamento sem precisar de login.' },
      { q: 'Onde acompanho meu chamado?',
        a: 'Acesse apprevista.com.br/c/chamados/SEU-CODIGO. A página mostra status, resposta do síndico e data de resolução.' },
      { q: 'Posso abrir chamado anônimo?',
        a: 'Sim. Os campos de nome, unidade e contato são opcionais. Mas se o síndico precisar de detalhes, sem contato não há como ele te responder.' },
      { q: 'Quanto tempo para ser respondido?',
        a: 'Depende da gestão. O síndico recebe email automático a cada novo chamado e a prioridade que você marca (baixa/média/alta/urgente) ajuda na priorização.' },
    ],
  },
  {
    titulo: '🏷️ Classificados',
    itens: [
      { q: 'Como anuncio algo?',
        a: 'Acesse a página de classificados do seu condomínio (link no QR Code) e clique em "+ Anunciar". Escolha o tipo (venda, aluguel, doação, serviço, outro), preencha título, descrição, preço (opcional) e seu contato.' },
      { q: 'Meu anúncio sumiu, por quê?',
        a: 'Todo anúncio passa por moderação do síndico antes de aparecer publicamente. Se foi recusado, normalmente é por conteúdo inadequado ou suspeita de spam.' },
      { q: 'Quanto tempo o anúncio fica no ar?',
        a: 'Por padrão, 30 dias. Após esse prazo, ele expira automaticamente. Você pode anunciar novamente quando quiser.' },
      { q: 'Posso editar ou tirar do ar?',
        a: 'Por enquanto, peça diretamente ao síndico do seu condomínio.' },
    ],
  },
  {
    titulo: '🚗 Caronas',
    itens: [
      { q: 'Como ofereço uma carona?',
        a: 'Na página de caronas do seu condomínio, clique em "+ Oferecer / procurar", escolha "Estou oferecendo", preencha origem, destino, data, horário, vagas e seu contato.' },
      { q: 'Como procuro carona?',
        a: 'Mesma página, mas escolha "Estou procurando". Você publica seu pedido e quem oferecer carona compatível pode te contatar diretamente.' },
      { q: 'O App Revista cobra alguma taxa?',
        a: 'Não. A divisão de combustível (se houver) é combinada diretamente entre você e o motorista pelo WhatsApp.' },
    ],
  },
  {
    titulo: '⭐ Avaliações',
    itens: [
      { q: 'Como avalio a gestão?',
        a: 'Procure pelo QR Code "Avaliar gestão" no condomínio. Escolha nota de 1 a 5 estrelas, o contexto (gestão geral, chamado, evento, funcionário) e um comentário opcional.' },
      { q: 'Posso ser anônimo?',
        a: 'Sim. Nome e unidade são opcionais. O síndico vê seu IP de origem (anti-spam) mas isso não fica público no mural.' },
      { q: 'Por que minha avaliação não apareceu no mural?',
        a: 'Avaliações passam por moderação antes de virarem públicas. Ainda assim, todas entram nas estatísticas (NPS) que o síndico vê.' },
    ],
  },
  {
    titulo: '👷 Vistorias e QR Codes',
    itens: [
      { q: 'O que faço quando escaneio um QR Code de vistoria?',
        a: 'O QR Code te leva direto para a tarefa (ex.: "Limpeza do hall - 3º andar"). Marque os itens do checklist, deixe observações se quiser e clique em "Confirmar execução".' },
      { q: 'Preciso de login para registrar a execução?',
        a: 'Não. O QR Code é o próprio passe de acesso. Só o nome de quem executou é registrado (opcional).' },
    ],
  },
  {
    titulo: '🔒 Privacidade',
    itens: [
      { q: 'O que vocês fazem com meus dados?',
        a: 'Apenas o necessário para operar o serviço. Detalhes na nossa Política de Privacidade (link no rodapé).' },
      { q: 'Quero apagar meus dados, como faço?',
        a: 'Envie email para contato@apprevista.com.br com o assunto "Solicitação LGPD - Exclusão".' },
    ],
  },
];

export default function AjudaPage() {
  const [busca, setBusca] = useState('');
  const [aberto, setAberto] = useState<string | null>(null);

  const termo = busca.toLowerCase().trim();
  const secoes = !termo ? SECOES : SECOES
    .map((s) => ({
      ...s,
      itens: s.itens.filter((i) => i.q.toLowerCase().includes(termo) || i.a.toLowerCase().includes(termo)),
    }))
    .filter((s) => s.itens.length > 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Voltar</Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-2">Central de Ajuda</h1>
        <p className="text-slate-600 mb-6">Dúvidas frequentes de moradores.</p>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar (ex: como abro chamado)…"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 mb-8"
        />

        {secoes.length === 0 && (
          <p className="text-slate-500 text-center py-12">
            Nada encontrado. Tente outro termo ou veja todas as perguntas abaixo.
          </p>
        )}

        {secoes.map((s) => (
          <section key={s.titulo} className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-3">{s.titulo}</h2>
            <div className="space-y-2">
              {s.itens.map((it) => {
                const id = s.titulo + it.q;
                const aberto_ = aberto === id;
                return (
                  <div key={it.q} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setAberto(aberto_ ? null : id)}
                      className="w-full text-left px-4 py-3 font-medium text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-50"
                    >
                      <span>{it.q}</span>
                      <span className={`transition-transform ${aberto_ ? 'rotate-180' : ''}`}>⌄</span>
                    </button>
                    {aberto_ && (
                      <div className="px-4 pb-4 text-slate-700 leading-relaxed whitespace-pre-wrap border-t border-slate-100">
                        {it.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500 text-center">
          Não achou sua dúvida? <a href="mailto:contato@apprevista.com.br" className="text-blue-600 underline">Fale com a gente</a>.
        </div>
      </div>
    </main>
  );
}
