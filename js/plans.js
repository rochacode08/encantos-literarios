// Tabela única de planos do Encantos Literários.
// Todas as páginas (início, pagamento, sucesso, perfil) leem os preços daqui.
// Regra comercial: todos os planos são cobrados mensalmente; Semestral e Anual
// têm um período mínimo de 6 e 12 meses, respectivamente.
// Em produção estes valores precisam ser validados no servidor — nunca confie
// no preço vindo do navegador.

(function (global) {
  const BASE_FEATURES = [
    'Kit mensal com livro temático',
    'Broche e marca páginas exclusivo',
    'Acesso à comunidade literária'
  ];

  const PLANS = Object.freeze({
    monthly: Object.freeze({
      id: 'monthly',
      name: 'Mensal',
      monthlyPriceCents: 5990,
      periodMonths: 1,
      features: Object.freeze([...BASE_FEATURES])
    }),
    'semi-annual': Object.freeze({
      id: 'semi-annual',
      name: 'Semestral',
      monthlyPriceCents: 5290,
      periodMonths: 6,
      features: Object.freeze([...BASE_FEATURES, 'Membro premium do clube'])
    }),
    annual: Object.freeze({
      id: 'annual',
      name: 'Anual',
      monthlyPriceCents: 4890,
      periodMonths: 12,
      features: Object.freeze([...BASE_FEATURES, 'Membro premium do clube', 'Planner anual de leituras'])
    })
  });

  const DEFAULT_PLAN_ID = 'monthly';

  // Retorna o plano pelo id ou null se o id não existir (ex.: valor adulterado no navegador)
  function getPlan(id) {
    return Object.prototype.hasOwnProperty.call(PLANS, id) ? PLANS[id] : null;
  }

  // 5990 → "59,90"
  function formatCents(cents) {
    const reais = Math.floor(cents / 100);
    const centavos = String(cents % 100).padStart(2, '0');
    return `${reais.toLocaleString('pt-BR')},${centavos}`;
  }

  // 5990 → "R$ 59,90"
  function formatBRL(cents) {
    return `R$ ${formatCents(cents)}`;
  }

  // Valor somado do período mínimo (Semestral: 6 meses, Anual: 12 meses)
  function periodTotalCents(plan) {
    return plan.monthlyPriceCents * plan.periodMonths;
  }

  // Valor de 12 meses na mesma taxa
  function yearlyTotalCents(plan) {
    return plan.monthlyPriceCents * 12;
  }

  // Texto que explica a cobrança de cada plano
  function billingDescription(plan) {
    const monthly = formatBRL(plan.monthlyPriceCents);
    if (plan.periodMonths === 1) {
      return `Cobrança de ${monthly} todo mês. Renovação mensal.`;
    }
    return `Cobrança de ${monthly} todo mês, por ${plan.periodMonths} meses ` +
      `(total de ${formatBRL(periodTotalCents(plan))} no período).`;
  }

  const api = {
    PLANS,
    DEFAULT_PLAN_ID,
    getPlan,
    formatCents,
    formatBRL,
    periodTotalCents,
    yearlyTotalCents,
    billingDescription
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.EncantosPlans = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
