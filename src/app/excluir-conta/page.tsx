import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Excluir conta e dados',
  description: 'Como solicitar a exclusão da sua conta e dos seus dados no App Revista.',
};

const EMAIL = 'contato@apprevista.com.br';

export default function ExcluirContaPage() {
  const assunto = encodeURIComponent('Solicitação LGPD — Exclusão de conta');
  const corpo = encodeURIComponent(
    'Olá,\n\n' +
    'Solicito a exclusão da minha conta e de todos os meus dados pessoais no App Revista.\n\n' +
    'Email cadastrado: \n' +
    'Nome completo: \n' +
    'Condomínio(s) vinculado(s): \n\n' +
    'Confirmo que desejo apagar permanentemente os dados acima.\n'
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Voltar</Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-2">
          Excluir conta e dados
        </h1>
        <p className="text-slate-600 mb-8">
          Esta página descreve como solicitar a exclusão da sua conta e dos seus dados pessoais
          no App Revista, em conformidade com a LGPD (art. 18).
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 space-y-4 text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">Como solicitar</h2>
          <p>
            Envie um email para{' '}
            <a href={`mailto:${EMAIL}?subject=${assunto}&body=${corpo}`} className="text-blue-600 underline">
              {EMAIL}
            </a>{' '}
            com o assunto <strong>“Solicitação LGPD — Exclusão de conta”</strong> a partir do email
            cadastrado na sua conta.
          </p>
          <p>Inclua na mensagem:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email cadastrado na conta</li>
            <li>Nome completo</li>
            <li>Condomínio(s) vinculado(s), se houver</li>
          </ul>
          <a
            href={`mailto:${EMAIL}?subject=${assunto}&body=${corpo}`}
            className="inline-block mt-2 bg-slate-900 text-white font-semibold px-5 py-3 rounded-xl hover:bg-slate-800"
          >
            Abrir email pré-preenchido
          </a>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">O que será excluído</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dados de cadastro (nome, email, telefone, senha).</li>
            <li>Condomínios criados por você e todo o conteúdo associado: edições da revista, seções, fotos, KPIs, parceiros.</li>
            <li>Chamados, classificados, caronas, avaliações e tarefas vinculadas aos seus condomínios.</li>
            <li>Funcionários cadastrados e histórico de execuções de tarefas.</li>
            <li>Logs de auditoria contendo seus dados pessoais.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6">O que pode ser mantido</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Registros financeiros (notas fiscais, comprovantes de pagamento) pelo prazo legal de 5 anos.</li>
            <li>Backups anonimizados podem persistir por até 30 dias após a exclusão, sem identificadores pessoais.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6">Prazo</h2>
          <p>
            Confirmaremos a solicitação em até <strong>5 dias úteis</strong> e concluiremos a
            exclusão em até <strong>15 dias úteis</strong> a partir da confirmação.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">Outras solicitações LGPD</h2>
          <p>
            Você também pode solicitar acesso, correção, portabilidade ou anonimização dos seus
            dados pelo mesmo endereço:{' '}
            <a href={`mailto:${EMAIL}`} className="text-blue-600 underline">{EMAIL}</a>.
            Veja mais em{' '}
            <Link href="/politica-privacidade" className="text-blue-600 underline">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
