// JavaScript para a página do clube de membros

// "Assinar", "Participar da Comunidade" e "Tornar-se Membro" levam aos planos
const botoes = document.querySelectorAll('.sign, .join-community-btn');

  // adiciona o evento de clique a cada um
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      // redireciona para a página e a div desejada
      window.location.href = 'index.html#signature';
    });
  });

document.addEventListener('DOMContentLoaded', function() {
    // Animação de entrada para os cards de benefícios
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = '';
                observer.unobserve(entry.target);
                // depois da entrada, devolve as transições para o CSS (hover)
                entry.target.addEventListener('transitionend', () => {
                    entry.target.style.transition = '';
                }, { once: true });
            }
        });
    }, observerOptions);

    // Aplicar animação aos cards de benefícios
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Aplicar animação aos cards de eventos
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        observer.observe(card);
    });

    // Aplicar animação aos cards de depoimentos
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Animação para as estatísticas da comunidade
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[\d,]/g, '');
                
                animateNumber(target, 0, numericValue, suffix, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Função para animar números
    function animateNumber(element, start, end, suffix, duration) {
        const startTime = performance.now();
        
        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);
            
            if (current >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + 'K' + suffix;
            } else {
                element.textContent = current + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    // "Participar da Comunidade" e "Tornar-se Membro" levam aos planos (ver topo do arquivo)
    const btnSecondary = document.querySelector('.btn-secondary');

    if (btnSecondary) {
        btnSecondary.addEventListener('click', function() {
            // Simular abertura de modal com mais informações
            showInfoModal();
        });
    }

    // Função para mostrar modal de informações (simulada)
    function showInfoModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 5, 10, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: linear-gradient(135deg, var(--shape-base) 0%, var(--shape-stroke) 100%);
            border: 1px solid var(--shape-stroke);
            border-radius: 1rem;
            padding: 2rem;
            max-width: 500px;
            margin: 1rem;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <h3 style="color: var(--text-title); margin-bottom: 1rem; font: var(--title-xs);">Mais Informações</h3>
            <p style="color: var(--text-body); margin-bottom: 2rem; font: var(--body-md); line-height: 1.6;">
                O Clube de Membros Encantos Literários oferece uma experiência única para amantes da literatura. 
                Com benefícios exclusivos, eventos especiais e uma comunidade ativa, você terá acesso a um mundo 
                de possibilidades literárias.
            </p>
            <button id="closeModal" style="
                background: linear-gradient(135deg, var(--pink-base), var(--pink-dark));
                color: var(--text-title);
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font: var(--button);
            ">Fechar</button>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Animar entrada do modal
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Fechar modal
        const closeModal = () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        };

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.getElementById('closeModal').addEventListener('click', closeModal);

        // Fechar com ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }

    // Adicionar efeito de brilho aos ícones das estrelas
    const starIcons = document.querySelectorAll('.star-icon');
    starIcons.forEach((star, index) => {
        star.style.animation = `twinkle 2s ease-in-out infinite ${index * 0.5}s`;
    });

    // Adicionar CSS para animação de brilho
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);

});

 

