// Carrossel de assinaturas
document.addEventListener('DOMContentLoaded', function() {
  // Adicionar indicadores ao HTML
  const signatureSection = document.querySelector('.signature');
  const pricing = document.querySelector('.pricing');
  
  if (signatureSection && pricing) {
    // Criar indicadores
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    indicators.innerHTML = `
      <span class="dot active" data-slide="0"></span>
      <span class="dot" data-slide="1"></span>
      <span class="dot" data-slide="2"></span>
    `;
    signatureSection.appendChild(indicators);

    const dots = indicators.querySelectorAll('.dot');
    const cards = pricing.querySelectorAll('.monthly, .semi-annual, .annual');

    // Função para atualizar indicador ativo
    function updateActiveIndicator() {
      const scrollLeft = pricing.scrollLeft;
      const cardWidth = cards[0].offsetWidth + 20; // largura + gap
      const activeIndex = Math.round(scrollLeft / cardWidth);

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    }

    // Função para rolar para o card específico
    function scrollToCard(index) {
      const cardWidth = cards[0].offsetWidth + 20; // largura + gap
      pricing.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }

    // Event listeners
    pricing.addEventListener('scroll', updateActiveIndicator);
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => scrollToCard(index));
    });

    // Inicializar
    updateActiveIndicator();
  }
});

// Revela elementos que no desktop começam "fechados" (cards de plano e itens do kit).
// Abre quando o mouse passa por cima, quando algo dentro recebe foco pelo
// teclado ou quando a seção aparece bem na tela — assim ninguém fica sem ver.
function revealOnInteraction(element, className, visibleRatio) {
  if (!element) return;

  const reveal = () => {
    element.classList.add(className);
    element.removeEventListener('mouseenter', reveal);
    element.removeEventListener('focusin', reveal);
    if (observer) observer.disconnect();
  };

  element.addEventListener('mouseenter', reveal);
  element.addEventListener('focusin', reveal);

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        if (entries.some(entry => entry.intersectionRatio >= visibleRatio)) reveal();
      }, { threshold: visibleRatio })
    : null;

  if (observer) observer.observe(element);
}

document.addEventListener('DOMContentLoaded', function() {
  revealOnInteraction(document.querySelector('.signature .pricing'), 'revealed', 0.6);
  revealOnInteraction(document.querySelector('.month-kit .book-kit'), 'is-open', 0.5);
  revealOnInteraction(document.querySelector('.book-experience'), 'is-open', 0.6);
});

// Navegação suave para seção de assinaturas
document.addEventListener('DOMContentLoaded', function() {
  const headerSignButton = document.querySelector('header .sign');
  const signatureSection = document.querySelector('.signature');
  
  if (headerSignButton && signatureSection) {
    headerSignButton.addEventListener('click', function(e) {
      e.preventDefault();
      signatureSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    });
  }
});

// Seleção de plano: guarda só o id do plano. Preço e benefícios são lidos
// da tabela única em js/plans.js na página de pagamento.
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-plan]').forEach(button => {
    button.addEventListener('click', () => {
      const planId = button.dataset.plan;
      if (!EncantosPlans.getPlan(planId)) return;

      EncantosStorage.writeSession('selectedPlanId', planId);
      window.location.href = 'payment.html';
    });
  });
});
