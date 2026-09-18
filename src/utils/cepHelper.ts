export interface CepAddressResult {
  zip: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  ddd?: string;
  ibge?: string;
}

export async function fetchAddressByCep(rawCep: string): Promise<{
  success: boolean;
  data?: CepAddressResult;
  error?: string;
}> {
  const cleanCep = rawCep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return {
      success: false,
      error: 'CEP deve conter 8 dígitos numéricos.'
    };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Erro na resposta do serviço de CEP (${response.status})`);
    }

    const data = await response.json();

    if (data.erro === true || data.erro === 'true') {
      return {
        success: false,
        error: 'CEP não encontrado na base oficial dos Correios.'
      };
    }

    return {
      success: true,
      data: {
        zip: formatCep(data.cep || cleanCep),
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: (data.uf || '').toUpperCase(),
        ddd: data.ddd,
        ibge: data.ibge
      }
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        error: 'Tempo limite excedido ao consultar o CEP. Tente preencher manualmente.'
      };
    }
    return {
      success: false,
      error: 'Não foi possível consultar o CEP no momento. Verifique sua conexão.'
    };
  }
}

export function formatCep(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatCurrencyBRL(value: number | string): string {
  if (value === '' || value === undefined || value === null) return '';
  const num = typeof value === 'number' ? value : Number(String(value).replace(/\D/g, '')) / 100;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

export function parseCurrencyInput(formatted: string): number {
  if (!formatted) return 0;
  const digits = formatted.replace(/\D/g, '');
  if (!digits) return 0;
  return Number(digits) / 100;
}
