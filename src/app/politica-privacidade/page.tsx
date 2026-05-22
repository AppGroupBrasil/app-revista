import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Como o App Revista coleta, usa e protege seus dados pessoais (LGPD).',
};

const ATUALIZADO = '22 de maio de 2026';
const CONTROLADOR_NOME = 'App Revista';
const CONTROLADOR_EMAIL = 'contato@apprevista.com.br';

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Voltar</Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-4 mb-2">
          Política de Privacidade
        </h1>
        <p className="text-sm text-slate-500 mb-10">Última atualização: {ATUALIZADO}</p>

        <article className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
          <section>
            <p>
              Esta Política de Privacidade descreve como o <strong>{CONTROLADOR_NOME}</strong> (“nós”) coleta,
              usa, armazena e compartilha dados pessoais dos usuários da plataforma, em conformidade
              com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">1. Controlador dos dados</h2>
            <p>
              Para fins desta Política, o controlador dos dados é o <strong>{CONTROLADOR_NOME}</strong>,
              que pode ser contatado pelo email <a href={`mailto:${CONTROLADOR_EMAIL}`} className="text-blue-600 underline">{CONTROLADOR_EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">2. Dados que coletamos</h2>
            <p>Coletamos os seguintes dados quando você usa o serviço:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cadastro do síndico/administrador:</strong> nome, email, telefone, senha (com hash).</li>
              <li><strong>Dados do condomínio:</strong> nome, endereço, CNPJ (opcional), logo, cores.</li>
              <li><strong>Conteúdo publicado:</strong> textos, fotos, edições da revista digital.</li>
              <li><strong>Solicitações de moradores:</strong> nome (opcional), unidade, contato, descrição (chamados, classificados, avaliações, caronas).</li>
              <li><strong>Dados técnicos:</strong> endereço IP, navegador, dispositivo, logs de acesso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">3. Finalidade do tratamento</h2>
            <p>Usamos seus dados exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Operar a plataforma (login, criação de condomínios, publicação de conteúdo).</li>
              <li>Permitir a comunicação entre síndico e moradores.</li>
              <li>Enviar notificações operacionais (chamados, classificados, avaliações).</li>
              <li>Garantir segurança e prevenir fraudes (logs de acesso, IP de origem).</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">4. Base legal</h2>
            <p>
              O tratamento ocorre sob as seguintes bases legais (art. 7º da LGPD):
              execução de contrato (para clientes), legítimo interesse (segurança e prevenção a fraudes),
              cumprimento de obrigação legal e consentimento (para canais públicos opcionais como avaliações
              e classificados).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">5. Compartilhamento</h2>
            <p>Não vendemos dados pessoais. Compartilhamos apenas com:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provedores de infraestrutura (hospedagem, banco de dados, envio de email).</li>
              <li>Autoridades públicas, quando exigido por lei ou ordem judicial.</li>
              <li>Outros moradores do mesmo condomínio, no escopo dos murais e canais públicos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">6. Retenção</h2>
            <p>
              Mantemos os dados enquanto sua conta estiver ativa e por até 5 anos após o encerramento,
              para fins de auditoria e obrigações fiscais. Avaliações e classificados moderados podem ser
              mantidos por tempo indeterminado, exceto sob solicitação de exclusão.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">7. Seus direitos (art. 18 LGPD)</h2>
            <p>Você pode, a qualquer momento, solicitar:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmação da existência de tratamento.</li>
              <li>Acesso, correção ou portabilidade dos seus dados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Revogação do consentimento.</li>
            </ul>
            <p>
              Basta enviar email para <a href={`mailto:${CONTROLADOR_EMAIL}`} className="text-blue-600 underline">{CONTROLADOR_EMAIL}</a> com o assunto “Solicitação LGPD”.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">8. Cookies e tecnologias</h2>
            <p>
              Usamos cookies essenciais para autenticação (token JWT) e funcionamento da aplicação.
              Não utilizamos cookies de rastreamento publicitário de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">9. Segurança</h2>
            <p>
              Empregamos medidas técnicas e administrativas razoáveis: HTTPS, criptografia de senhas (bcrypt),
              controle de acesso por JWT, backups regulares e logs de auditoria. Nenhum sistema é 100% seguro;
              em caso de incidente, notificaremos os titulares e a ANPD conforme exigido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">10. Alterações desta Política</h2>
            <p>
              Podemos atualizar esta Política a qualquer momento. A data acima reflete a última versão.
              Mudanças relevantes serão comunicadas pelo email cadastrado.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mt-8">11. Contato</h2>
            <p>
              Encarregado pelo Tratamento de Dados (DPO): <a href={`mailto:${CONTROLADOR_EMAIL}`} className="text-blue-600 underline">{CONTROLADOR_EMAIL}</a>
            </p>
          </section>
        </article>

        <div className="mt-12 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <Link href="/termos" className="text-blue-600 underline">Termos de Uso</Link>
        </div>
      </div>
    </main>
  );
}
