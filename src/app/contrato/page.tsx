'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const planos = [
  { id: 'sindico', nome: 'Plano Síndico', valor: 'R$199', valorNum: '199' },
  { id: 'administradora', nome: 'Plano Administradora', valor: 'R$299', valorNum: '299' },
];

export default function ContratoPage() {
  const [planoSelecionado, setPlanoSelecionado] = useState<string | null>(null);
  const hoje = new Date().toLocaleDateString('pt-BR');

  // Campos editáveis da CONTRATANTE
  const [campos, setCampos] = useState({
    razaoSocial: '',
    cnpj: '',
    endereco: '',
    numero: '',
    bairro: '',
    cep: '',
    cidadeUf: '',
    sindico: '',
    cpfRepresentante: '',
  });

  // Assinaturas
  const [assinaturas, setAssinaturas] = useState({
    contratanteNome: '',
    contratanteCnpj: '',
    testemunha1: '',
    testemunha1Cpf: '',
    testemunha2: '',
    testemunha2Cpf: '',
    dataAssinatura: hoje,
  });

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
  };

  const compartilharWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent('Confira o contrato do APP REVISTA: ' + window.location.href)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="App Revista" width={32} height={32} className="rounded-lg" />
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-[#1E3A5F] to-[#D4AF37] bg-clip-text text-transparent leading-none">APP REVISTA</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light leading-none">Condomínio</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-light bg-surface-hover rounded-lg hover:bg-[#E2E8F0] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Imprimir / PDF
            </button>
            <button onClick={copiarLink} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-light bg-surface-hover rounded-lg hover:bg-[#E2E8F0] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
              Copiar Link
            </button>
            <button onClick={compartilharWhatsApp} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#25D366] rounded-lg hover:bg-[#20BD5A] transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WhatsApp
            </button>
          </div>
        </div>
      </header>

      {/* Contract Content */}
      <main className="max-w-4xl mx-auto px-4 py-10 print:py-4 print:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8 sm:p-12 print:shadow-none print:border-none print:p-0">

          {/* Title */}
          <div className="text-center mb-10 pb-8 border-b border-border">
            <div className="flex justify-center mb-4">
              <Image src="/images/logo.png" alt="App Revista" width={64} height={64} className="rounded-xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE SOFTWARE</h1>
            <p className="text-sm text-text-light">App Revista</p>
          </div>

          {/* Cláusula 1 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">1</span>
              DAS PARTES
            </h2>
            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <div>
                <p className="font-semibold text-text mb-1">CONTRATADA:</p>
                <p>
                  <strong>APP GROUP LTDA - ME</strong> (Nome Fantasia: APP GROUP), pessoa jurídica de direito privado, inscrita no
                  CNPJ sob nº 51.797.070/0001-53, com sede na Av. Paulista, 1106, Sala 01, Bairro Bela Vista, CEP 01310-914, São
                  Paulo/SP, neste ato representada por seu representante legal, doravante
                  denominada simplesmente <strong>CONTRATADA</strong>.
                </p>
              </div>
              <div>
                <p className="font-semibold text-text mb-2">CONTRATANTE:</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { label: 'CONDOMÍNIO / RAZÃO SOCIAL', key: 'razaoSocial', full: true },
                    { label: 'CNPJ', key: 'cnpj', full: false },
                    { label: 'ENDEREÇO', key: 'endereco', full: true },
                    { label: 'Nº', key: 'numero', full: false },
                    { label: 'BAIRRO', key: 'bairro', full: false },
                    { label: 'CEP', key: 'cep', full: false },
                    { label: 'CIDADE / UF', key: 'cidadeUf', full: false },
                    { label: 'SÍNDICO(A) / REPRESENTANTE LEGAL', key: 'sindico', full: true },
                    { label: 'CPF DO REPRESENTANTE', key: 'cpfRepresentante', full: false },
                  ] as const).map(field => (
                    <div key={field.key} className={`border border-border rounded-lg p-2 ${field.full ? 'col-span-2' : ''}`}>
                      <span className="text-[10px] uppercase tracking-wider text-text-muted block">{field.label}</span>
                      <input
                        type="text"
                        value={campos[field.key]}
                        onChange={e => setCampos(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full h-6 text-sm text-text border-b border-dashed border-border-light mt-1 bg-transparent outline-none focus:border-[#1E3A5F] transition-colors placeholder:text-[#CBD5E1]"
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-text-light">Doravante denominado(a) simplesmente <strong>CONTRATANTE</strong>.</p>
              </div>
            </div>
          </section>

          {/* Cláusula 2 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">2</span>
              DO OBJETO
            </h2>
            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>
                O presente contrato tem por objeto a prestação de serviços de licenciamento,
                hospedagem e manutenção do sistema de revista digital condominial <strong>&quot;App Revista&quot;</strong>, plataforma digital (SaaS — Software as a Service) acessível via navegador web
                e dispositivos móveis, compreendendo:
              </p>
              <div>
                <p className="font-semibold text-text mb-2">Funcionalidades Incluídas no Plano:</p>
                <ul className="space-y-1.5">
                  {[
                    'Revista Digital com 8 layouts interativos (Flip, Scroll, Grid, Stories, Jornal, Slides, Timeline, Editorial)',
                    '8 Temas de Cores personalizáveis',
                    'Painel do Síndico com gestão completa de categorias',
                    'Área do Morador com acesso via QR Code',
                    'Sistema de Chamados com tracking em tempo real',
                    'Classificados e Publicidade interna',
                    'Caronas Coletivas entre moradores',
                    'QR Codes personalizados para cada serviço',
                    'Gestão de Funcionários com tarefas e geolocalização',
                    'Relatórios de antes/depois, checklists e vistorias',
                    'Personalização total com logo e identidade visual',
                    'Acesso PWA (instalável como app no celular)',
                    'Suporte técnico por WhatsApp',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Cláusula 3 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">3</span>
              DOS PLANOS E VALORES
            </h2>
            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>A CONTRATANTE deverá optar por um dos planos abaixo:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {planos.map(plano => (
                  <button
                    key={plano.id}
                    onClick={() => setPlanoSelecionado(plano.id)}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      planoSelecionado === plano.id
                        ? 'border-[#1E3A5F] bg-primary/5 shadow-md'
                        : 'border-border hover:border-border-light'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider text-text-light mb-1">Plano</div>
                    <div className="text-lg font-bold text-text">{plano.nome}</div>
                    <div className="text-2xl font-bold text-primary mt-1">{plano.valor}<span className="text-sm font-normal text-text-light">/mês</span></div>
                    {planoSelecionado === plano.id && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Selecionado
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="space-y-2 mt-4">
                <p><strong>3.1.</strong> Todos os planos incluem todas as funcionalidades listadas na Cláusula 2ª.</p>
                <p><strong>3.2.</strong> O valor será cobrado mensalmente, com vencimento todo dia <strong>10</strong> de cada mês.</p>
                <p><strong>3.3.</strong> O pagamento poderá ser realizado via boleto bancário, PIX ou cartão de crédito.</p>
              </div>
            </div>
          </section>

          {/* Cláusula 4 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">4</span>
              DO PERÍODO DE TESTE
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>4.1.</strong> A CONTRATANTE terá direito a um período de teste gratuito de <strong>7 (sete) dias corridos</strong>, contados a partir da ativação do sistema.</p>
              <p><strong>4.2.</strong> Ao término do período de teste, caso a CONTRATANTE não manifeste interesse na continuidade, o acesso será suspenso automaticamente, sem qualquer cobrança.</p>
            </div>
          </section>

          {/* Cláusula 5 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">5</span>
              DA VIGÊNCIA
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>5.1.</strong> O presente contrato terá vigência por prazo indeterminado, iniciando-se na data de sua assinatura.</p>
              <p><strong>5.2.</strong> <strong className="text-text">NÃO HÁ FIDELIDADE.</strong> Qualquer das partes poderá rescindir o presente contrato a qualquer tempo, mediante comunicação prévia de 30 (trinta) dias.</p>
              <p><strong>5.3.</strong> Não haverá multa por rescisão antecipada.</p>
            </div>
          </section>

          {/* Cláusula 6 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">6</span>
              DAS OBRIGAÇÕES DA CONTRATADA
            </h2>
            <div className="text-sm text-[#334155] leading-relaxed">
              <p className="mb-3">A CONTRATADA se obriga a:</p>
              <ul className="space-y-2">
                {[
                  'Disponibilizar o sistema 24 horas por dia, 7 dias por semana, com disponibilidade mínima de 99,5% ao mês;',
                  'Prestar suporte técnico por WhatsApp em horário comercial (segunda a sexta, 08h às 18h);',
                  'Realizar atualizações e melhorias contínuas no sistema sem custo adicional;',
                  'Manter backup diário dos dados do CONTRATANTE;',
                  'Garantir a segurança e confidencialidade dos dados armazenados, em conformidade com a LGPD (Lei nº 13.709/2018).',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Cláusula 7 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">7</span>
              DAS OBRIGAÇÕES DA CONTRATANTE
            </h2>
            <div className="text-sm text-[#334155] leading-relaxed">
              <p className="mb-3">A CONTRATANTE se obriga a:</p>
              <ul className="space-y-2">
                {[
                  'Efetuar o pagamento mensal na data de vencimento;',
                  'Fornecer informações corretas e atualizadas para cadastro no sistema;',
                  'Não compartilhar credenciais de acesso com terceiros não autorizados;',
                  'Utilizar o sistema de acordo com a legislação vigente e boas práticas;',
                  'Comunicar imediatamente qualquer irregularidade ou falha detectada no sistema.',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Cláusula 8 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">8</span>
              DA PROTEÇÃO DE DADOS (LGPD)
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>8.1.</strong> A CONTRATADA se compromete a tratar os dados pessoais coletados pelo sistema em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), atuando como Operadora de Dados.</p>
              <p><strong>8.2.</strong> Os dados pessoais de moradores, visitantes e funcionários cadastrados no sistema são de responsabilidade da CONTRATANTE (Controladora de Dados).</p>
              <p><strong>8.3.</strong> Em caso de rescisão contratual, a CONTRATADA manterá os dados por até <strong>90 (noventa) dias</strong> para eventual migração, após os quais serão definitivamente excluídos.</p>
            </div>
          </section>

          {/* Cláusula 9 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">9</span>
              DA PROPRIEDADE INTELECTUAL
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>9.1.</strong> O sistema &quot;App Revista&quot;, incluindo código-fonte, design, documentação e marca, é de propriedade exclusiva da <strong>APP GROUP LTDA - ME</strong>.</p>
              <p><strong>9.2.</strong> O presente contrato não transfere qualquer direito de propriedade intelectual à CONTRATANTE, que recebe apenas licença de uso não-exclusiva durante a vigência contratual.</p>
            </div>
          </section>

          {/* Cláusula 10 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">10</span>
              DO REAJUSTE
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>10.1.</strong> Os valores poderão ser reajustados anualmente com base no índice IGPM/FGV ou, na sua ausência, pelo IPCA/IBGE.</p>
              <p><strong>10.2.</strong> Qualquer reajuste será comunicado com antecedência mínima de <strong>30 (trinta) dias</strong>.</p>
            </div>
          </section>

          {/* Cláusula 11 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">11</span>
              DA RESCISÃO
            </h2>
            <div className="space-y-2 text-sm text-[#334155] leading-relaxed">
              <p><strong>11.1.</strong> O presente contrato poderá ser rescindido:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Por qualquer das partes, a qualquer tempo, <strong>sem multa</strong>, mediante aviso prévio de 30 dias;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Por inadimplência da CONTRATANTE superior a 60 (sessenta) dias;</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Por descumprimento de qualquer cláusula contratual, após notificação e prazo de 15 dias para regularização.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Cláusula 12 */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary text-white text-sm flex items-center justify-center font-bold">12</span>
              DO FORO
            </h2>
            <div className="text-sm text-[#334155] leading-relaxed">
              <p>Fica eleito o foro da Comarca de <strong>São Paulo/SP</strong> para dirimir quaisquer dúvidas oriundas do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.</p>
            </div>
          </section>

          {/* Resumo */}
          <section className="mb-8 p-6 bg-surface-alt rounded-xl border border-border">
            <h2 className="text-lg font-bold text-primary mb-4">RESUMO DOS SERVIÇOS CONTRATADOS</h2>
            <div className="rounded-lg border border-border bg-white overflow-hidden">
              {planoSelecionado ? (
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-text">{planos.find(p => p.id === planoSelecionado)?.nome}</div>
                      <div className="text-sm text-text-light">Todas as funcionalidades incluídas</div>
                    </div>
                    <div className="text-xl font-bold text-primary">{planos.find(p => p.id === planoSelecionado)?.valor}/mês</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-text-muted">
                  Nenhum plano selecionado — selecione na Cláusula 3ª
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1 text-xs text-text-light">
              <p><strong>DATA DE INÍCIO DA VIGÊNCIA</strong></p>
              <p>A partir de: {hoje}</p>
              <p>Vencimento mensal: dia 10 de cada mês • Forma de pagamento: boleto, PIX ou cartão</p>
            </div>
          </section>

          {/* Assinaturas */}
          <section className="mt-10 pt-8 border-t border-border">
            <p className="text-sm text-[#334155] leading-relaxed mb-8">
              E por estarem assim justas e contratadas, as partes assinam o presente
              instrumento em 2 (duas) vias de igual teor e forma, na presença de 2 (duas) testemunhas.
            </p>
            <p className="text-sm text-text-light text-center mb-10">
              São Paulo,{' '}
              <input
                type="text"
                value={assinaturas.dataAssinatura}
                onChange={e => setAssinaturas(prev => ({ ...prev, dataAssinatura: e.target.value }))}
                className="w-32 text-sm text-text border-b border-dashed border-border-light bg-transparent outline-none text-center focus:border-[#1E3A5F] transition-colors"
              />
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-6">CONTRATADA</p>
                <div className="border-b border-[#1E293B] mb-2" />
                <p className="text-sm font-bold text-text">APP GROUP LTDA - ME</p>
                <p className="text-xs text-text-light">CNPJ: 51.797.070/0001-53</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-6">CONTRATANTE</p>
                <input
                  type="text"
                  value={assinaturas.contratanteNome}
                  onChange={e => setAssinaturas(prev => ({ ...prev, contratanteNome: e.target.value }))}
                  className="w-full text-sm text-text border-b border-[#1E293B] bg-transparent outline-none text-center mb-2 focus:border-[#1E3A5F] transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="Nome / Razão Social"
                />
                <input
                  type="text"
                  value={assinaturas.contratanteCnpj}
                  onChange={e => setAssinaturas(prev => ({ ...prev, contratanteCnpj: e.target.value }))}
                  className="w-full text-xs text-text-light bg-transparent outline-none text-center focus:text-text transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="CNPJ: ___.___.___/____-__"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mt-10">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-6">TESTEMUNHA 1</p>
                <input
                  type="text"
                  value={assinaturas.testemunha1}
                  onChange={e => setAssinaturas(prev => ({ ...prev, testemunha1: e.target.value }))}
                  className="w-full text-sm text-text border-b border-[#1E293B] bg-transparent outline-none text-center mb-2 focus:border-[#1E3A5F] transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="Nome da testemunha"
                />
                <input
                  type="text"
                  value={assinaturas.testemunha1Cpf}
                  onChange={e => setAssinaturas(prev => ({ ...prev, testemunha1Cpf: e.target.value }))}
                  className="w-full text-xs text-text-light bg-transparent outline-none text-center focus:text-text transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="CPF: ___.___.___-__"
                />
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-text-muted mb-6">TESTEMUNHA 2</p>
                <input
                  type="text"
                  value={assinaturas.testemunha2}
                  onChange={e => setAssinaturas(prev => ({ ...prev, testemunha2: e.target.value }))}
                  className="w-full text-sm text-text border-b border-[#1E293B] bg-transparent outline-none text-center mb-2 focus:border-[#1E3A5F] transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="Nome da testemunha"
                />
                <input
                  type="text"
                  value={assinaturas.testemunha2Cpf}
                  onChange={e => setAssinaturas(prev => ({ ...prev, testemunha2Cpf: e.target.value }))}
                  className="w-full text-xs text-text-light bg-transparent outline-none text-center focus:text-text transition-colors placeholder:text-[#CBD5E1]"
                  placeholder="CPF: ___.___.___-__"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 mb-12 print:hidden">
          <Link href="/" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-text-light bg-white border border-border rounded-xl hover:bg-surface-alt transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
          </Link>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-[#2A5A8F] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Imprimir / PDF
          </button>
          <button onClick={copiarLink} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            Copiar Link
          </button>
          <button onClick={compartilharWhatsApp} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#25D366] rounded-xl hover:bg-[#20BD5A] transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            WhatsApp
          </button>
        </div>
      </main>
    </div>
  );
}
