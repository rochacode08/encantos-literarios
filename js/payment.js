// Página de pagamento (DEMONSTRAÇÃO)
// Nenhuma cobrança real é feita. Em produção, este formulário deve ser
// substituído pelo checkout/componentes seguros de um provedor de pagamento,
// e a assinatura só pode ser ativada após confirmação validada no servidor.

const TEST_CARD = {
    number: '4111 1111 1111 1111',
    name: 'TESTE USUARIO',
    expiry: '12/28',
    cvv: '123'
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const messageBox = form.querySelector('.form-message');
    const submitBtn = form.querySelector('.btn-submit');
    const cardNumberInput = document.getElementById('card-number');
    const cardNameInput = document.getElementById('card-name');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    const plan = loadSelectedPlan();
    renderOrderSummary(plan);

    // Máscaras de digitação
    cardNumberInput.addEventListener('input', () => {
        const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
        cardNumberInput.value = digits.replace(/(.{4})(?=.)/g, '$1 ');
    });

    expiryDateInput.addEventListener('input', () => {
        const digits = expiryDateInput.value.replace(/\D/g, '').slice(0, 4);
        expiryDateInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    });

    cvvInput.addEventListener('input', () => {
        cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 4);
    });

    // Prévia visual do cartão
    function updateCardPreview() {
        document.querySelector('.card-number-display').textContent =
            cardNumberInput.value || '•••• •••• •••• ••••';
        document.querySelector('.card-name-display').textContent =
            cardNameInput.value.trim() || 'NOME COMPLETO';
        document.querySelector('.card-expiry-display').textContent =
            expiryDateInput.value || 'MM/AA';
    }

    [cardNumberInput, cardNameInput, expiryDateInput].forEach(input => {
        input.addEventListener('input', updateCardPreview);
        input.addEventListener('input', () => clearFieldError(input));
    });
    cvvInput.addEventListener('input', () => clearFieldError(cvvInput));

    form.querySelector('.btn-test-card').addEventListener('click', () => {
        cardNumberInput.value = TEST_CARD.number;
        cardNameInput.value = TEST_CARD.name;
        expiryDateInput.value = TEST_CARD.expiry;
        cvvInput.value = TEST_CARD.cvv;
        [cardNumberInput, cardNameInput, expiryDateInput, cvvInput].forEach(clearFieldError);
        updateCardPreview();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            showMessage(error.message, 'error');
            markFieldError(error.field);
            error.field.focus();
            return;
        }

        submitBtn.disabled = true;
        showMessage('Simulando o pagamento… Aguarde o redirecionamento.', 'success');

        // Guarda apenas o necessário para o protótipo — nunca o número completo nem o CVV
        const last4 = cardNumberInput.value.replace(/\D/g, '').slice(-4);
        const subscription = {
            planId: plan.id,
            status: 'active',
            startedAt: new Date().toISOString(),
            cardLast4: last4,
            cardExpiry: expiryDateInput.value,
            demo: true
        };
        EncantosStorage.write('subscription', subscription);
        EncantosStorage.writeSession('lastCheckout', { planId: plan.id, demo: true });
        EncantosStorage.removeSession('selectedPlanId');

        setTimeout(() => {
            window.location.href = 'success.html';
        }, 1200);
    });

    function validate() {
        const number = cardNumberInput.value.replace(/\D/g, '');
        const name = cardNameInput.value.trim();
        const expiry = expiryDateInput.value;
        const cvv = cvvInput.value;

        if (number.length < 13 || !passesLuhn(number)) {
            return { field: cardNumberInput, message: 'Confira o número do cartão.' };
        }
        if (name.length < 3) {
            return { field: cardNameInput, message: 'Informe o nome como impresso no cartão.' };
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            return { field: expiryDateInput, message: 'Informe a validade no formato MM/AA.' };
        }

        const [month, year] = expiry.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
            return { field: expiryDateInput, message: 'Mês de validade inválido.' };
        }
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return { field: expiryDateInput, message: 'Este cartão está vencido.' };
        }
        if (cvv.length < 3) {
            return { field: cvvInput, message: 'O CVV tem 3 ou 4 dígitos.' };
        }
        return null;
    }

    function showMessage(text, type) {
        messageBox.textContent = text;
        messageBox.className = `form-message message ${type}-message`;
    }

    function markFieldError(input) {
        input.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(input) {
        input.removeAttribute('aria-invalid');
        if (messageBox.classList.contains('error-message')) {
            messageBox.textContent = '';
            messageBox.className = 'form-message';
        }
    }
});

// Algoritmo de Luhn: detecta erros de digitação no número do cartão.
// Não comprova que o cartão existe nem que a cobrança seria autorizada.
function passesLuhn(digits) {
    let sum = 0;
    let double = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let d = Number(digits[i]);
        if (double) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
        double = !double;
    }
    return sum % 10 === 0;
}

// O id vem do navegador e pode ter sido alterado: só aceitamos ids da tabela de planos
function loadSelectedPlan() {
    const planId = EncantosStorage.readSession('selectedPlanId');
    return EncantosPlans.getPlan(planId) || EncantosPlans.getPlan(EncantosPlans.DEFAULT_PLAN_ID);
}

function renderOrderSummary(plan) {
    const { formatBRL, billingDescription } = EncantosPlans;

    document.querySelector('.plan-name').textContent = `Plano ${plan.name}`;
    document.querySelector('.plan-price').textContent = `${formatBRL(plan.monthlyPriceCents)} / mês`;
    document.querySelector('.billing-info').textContent = billingDescription(plan);
    document.querySelector('.total-value').textContent = formatBRL(plan.monthlyPriceCents);

    const list = document.querySelector('.plan-features');
    list.replaceChildren(...plan.features.map(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        return li;
    }));
}
