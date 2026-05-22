import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Condições gerais de uso da plataforma App Revista.',
};

const ATUALIZADO = '22 de maio de 2026';
const EMPRESA = 'App Revista';
const CONTATO = 'contato@apprevista.com.br';

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Voltar</Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-2">Termos de Uso</h1>
        <p className="text-sm text-slate-500 mb-10">Última atualização: {ATUALIZADO}</p>

        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <p>
              Estes Termos regulam o uso da plataforma <strong>{EMPRESA}</strong>, oferecida via
              <a href="https://apprevista.com.br" className="text-blue-600 underline"> apprevista.com.br</a>.
              Ao criar uma conta ou utilizar o serviço, você concorda integralmente com estes Termos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">1. Definições</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Plataforma:</strong> conjunto de páginas, APIs e aplicativos do {EMPRESA}.</li>
              <li><strong>Cliente:</strong> síndico, administradora ou empresa que contrata o serviço.</li>
              <li><strong>Usuário final:</strong> morador, prestador ou colaborador que interage com canais públicos.</li>
              <li><strong>Conteúdo:</strong> textos, imagens e arquivos publicados pelo Cliente ou Usuário.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">2. Objeto</h2>
            <p>
              O {EMPRESA} oferece ferramentas SaaS para gestão condominial: publicação de revistas digitais,
              chamados, classificados, caronas, avaliações, gestão de funcionários e comunicação com moradores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">3. Cadastro e conta</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>O Cliente é responsável pela veracidade das informações fornecidas.</li>
              <li>A senha é pessoal e intransferível.</li>
              <li>O Cliente deve manter os dados de contato atualizados para receber notificações operacionais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">4. Planos e pagamento</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Os planos vigentes estão na página principal do site.</li>
              <li>Pagamento via boleto bancário emitido diretamente pelo {EMPRESA}.</li>
              <li>Inadimplência superior a 15 dias pode resultar em bloqueio do acesso, com aviso prévio.</li>
              <li>Período de trial pode ser oferecido a critério do {EMPRESA}, sem obrigação de renovação.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">5. Responsabilidades do Cliente</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Publicar conteúdo lícito, verdadeiro e que respeite direitos de terceiros.</li>
              <li>Moderar conteúdo enviado por moradores (classificados, avaliações, chamados).</li>
              <li>Não usar a plataforma para envio de spam, conteúdo ofensivo, discriminatório ou ilegal.</li>
              <li>Cumprir a LGPD em relação aos dados de moradores que coleta e publica.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">6. Direitos do {EMPRESA}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Suspender contas em caso de violação destes Termos.</li>
              <li>Atualizar funcionalidades e interface a qualquer momento.</li>
              <li>Realizar manutenções programadas com aviso prévio razoável.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">7. Propriedade intelectual</h2>
            <p>
              Marca, logotipo, código e identidade visual do {EMPRESA} são protegidos. O Cliente mantém a
              titularidade do conteúdo que publica, concedendo licença não exclusiva ao {EMPRESA} apenas
              para exibi-lo na plataforma conforme contratado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">8. Limitação de responsabilidade</h2>
            <p>
              O {EMPRESA} não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Conteúdo publicado pelo Cliente ou por moradores.</li>
              <li>Indisponibilidades causadas por falhas de provedores de internet ou força maior.</li>
              <li>Prejuízos indiretos, lucros cessantes ou danos morais.</li>
            </ul>
            <p>
              A responsabilidade total do {EMPRESA}, em qualquer hipótese, fica limitada aos valores pagos
              pelo Cliente nos últimos 12 meses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">9. Cancelamento</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>O Cliente pode cancelar a qualquer momento; valores já pagos não são reembolsados.</li>
              <li>Após o cancelamento, os dados podem ser exportados por até 30 dias.</li>
              <li>Após 30 dias, os dados podem ser anonimizados ou excluídos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">10. Privacidade</h2>
            <p>
              O tratamento de dados pessoais segue nossa{' '}
              <Link href="/politica-privacidade" className="text-blue-600 underline">Política de Privacidade</Link>,
              em conformidade com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">11. Alterações dos Termos</h2>
            <p>
              Estes Termos podem ser atualizados. Mudanças materiais serão comunicadas pelo email cadastrado
              com 15 dias de antecedência. O uso continuado após a atualização representa aceitação.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">12. Foro</h2>
            <p>
              Fica eleito o foro do domicílio do {EMPRESA} para dirimir quaisquer controvérsias decorrentes
              destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">13. Contato</h2>
            <p>
              Dúvidas? <a href={`mailto:${CONTATO}`} className="text-blue-600 underline">{CONTATO}</a>
            </p>
          </section>
        </article>

        <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <Link href="/politica-privacidade" className="text-blue-600 underline">Política de Privacidade</Link>
        </div>
      </div>
    </main>
  );
}
