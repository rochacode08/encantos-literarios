// Testes da tabela de planos e da coerência dos preços exibidos.
// Rodar com: npm test
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const plans = require('../js/plans.js');

test('formata centavos em reais', () => {
  assert.equal(plans.formatBRL(5990), 'R$ 59,90');
  assert.equal(plans.formatBRL(31740), 'R$ 317,40');
  assert.equal(plans.formatBRL(123456), 'R$ 1.234,56');
  assert.equal(plans.formatBRL(5), 'R$ 0,05');
});

test('getPlan só aceita ids conhecidos', () => {
  assert.equal(plans.getPlan('monthly').name, 'Mensal');
  assert.equal(plans.getPlan('semi-annual').name, 'Semestral');
  assert.equal(plans.getPlan('annual').name, 'Anual');
  assert.equal(plans.getPlan('premium-gratis'), null);
  assert.equal(plans.getPlan('__proto__'), null);
  assert.equal(plans.getPlan(undefined), null);
});

test('totais do período e do ano', () => {
  const semi = plans.getPlan('semi-annual');
  const annual = plans.getPlan('annual');
  assert.equal(plans.periodTotalCents(semi), 31740);
  assert.equal(plans.periodTotalCents(annual), 58680);
  assert.equal(plans.yearlyTotalCents(plans.getPlan('monthly')), 71880);
});

test('descrição da cobrança deixa claro que é mensal', () => {
  assert.match(plans.billingDescription(plans.getPlan('monthly')), /todo mês/);
  assert.match(plans.billingDescription(plans.getPlan('semi-annual')), /por 6 meses .*R\$ 317,40/);
});

test('planos não podem ser alterados em tempo de execução', () => {
  assert.throws(() => { 'use strict'; plans.PLANS.monthly.monthlyPriceCents = 1; });
});

test('preços da página inicial batem com a tabela de planos', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const cards = { monthly: 'monthly', 'semi-annual': 'semi-annual', annual: 'annual' };

  for (const [cssClass, id] of Object.entries(cards)) {
    const start = html.indexOf(`<div class="${cssClass}">`);
    assert.notEqual(start, -1, `card .${cssClass} não encontrado`);
    const card = html.slice(start, html.indexOf(`data-plan="${id}"`, start));
    const plan = plans.getPlan(id);

    assert.ok(card.includes(plans.formatBRL(plan.monthlyPriceCents)),
      `preço mensal do ${plan.name} diferente da tabela`);

    const period = plan.periodMonths === 6
      ? `${plans.formatBRL(plans.periodTotalCents(plan))} em 6 meses`
      : `${plans.formatBRL(plans.yearlyTotalCents(plan))} por ano`;
    assert.ok(card.includes(period), `texto "${period}" ausente no card ${plan.name}`);
  }
});
