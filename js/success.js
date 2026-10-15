// Tela de confirmação (DEMONSTRAÇÃO)
// Mostra a animação de processamento e redireciona para a biblioteca.
// Em produção, esta tela deve consultar o servidor para confirmar o status
// real da cobrança antes de dizer que a assinatura está ativa.

document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.processing-container');
  const steps = document.querySelectorAll('.step');

  const checkout = EncantosStorage.readSession('lastCheckout');
  const plan = checkout && EncantosPlans.getPlan(checkout.planId);

  // Chegou aqui sem passar pelo pagamento: volta para os planos
  if (!plan) {
    window.location.replace('index.html#signature');
    return;
  }

  document.getElementById('plan-name').textContent = `Plano ${plan.name}`;
  document.getElementById('plan-price').textContent =
    `${EncantosPlans.formatBRL(plan.monthlyPriceCents)} / mês`;

  function completeStep(step) {
    step.classList.remove('active');
    step.classList.add('completed');
    step.querySelector('.step-number').textContent = '✓';
  }

  // Etapa 2 → 3
  setTimeout(() => {
    completeStep(steps[1]);
    steps[2].classList.add('active');
  }, 1500);

  // Fim da simulação, após a barra de progresso (3.5s)
  setTimeout(() => {
    completeStep(steps[2]);
    container.classList.add('done');
    document.getElementById('status-title').textContent = 'Simulação concluída!';
    document.getElementById('status-text').textContent =
      'Nenhuma cobrança foi feita. Na versão real, sua assinatura seria ativada assim que o pagamento fosse confirmado.';

    EncantosStorage.removeSession('lastCheckout');

    let countdown = 5;
    const timerElement = document.querySelector('.redirect-timer');
    const countdownInterval = setInterval(() => {
      countdown--;
      timerElement.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        window.location.href = 'library.html';
      }
    }, 1000);
  }, 3500);
});

