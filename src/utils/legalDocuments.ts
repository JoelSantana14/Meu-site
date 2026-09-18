import { Property, Lead, User, SiteConfig, LegalDocType, FiftyPartnerInfo } from '../types';

export interface DocumentContextData {
  property?: Property | null;
  lead?: Lead | null;
  agent?: User | null;
  siteConfig: SiteConfig;
  customData?: {
    ownerName?: string;
    ownerCpf?: string;
    ownerRg?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    ownerAddress?: string;
    tenantName?: string;
    tenantCpf?: string;
    tenantPhone?: string;
    contractValue?: number;
    commissionValue?: number;
    commissionPct?: number;
    referencePeriod?: string;
    dueDate?: string;
    paymentMethod?: string;
    exclusiveMonths?: number;
    isExclusive?: boolean;
    partnerName?: string;
    partnerCreci?: string;
    partnerEmail?: string;
    partnerPhone?: string;
    partnerPercentage?: number;
    registryNumber?: string;
    city?: string;
    state?: string;
  };
}

export function formatDocCurrency(value?: number): string {
  if (value === undefined || value === null || isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function getTodayFormattedDate(): string {
  const date = new Date();
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * 1. FICHA DE CAPTAÇÃO COMPLETA DE IMÓVEL COM AUTORIZAÇÃO DE VENDA/LOCAÇÃO
 * Fundamentada na Lei nº 6.530/1978, Decreto nº 81.871/1978 e Código Civil Brasileiro (arts. 722 a 729)
 */
export function generateFichaCaptacao(ctx: DocumentContextData): string {
  const p = ctx.property;
  const cfg = ctx.siteConfig;
  const a = ctx.agent;
  const custom = ctx.customData || {};

  const brokerName = a?.name || cfg.brokerName || cfg.companyName;
  const brokerCreci = a?.creci || cfg.creciFisico || cfg.brokerCreci || 'CRECI 12345-F';
  const brokerPhone = a?.phone || cfg.brokerPhone || cfg.phone;
  const brokerEmail = a?.email || cfg.brokerEmail || cfg.email;
  const agencyName = cfg.companyName;
  const creciJ = cfg.creciJuridico ? ` | CRECI Jurídico: ${cfg.creciJuridico}` : '';
  const cnpj = cfg.cnpj ? ` | CNPJ: ${cfg.cnpj}` : '';

  const ownerName = custom.ownerName || '____________________________________________________';
  const ownerCpf = custom.ownerCpf || '________________________';
  const ownerRg = custom.ownerRg || '________________________';
  const ownerPhone = custom.ownerPhone || '________________________';
  const ownerEmail = custom.ownerEmail || '________________________';
  const ownerAddress = custom.ownerAddress || '____________________________________________________';

  const propTitle = p?.title || 'Imóvel Residencial / Comercial';
  const propCode = p?.code || 'IMP-0000';
  const propType = p?.type ? p.type.toUpperCase() : 'NÃO ESPECIFICADO';
  const propPurpose = p?.purpose === 'venda' ? 'VENDA' : 'LOCAÇÃO';
  const propPrice = formatDocCurrency(custom.contractValue || p?.price || 0);
  const propCondo = formatDocCurrency(p?.condoFee || 0);
  const propIptu = formatDocCurrency(p?.propertyTax || p?.iptuValue || 0);
  const propArea = p?.areaSqM ? `${p.areaSqM} m²` : '____ m²';
  const propBedrooms = p?.bedrooms ?? '____';
  const propSuites = p?.suites ?? '____';
  const propBaths = p?.bathrooms ?? '____';
  const propGarages = p?.parkingSpaces ?? '____';
  const propTestada = p?.testadaMeters ? `${p.testadaMeters} metros` : '____ metros';
  const propTopografia = p?.topografia ? p.topografia.toUpperCase() : 'NÃO INFORMADO';
  const propOcupacao = p?.ocupacaoUso ? p.ocupacaoUso.toUpperCase() : 'RESIDENCIAL';

  const street = p?.address?.street || '__________________________________';
  const neighborhood = p?.address?.neighborhood || '________________';
  const city = p?.address?.city || cfg.brokerAddress?.split('-')[0]?.trim() || 'São Paulo';
  const state = p?.address?.state || 'SP';
  const zip = p?.address?.zip || '________-___';

  const commissionPct = custom.commissionPct || (propPurpose === 'VENDA' ? 6 : 100);
  const exclusiveText = custom.isExclusive !== false ? 'COM EXCLUSIVIDADE' : 'SEM EXCLUSIVIDADE';
  const validityDays = (custom.exclusiveMonths || 3) * 30;

  return `================================================================================
           FICHA DE CAPTAÇÃO E AUTORIZAÇÃO DE COMERCIALIZAÇÃO IMOBILIÁRIA
            (Fundamentada na Lei Federal nº 6.530/78, Dec. nº 81.871/78 e CCB)
================================================================================

1. QUALIFICAÇÃO DO CORRETOR / IMOBILIÁRIA CONTRATADA
--------------------------------------------------------------------------------
Intermediador(a): ${brokerName}
Registro Profissional: ${brokerCreci}${creciJ}${cnpj}
Empresa / Imobiliária: ${agencyName}
Telefone / WhatsApp: ${brokerPhone} | E-mail: ${brokerEmail}

2. QUALIFICAÇÃO DO PROPRIETÁRIO / COMITENTE
--------------------------------------------------------------------------------
Nome Completo: ${ownerName}
CPF/CNPJ: ${ownerCpf} | RG: ${ownerRg}
Telefone: ${ownerPhone} | E-mail: ${ownerEmail}
Endereço Residencial: ${ownerAddress}

3. DADOS TÉCNICOS E CADASTRAIS DO IMÓVEL (CÓDIGO: ${propCode})
--------------------------------------------------------------------------------
Título Descritivo: ${propTitle}
Tipo do Imóvel: ${propType} | Finalidade: ${propPurpose} | Uso/Ocupação: ${propOcupacao}
Endereço: ${street}, Bairro: ${neighborhood}
Cidade: ${city} - ${state} | CEP: ${zip}
Área Total / Construída: ${propArea} | Testada de Frente: ${propTestada}
Topografia do Terreno: ${propTopografia}
Dormitórios: ${propBedrooms} | Suítes: ${propSuites} | Banheiros: ${propBaths} | Vagas de Garagem: ${propGarages}
Matrícula nº: ${custom.registryNumber || '________________'} | Cartório de Registro de Imóveis: ________________
Inscrição Municipal / IPTU: ${propIptu} / mês | Taxa de Condomínio: ${propCondo} / mês

4. CONDIÇÕES COMERCIAIS E PREÇO DE OFERTA
--------------------------------------------------------------------------------
Valor Solicitado para ${propPurpose}: ${propPrice}
Forma de Pagamento Aceita: ( ) À Vista  ( ) Financiamento Bancário  ( ) Permuta  ( ) FGTS
Benfeitorias e Diferenciais: ${p?.features?.join(', ') || 'Armários embutidos, infraestrutura completa'}

5. CLÁUSULA DE AUTORIZAÇÃO DE MEDIAÇÃO E HONORÁRIOS
--------------------------------------------------------------------------------
Pelo presente instrumento particular, o(a) PROPRIETÁRIO(A) autoriza expressamente o(a) CORRETOR(A)
acima qualificado(a) a promover a intermediação para ${propPurpose} do imóvel retro especificado,
em caráter ${exclusiveText}, pelo prazo improrrogável de ${validityDays} dias, a contar desta data.

Pelos serviços profissionais prestados, o(a) PROPRIETÁRIO(A) compromete-se a pagar os honorários
de corretagem fixados em ${commissionPct}% (${propPurpose === 'VENDA' ? 'seis por cento sobre o valor total da venda' : 'cem por cento sobre o primeiro mês de locação'}),
devidos integralmente no ato do fechamento do negócio ou assinatura do respectivo compromisso/contrato.

O(A) PROPRIETÁRIO(A) declara, sob as penas da lei, ser o legítimo detentor dos direitos sobre o imóvel,
encontrando-se o mesmo livre e desembaraçado de quaisquer ônus judiciais ou extrajudiciais impeditivos.

${city} - ${state}, ${getTodayFormattedDate()}.


_____________________________________________       _____________________________________________
            PROPRIETÁRIO(A) / COMITENTE                               CORRETOR(A) DE IMÓVEIS
        CPF: ${ownerCpf}                                       ${brokerCreci}
`;
}

/**
 * 2. RECIBO DE ALUGUEL E ENCARGOS LOCATÍCIOS
 * Em conformidade com a Lei do Inquilinato (Lei nº 8.245/1991)
 */
export function generateReciboAluguel(ctx: DocumentContextData): string {
  const p = ctx.property;
  const l = ctx.lead;
  const cfg = ctx.siteConfig;
  const a = ctx.agent;
  const custom = ctx.customData || {};

  const brokerName = a?.name || cfg.brokerName || cfg.companyName;
  const brokerCreci = a?.creci || cfg.creciFisico || cfg.brokerCreci || 'CRECI 12345-F';
  const agencyName = cfg.companyName;

  const landlordName = custom.ownerName || '____________________________________________________';
  const landlordCpf = custom.ownerCpf || '________________________';

  const tenantName = custom.tenantName || l?.name || '____________________________________________________';
  const tenantCpf = custom.tenantCpf || l?.cpfCnpj || '________________________';

  const rentValue = custom.contractValue || p?.price || 2500;
  const condoValue = p?.condoFee || 0;
  const iptuValue = p?.propertyTax || p?.iptuValue || 0;
  const totalValue = rentValue + condoValue + iptuValue;

  const propAddress = `${p?.address?.street || 'Rua das Flores, 123'}, ${p?.address?.neighborhood || 'Centro'}, ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}`;
  const period = custom.referencePeriod || 'Mês Atual / 2026';
  const payMethod = custom.paymentMethod || 'Transferência Bancária / PIX';

  return `================================================================================
                         RECIBO DE ALUGUEL E ENCARGOS
            (Emitido nos termos da Lei Federal nº 8.245/91 - Lei do Inquilinato)
================================================================================

RECIBO Nº: REC-${Math.floor(100000 + Math.random() * 900000)}
VALOR TOTAL: ${formatDocCurrency(totalValue)}

1. IDENTIFICAÇÃO DAS PARTES
--------------------------------------------------------------------------------
LOCADOR(A): ${landlordName}
CPF/CNPJ: ${landlordCpf}

LOCATÁRIO(A): ${tenantName}
CPF/CNPJ: ${tenantCpf}

ADMINISTRADOR / INTERMEDIADOR: ${agencyName} | Resp.: ${brokerName} (${brokerCreci})

2. IDENTIFICAÇÃO DO IMÓVEL LOCADO
--------------------------------------------------------------------------------
Endereço: ${propAddress}
Código do Imóvel: ${p?.code || 'IMP-LOC'}

3. DISCRIMINAÇÃO DAS VERBAS E PERÍODO DE COMPETÊNCIA
--------------------------------------------------------------------------------
Mês de Competência / Período: ${period}
Data de Vencimento: ${custom.dueDate || '10 de cada mês'}
Forma de Pagamento: ${payMethod}

Item                                                    Valor
--------------------------------------------------------------------------------
1. Aluguel Mensal                                       ${formatDocCurrency(rentValue)}
2. Cota Condominial Ordinária                           ${formatDocCurrency(condoValue)}
3. Parcela de IPTU Proporcional                         ${formatDocCurrency(iptuValue)}
4. Despesas Acessórias / Seguro                         R$ 0,00
--------------------------------------------------------------------------------
VALOR LÍQUIDO PAGO:                                     ${formatDocCurrency(totalValue)}
--------------------------------------------------------------------------------

4. TERMO DE QUITAÇÃO
--------------------------------------------------------------------------------
Recebemos do(a) LOCATÁRIO(A) supramencionado(a) a quantia líquida e certa de ${formatDocCurrency(totalValue)},
referente ao pagamento do aluguel e encargos locatícios do imóvel acima discriminado, correspondente
ao período de competência indicado, dando-se plena, rasa e irrevogável quitação exclusivamente
sobre os valores e período discriminados neste recibo.

${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}, ${getTodayFormattedDate()}.


_________________________________________________________
          LOCADOR(A) OU ADMINISTRADORA CREDENCIADA
         ${agencyName} | ${brokerName} (${brokerCreci})
`;
}

/**
 * 3. RECIBO DE COMISSÃO E HONORÁRIOS DE CORRETAGEM IMOBILIÁRIA
 * Fundamentado nos arts. 722 a 729 do Código Civil Brasileiro e Lei Federal nº 6.530/78
 */
export function generateReciboComissao(ctx: DocumentContextData): string {
  const p = ctx.property;
  const cfg = ctx.siteConfig;
  const a = ctx.agent;
  const custom = ctx.customData || {};

  const brokerName = a?.name || cfg.brokerName || cfg.companyName;
  const brokerCreci = a?.creci || cfg.creciFisico || cfg.brokerCreci || 'CRECI 12345-F';
  const brokerCpfCnpj = cfg.cnpj || '00.000.000/0001-00';
  const agencyName = cfg.companyName;

  const payerName = custom.ownerName || '____________________________________________________';
  const payerCpf = custom.ownerCpf || '________________________';

  const transactionValue = custom.contractValue || p?.price || 500000;
  const commissionPct = custom.commissionPct || 6;
  const commissionValue = custom.commissionValue || (transactionValue * commissionPct) / 100;

  const propTitle = p?.title || 'Imóvel Residencial';
  const propCode = p?.code || 'IMP-VENDA';
  const propAddress = `${p?.address?.street || 'Av. Paulista, 1000'}, ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}`;

  return `================================================================================
                 RECIBO DE HONORÁRIOS DE CORRETAGEM IMOBILIÁRIA
      (Fundamentado nos Arts. 722 a 729 do Código Civil e Lei Federal nº 6.530/78)
================================================================================

RECIBO Nº: COM-${Math.floor(100000 + Math.random() * 900000)}
VALOR DOS HONORÁRIOS: ${formatDocCurrency(commissionValue)} (${commissionPct}%)

1. IDENTIFICAÇÃO DO(A) CORRETOR(A) / IMOBILIÁRIA RECEBEDORA
--------------------------------------------------------------------------------
Profissional: ${brokerName}
Inscrição CRECI: ${brokerCreci}
Empresa / Razão Social: ${agencyName}
CPF / CNPJ: ${brokerCpfCnpj}

2. IDENTIFICAÇÃO DO(A) PAGADOR(A) / COMITENTE
--------------------------------------------------------------------------------
Nome Completo / Razão Social: ${payerName}
CPF / CNPJ: ${payerCpf}

3. IDENTIFICAÇÃO DA TRANSAÇÃO IMOBILIÁRIA INTERMEDIADA
--------------------------------------------------------------------------------
Imóvel Objeto: ${propTitle} (Código: ${propCode})
Endereço do Imóvel: ${propAddress}
Valor Total da Transação de Compra e Venda: ${formatDocCurrency(transactionValue)}
Percentual de Comissão Acordado: ${commissionPct}% sobre o valor total da transação.

4. DECLARAÇÃO DE QUITAÇÃO PLENA E IRREVOGÁVEL
--------------------------------------------------------------------------------
Recebi do(a) PAGADOR(A) acima qualificado(a) a quantia líquida e exata de ${formatDocCurrency(commissionValue)},
através de ${custom.paymentMethod || 'Transferência Bancária / PIX'}, a título de pagamento integral
dos honorários profissionais devidos pela exitosa intermediação imobiliária referente ao imóvel
acima descrito.

Com o recebimento desta quantia, dou plena, geral, rasa e irrevogável quitação de todos os honorários
de corretagem pertinentes à mencionada transação imobiliária, nada mais tendo a reclamar a qualquer
título no presente ou no futuro.

${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}, ${getTodayFormattedDate()}.


_________________________________________________________
             ${brokerName}
     Corretor(a) de Imóveis - Inscrição: ${brokerCreci}
`;
}

/**
 * 4. CONTRATO DE PARCERIA IMOBILIÁRIA ENTRE CORRETORES (FIFTY / CO-CORRETAGEM)
 * Fundamentado no Código Civil Brasileiro (arts. 421 e 728) e Resoluções COFECI
 */
export function generateContratoParceria(ctx: DocumentContextData): string {
  const p = ctx.property;
  const cfg = ctx.siteConfig;
  const a = ctx.agent;
  const custom = ctx.customData || {};
  const fifty: FiftyPartnerInfo = p?.fifty || {
    enabled: true,
    partnerName: custom.partnerName || 'Corretor Parceiro Externo',
    partnerCreci: custom.partnerCreci || 'CRECI 99999-F',
    partnerEmail: custom.partnerEmail || 'parceiro@corretor.com.br',
    partnerPhone: custom.partnerPhone || '(11) 98888-8888',
    partnerPercentage: custom.partnerPercentage || 50,
    notes: ''
  };

  const broker1Name = a?.name || cfg.brokerName || cfg.companyName;
  const broker1Creci = a?.creci || cfg.creciFisico || cfg.brokerCreci || 'CRECI 12345-F';
  const broker1Email = a?.email || cfg.brokerEmail || cfg.email;
  const broker1Phone = a?.phone || cfg.brokerPhone || cfg.phone;

  const broker2Name = fifty.partnerName || custom.partnerName || 'Corretor Parceiro';
  const broker2Creci = fifty.partnerCreci || custom.partnerCreci || 'CRECI 99999-F';
  const broker2Email = fifty.partnerEmail || custom.partnerEmail || 'contato@parceiro.com';
  const broker2Phone = fifty.partnerPhone || custom.partnerPhone || '(11) 98888-8888';

  const partnerPct = fifty.partnerPercentage || custom.partnerPercentage || 50;
  const myPct = 100 - partnerPct;

  const propTitle = p?.title || 'Imóvel em Parceria Comercial';
  const propCode = p?.code || 'IMP-FIFTY';
  const propPrice = formatDocCurrency(custom.contractValue || p?.price || 850000);
  const propAddress = `${p?.address?.street || 'Rua das Palmeiras, 500'}, ${p?.address?.neighborhood || 'Jardins'}, ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}`;

  return `================================================================================
           CONTRATO DE PARCERIA E CO-CORRETAGEM IMOBILIÁRIA (FIFTY)
       (Fundamentado nos Arts. 421, 422 e 728 do Código Civil e Normas COFECI)
================================================================================

Pelo presente instrumento particular, de um lado:

PRIMEIRO(A) PARCEIRO(A) (CAPTADOR):
Nome / Razão Social: ${broker1Name}
Inscrição CRECI: ${broker1Creci}
Telefone: ${broker1Phone} | E-mail: ${broker1Email}
Representando a Imobiliária: ${cfg.companyName}

E de outro lado:

SEGUNDO(A) PARCEIRO(A) (VENDEDOR / ATENDIMENTO):
Nome / Razão Social: ${broker2Name}
Inscrição CRECI: ${broker2Creci}
Telefone: ${broker2Phone} | E-mail: ${broker2Email}

Têm entre si, justo e acordado, o presente Contrato de Parceria Imobiliária (Fifty),
mediante as cláusulas e condições seguintes:

CLÁUSULA 1ª - DO OBJETO DA PARCERIA
O presente contrato tem por objeto a atuação conjunta e cooperativa das partes na
intermediação de compra, venda ou locação do seguinte imóvel:
- Imóvel: ${propTitle} (Código: ${propCode})
- Endereço: ${propAddress}
- Valor Estimado de Comercialização: ${propPrice}

CLÁUSULA 2ª - DA DIVISÃO DOS HONORÁRIOS DE CORRETAGEM
Concluído o negócio com sucesso, os honorários totais de corretagem recebidos serão partilhados
entre as partes na seguinte proporção:
a) ${myPct}% (cinquenta por cento) para o(a) PRIMEIRO(A) PARCEIRO(A) (Captador);
b) ${partnerPct}% (cinquenta por cento) para o(a) SEGUNDO(A) PARCEIRO(A) (Atendimento/Venda).

Parágrafo Único: O pagamento da respectiva cota-parte será efetuado imediatamente após o recebimento
da comissão pelo cliente comprador ou vendedor, na conta bancária indicada por cada parceiro.

CLÁUSULA 3ª - DOS DEVERES E OBRIGAÇÕES DAS PARTES
I - O(A) PRIMEIRO(A) PARCEIRO(A) compromete-se a fornecer todas as informações fidedignas, fotos,
documentações da matrícula e autorização de venda do imóvel.
II - O(A) SEGUNDO(A) PARCEIRO(A) compromete-se a conduzir as visitas com agendamento prévio,
manter o primeiro parceiro informado sobre as propostas e zelar pelo sigilo das informações do cliente.
III - É expressamente vedado a qualquer uma das partes aliciar diretamente o cliente captado pelo outro parceiro.

CLÁUSULA 4ª - DO PRAZO DE VALIDADE
O presente acordo de parceria terá validade de 120 (cento e vinte) dias, prorrogável automaticamente
mediante interesse mútuo enquanto perdurarem as negociações com o cliente apresentado.

CLÁUSULA 5ª - DO FORO DE ELEIÇÃO
Para dirimir quaisquer dúvidas ou litígios decorrentes deste instrumento, as partes elegem o foro
da comarca de ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}, com renúncia a qualquer outro.

E, por estarem justos e contratados, assinam o presente em 2 (duas) vias de igual teor e forma.

${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}, ${getTodayFormattedDate()}.


_____________________________________________       _____________________________________________
            PRIMEIRO(A) PARCEIRO(A)                             SEGUNDO(A) PARCEIRO(A)
       ${broker1Name} - ${broker1Creci}                    ${broker2Name} - ${broker2Creci}
`;
}

/**
 * 5. CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CORRETAGEM IMOBILIÁRIA
 * Minuta jurídica completa conforme Lei nº 6.530/78, Decreto nº 81.871/78 e Código Civil
 */
export function generateContratoCorretagem(ctx: DocumentContextData): string {
  const p = ctx.property;
  const cfg = ctx.siteConfig;
  const a = ctx.agent;
  const custom = ctx.customData || {};

  const brokerName = a?.name || cfg.brokerName || cfg.companyName;
  const brokerCreci = a?.creci || cfg.creciFisico || cfg.brokerCreci || 'CRECI 12345-F';
  const brokerAddress = cfg.brokerAddress || 'São Paulo - SP';
  const agencyName = cfg.companyName;

  const clientName = custom.ownerName || '____________________________________________________';
  const clientCpf = custom.ownerCpf || '________________________';
  const clientRg = custom.ownerRg || '________________________';
  const clientAddress = custom.ownerAddress || '____________________________________________________';

  const propTitle = p?.title || 'Imóvel Residencial / Comercial';
  const propCode = p?.code || 'IMP-0001';
  const propPrice = formatDocCurrency(custom.contractValue || p?.price || 1200000);
  const commissionPct = custom.commissionPct || 6;
  const exclusiveMonths = custom.exclusiveMonths || 6;

  return `================================================================================
       CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CORRETAGEM E MEDIAÇÃO IMOBILIÁRIA
   (Em conformidade com a Lei Federal nº 6.530/78, Dec. nº 81.871/78 e Arts. 722 a 729 do CCB)
================================================================================

Pelo presente instrumento particular de Contrato de Prestação de Serviços de Corretagem Imobiliária:

CONTRATANTE(S):
Nome / Razão Social: ${clientName}
CPF / CNPJ: ${clientCpf} | RG / Inscrição Estadual: ${clientRg}
Endereço: ${clientAddress}
Na qualidade de legítimo(a) proprietário(a) e possuidor(a) do imóvel objeto deste contrato.

CONTRATADO(A):
Nome / Razão Social: ${agencyName} / ${brokerName}
Registro Profissional: ${brokerCreci}
Endereço Profissional: ${brokerAddress}

As partes acima qualificadas têm entre si justo e avençado o seguinte contrato:

CLÁUSULA 1ª - DO OBJETO
O presente contrato tem por objeto a prestação de serviços profissionais de corretagem e mediação
imobiliária pelo(a) CONTRATADO(A), visando à alienação / venda do seguinte bem imóvel:
- Descrição: ${propTitle} (Código: ${propCode})
- Matrícula nº: ${custom.registryNumber || '________'} do Cartório de Registro de Imóveis competente.
- Endereço: ${p?.address?.street || '________________'}, ${p?.address?.neighborhood || '________'}, ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}.

CLÁUSULA 2ª - DO PREÇO E CONDIÇÕES DE VENDA
O imóvel será ofertado pelo valor de ${propPrice}, admitindo-se propostas para pagamento à vista,
financiamento bancário ou parcelamento direto, cabendo ao(à) CONTRATANTE a aceitação final por escrito.

CLÁUSULA 3ª - DA EXCLUSIVIDADE E PRAZO DE VIGÊNCIA
O presente contrato vigorará com CLÁUSULA DE EXCLUSIVIDADE pelo prazo de ${exclusiveMonths} (${exclusiveMonths === 6 ? 'seis' : 'três'}) meses,
a contar da assinatura deste instrumento.
Parágrafo Único: Nos termos do Art. 726 do Código Civil, ajustada a exclusividade por escrito,
terá o(a) corretor(a) direito à remuneração integral, ainda que o negócio seja realizado sem a sua
mediação direta durante a vigência deste contrato.

CLÁUSULA 4ª - DOS HONORÁRIOS DE CORRETAGEM
Pelos serviços de intermediação contratados, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A) a comissão
de ${commissionPct}% (${commissionPct === 6 ? 'seis por cento' : `${commissionPct} por cento`}) sobre o valor total pelo qual for concretizada a transação.
Parágrafo 1º: A comissão será devida e paga no ato do recebimento do sinal de negócio ou na lavratura
da escritura pública / contrato preliminar irretratável.
Parágrafo 2º: Conforme Art. 727 do Código Civil, se por qualquer motivo cessar o presente contrato,
mas o negócio for concluído posteriormente com cliente comprovadamente apresentado pelo CONTRATADO,
será devida a comissão integral.

CLÁUSULA 5ª - DAS OBRIGAÇÕES DO CONTRATADO
O(A) CONTRATADO(A) obriga-se a:
a) Divulgar o imóvel através de seus canais digitais, portal, placas e redes de parceiros;
b) Prestar ao(à) CONTRATANTE todos os esclarecimentos sobre a segurança e viabilidade do negócio;
c) Acompanhar as visitas de interessados e assessorar na elaboração dos instrumentos contratuais.

CLÁUSULA 6ª - DO FORO
Para dirimir quaisquer controvérsias oriundas deste contrato, as partes elegem o Foro da Comarca
de ${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}.

E por estarem justos e contratados, firmam o presente instrumento em duas vias de igual teor.

${p?.address?.city || 'São Paulo'} - ${p?.address?.state || 'SP'}, ${getTodayFormattedDate()}.


_____________________________________________       _____________________________________________
                 CONTRATANTE                                         CONTRATADO(A)
              CPF: ${clientCpf}                                      ${brokerCreci}
`;
}

/**
 * Master dispatcher by LegalDocType
 */
export function generateLegalDocumentContent(type: LegalDocType, ctx: DocumentContextData): { title: string; content: string } {
  switch (type) {
    case 'ficha_captacao':
      return {
        title: `Ficha de Captação e Autorização - ${ctx.property?.code || 'Imóvel'}`,
        content: generateFichaCaptacao(ctx)
      };
    case 'recibo_aluguel':
      return {
        title: `Recibo de Aluguel - ${ctx.property?.code || 'Imóvel'}`,
        content: generateReciboAluguel(ctx)
      };
    case 'recibo_comissao':
      return {
        title: `Recibo de Comissão de Corretagem - ${ctx.property?.code || 'Imóvel'}`,
        content: generateReciboComissao(ctx)
      };
    case 'contrato_parceria':
      return {
        title: `Contrato de Parceria (Fifty) - ${ctx.property?.code || 'Imóvel'}`,
        content: generateContratoParceria(ctx)
      };
    case 'contrato_corretagem':
      return {
        title: `Contrato de Prestação de Serviços de Corretagem - ${ctx.property?.code || 'Imóvel'}`,
        content: generateContratoCorretagem(ctx)
      };
    default:
      return {
        title: 'Documento Jurídico Imobiliário',
        content: generateFichaCaptacao(ctx)
      };
  }
}

/**
 * Print & Export Formatter (PDF-ready window)
 */
export function exportDocumentToPdfOrPrint(title: string, content: string, siteConfig: SiteConfig): void {
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (!printWindow) {
    alert('Por favor, permita pop-ups para visualizar e imprimir o documento em PDF.');
    return;
  }

  const logoHtml = siteConfig.logoUrl
    ? `<img src="${siteConfig.logoUrl}" alt="Logo" style="max-height: 55px; margin-bottom: 8px;" />`
    : `<h2 style="margin: 0; color: #1e1b4b; font-size: 20px; font-weight: 900;">${siteConfig.companyName}</h2>`;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>${title} - ${siteConfig.companyName}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 15mm 15mm;
        }
        body {
          font-family: 'Courier New', Courier, monospace, 'Segoe UI', Tahoma, sans-serif;
          font-size: 11pt;
          line-height: 1.45;
          color: #111827;
          background: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #0f172a;
          padding-bottom: 12px;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .header-info {
          text-align: right;
          font-size: 9pt;
          color: #475569;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          font-size: 10pt;
          line-height: 1.45;
          margin: 0;
        }
        .footer {
          margin-top: 30px;
          border-top: 1px solid #cbd5e1;
          padding-top: 8px;
          font-size: 8pt;
          color: #64748b;
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; padding: 12px; background: #f1f5f9; border-radius: 8px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 24px; background: #4f46e5; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px;">
          🖨️ Imprimir ou Salvar como PDF
        </button>
      </div>

      <div class="header">
        <div>
          ${logoHtml}
          <div style="font-size: 10pt; font-weight: bold; color: #334155; font-family: sans-serif;">
            ${siteConfig.creciJuridico ? (/^creci/i.test(siteConfig.creciJuridico) ? siteConfig.creciJuridico : `CRECI-J: ${siteConfig.creciJuridico}`) + ' | ' : ''}${siteConfig.creciFisico ? (/^creci/i.test(siteConfig.creciFisico) ? siteConfig.creciFisico : `CRECI: ${siteConfig.creciFisico}`) : ''}
          </div>
        </div>
        <div class="header-info">
          <div>${siteConfig.address || 'São Paulo - SP'}</div>
          <div>${siteConfig.phone || ''} | ${siteConfig.email || ''}</div>
          <div>Emissão: ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>

      <pre>${escapeHtml(content)}</pre>

      <div class="footer">
        Documento gerado eletronicamente via Sistema de Gestão Imobiliária • ${siteConfig.companyName || siteConfig.brokerName} • Validade jurídica assegurada pela legislação brasileira.
      </div>

      <script>
        window.onload = function() {
          // Auto trigger print dialog if desired
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
