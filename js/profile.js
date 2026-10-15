// Página de perfil (DEMONSTRAÇÃO)
// Não existe servidor: dados pessoais, endereço, foto, preferências,
// avaliações e assinatura ficam salvos no localStorage deste navegador.
// Em produção, cada ação deve: validar → gravar no servidor → usar a resposta
// do servidor para atualizar a tela.

const DEFAULT_PROFILE = {
    fullName: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15'
};

const DEFAULT_ADDRESS = {
    cep: '01234-567',
    street: 'Rua das Flores, 123',
    complement: 'Apto 45',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
};

const DEFAULT_RATINGS = { vento: 5, selecao: 4 };

// Livros do histórico — capas da Open Library (ver js/covers.js)
const HISTORY_BOOKS = {
    vento: { title: 'O Nome do Vento', author: 'Patrick Rothfuss', coverId: 11480483 },
    selecao: { title: 'A Seleção', author: 'Kiera Cass', coverId: 7101900 },
    duna: { title: 'Duna', author: 'Frank Herbert', coverId: 11481354 }
};

const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const MAX_AVATAR_BYTES = 1024 * 1024; // 1 MB
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeForm(document.querySelector('.profile-form'), DEFAULT_PROFILE, validateProfile, renderProfileHeader);
    initializeForm(document.querySelector('.address-form'), DEFAULT_ADDRESS, validateAddress);
    initializeMasks();
    initializeAvatar();
    renderProfileHeader();
    initializeSubscription();
    initializePreferences();
    initializeHistory();
    initializeAccountActions();
});

// ---------- Abas ----------

function initializeTabs() {
    const tabs = [...document.querySelectorAll('.tab-btn')];

    function activate(tab, moveFocus) {
        tabs.forEach(t => {
            const selected = t === tab;
            t.classList.toggle('active', selected);
            t.setAttribute('aria-selected', String(selected));
            t.tabIndex = selected ? 0 : -1;
            document.getElementById(t.getAttribute('aria-controls')).classList.toggle('active', selected);
        });
        if (moveFocus) tab.focus();
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab, false));
        tab.addEventListener('keydown', (e) => {
            let next = null;
            if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
            if (e.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
            if (e.key === 'Home') next = tabs[0];
            if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) {
                e.preventDefault();
                activate(next, true);
            }
        });
    });
}

// ---------- Formulários (dados pessoais e endereço) ----------

function initializeForm(form, defaults, validate, onSaved) {
    const storeKey = form.dataset.store;
    const inputs = [...form.querySelectorAll('input')];
    const editBtn = form.querySelector('.edit-form-btn');
    const cancelBtn = form.querySelector('.cancel-btn');
    const saveBtn = form.querySelector('.save-btn');
    const message = form.querySelector('.form-message');

    function load() {
        const data = { ...defaults, ...EncantosStorage.read(storeKey, {}) };
        inputs.forEach(input => {
            input.value = data[input.name] ?? '';
            input.removeAttribute('aria-invalid');
        });
    }

    function setEditing(editing) {
        inputs.forEach(input => { input.readOnly = !editing; });
        editBtn.hidden = editing;
        cancelBtn.hidden = !editing;
        saveBtn.hidden = !editing;
        if (editing) inputs[0].focus();
    }

    function showError(text, input) {
        message.textContent = text;
        message.className = 'form-message message error-message';
        if (input) {
            input.setAttribute('aria-invalid', 'true');
            input.focus();
        }
    }

    function clearMessage() {
        message.textContent = '';
        message.className = 'form-message';
    }

    editBtn.addEventListener('click', () => {
        clearMessage();
        setEditing(true);
    });

    cancelBtn.addEventListener('click', () => {
        load();
        clearMessage();
        setEditing(false);
        editBtn.focus();
    });

    inputs.forEach(input => input.addEventListener('input', () => input.removeAttribute('aria-invalid')));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const data = {};
        inputs.forEach(input => { data[input.name] = input.value.trim(); });

        const error = validate(data);
        if (error) {
            showError(error.message, form.querySelector(`[name="${error.field}"]`));
            return;
        }

        if (!EncantosStorage.write(storeKey, data)) {
            showError('Não foi possível salvar neste navegador.');
            return;
        }

        clearMessage();
        setEditing(false);
        if (onSaved) onSaved();
        showNotification('Informações salvas neste navegador.', 'success');
    });

    load();
    setEditing(false);
}

function validateProfile(data) {
    if (data.fullName.length < 3) {
        return { field: 'fullName', message: 'Informe seu nome completo.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
        return { field: 'email', message: 'Informe um e-mail válido.' };
    }
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        return { field: 'phone', message: 'Informe o telefone com DDD.' };
    }
    const birth = new Date(`${data.birthDate}T00:00:00`);
    if (!data.birthDate || Number.isNaN(birth.getTime()) || birth > new Date() || birth.getFullYear() < 1900) {
        return { field: 'birthDate', message: 'Informe uma data de nascimento válida.' };
    }
    return null;
}

function validateAddress(data) {
    if (data.cep.replace(/\D/g, '').length !== 8) {
        return { field: 'cep', message: 'O CEP deve ter 8 dígitos.' };
    }
    if (data.street.length < 3) {
        return { field: 'street', message: 'Informe a rua e o número.' };
    }
    if (data.neighborhood.length < 2) {
        return { field: 'neighborhood', message: 'Informe o bairro.' };
    }
    if (data.city.length < 2) {
        return { field: 'city', message: 'Informe a cidade.' };
    }
    if (!UFS.includes(data.state.toUpperCase())) {
        return { field: 'state', message: 'Informe a sigla do estado (ex.: SP).' };
    }
    return null;
}

function initializeMasks() {
    const phone = document.getElementById('phone');
    phone.addEventListener('input', () => {
        const d = phone.value.replace(/\D/g, '').slice(0, 11);
        if (d.length <= 2) phone.value = d.length ? `(${d}` : '';
        else if (d.length <= 6) phone.value = `(${d.slice(0, 2)}) ${d.slice(2)}`;
        else if (d.length <= 10) phone.value = `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        else phone.value = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    });

    const cep = document.getElementById('cep');
    cep.addEventListener('input', () => {
        const d = cep.value.replace(/\D/g, '').slice(0, 8);
        cep.value = d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
    });

    const state = document.getElementById('state');
    state.addEventListener('input', () => {
        state.value = state.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 2);
    });
}

// ---------- Cabeçalho e foto ----------

function renderProfileHeader() {
    const profile = { ...DEFAULT_PROFILE, ...EncantosStorage.read('profile', {}) };
    document.getElementById('user-name').textContent = profile.fullName;

    const initials = profile.fullName
        .split(/\s+/)
        .filter(Boolean)
        .map(part => part[0])
        .filter((_, i, arr) => i === 0 || i === arr.length - 1)
        .join('')
        .toUpperCase();
    document.getElementById('avatar-initials').textContent = initials || '?';
}

function initializeAvatar() {
    const avatarImg = document.getElementById('avatar-img');
    const initials = document.getElementById('avatar-initials');

    function showAvatar(dataUrl) {
        avatarImg.hidden = !dataUrl;
        initials.hidden = Boolean(dataUrl);
        if (dataUrl) avatarImg.src = dataUrl;
    }

    showAvatar(EncantosStorage.read('avatar'));

    document.querySelector('.change-avatar-btn').addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = AVATAR_TYPES.join(',');

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;

            if (!AVATAR_TYPES.includes(file.type)) {
                showNotification('Use uma imagem JPG, PNG ou WebP.', 'error');
                return;
            }
            if (file.size > MAX_AVATAR_BYTES) {
                showNotification('A imagem deve ter no máximo 1 MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (!EncantosStorage.write('avatar', reader.result)) {
                    showNotification('Não há espaço para salvar a foto neste navegador.', 'error');
                    return;
                }
                showAvatar(reader.result);
                showNotification('Foto de perfil salva neste navegador.', 'success');
            };
            reader.readAsDataURL(file);
        });

        fileInput.click();
    });
}

// ---------- Assinatura ----------

const STATUS_LABELS = {
    active: 'Ativa',
    paused: 'Pausada'
};

function formatDate(date) {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function nextBillingDate(startedAt) {
    const start = new Date(startedAt);
    const now = new Date();
    const next = new Date(start);
    while (next <= now) {
        next.setMonth(next.getMonth() + 1);
    }
    return next;
}

function renderSubscription() {
    const subscription = EncantosStorage.read('subscription');
    const plan = subscription && EncantosPlans.getPlan(subscription.planId);
    const tag = document.getElementById('subscription-tag');
    const memberSince = document.getElementById('member-since');

    document.querySelector('.no-subscription').hidden = Boolean(plan);
    document.querySelectorAll('.has-subscription').forEach(el => { el.hidden = !plan; });

    if (!plan) {
        tag.textContent = 'Sem assinatura';
        tag.classList.remove('active');
        memberSince.textContent = 'Perfil de demonstração';
        return;
    }

    const statusLabel = STATUS_LABELS[subscription.status] || 'Ativa';
    const startedAt = new Date(subscription.startedAt);

    tag.textContent = `Assinatura ${plan.name} ${statusLabel}`;
    tag.classList.toggle('active', subscription.status !== 'paused');
    memberSince.textContent = `Assinante desde ${startedAt.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;

    document.getElementById('sub-plan-name').textContent = `Plano ${plan.name}`;
    document.getElementById('sub-plan-price').textContent = `${EncantosPlans.formatBRL(plan.monthlyPriceCents)}/mês`;
    document.getElementById('sub-billing').textContent = EncantosPlans.billingDescription(plan);
    document.getElementById('sub-status').textContent = subscription.status === 'paused'
        ? 'Assinatura pausada: nenhum kit será enviado até você reativar.'
        : `Próxima cobrança (simulada) em ${formatDate(nextBillingDate(subscription.startedAt))}.`;

    const benefits = document.getElementById('sub-benefits');
    benefits.replaceChildren(...plan.features.map(feature => {
        const li = document.createElement('li');
        const icon = document.createElement('img');
        icon.src = 'assets/icons/star.svg';
        icon.alt = '';
        li.append(icon, document.createTextNode(feature));
        return li;
    }));

    document.querySelector('.pause-subscription-btn').textContent =
        subscription.status === 'paused' ? 'Reativar Assinatura' : 'Pausar Assinatura';

    document.getElementById('card-last4').textContent = subscription.cardLast4
        ? `Cartão final ${subscription.cardLast4}`
        : 'Cartão não informado';
    document.getElementById('card-expiry').textContent = subscription.cardExpiry
        ? `Válido até ${subscription.cardExpiry}`
        : '';
}

function initializeSubscription() {
    renderSubscription();

    document.querySelector('.has-subscription .change-plan-btn').addEventListener('click', () => {
        showModal('Alterar Plano', 'Você será levado para a página de planos. Deseja continuar?', () => {
            window.location.href = 'index.html#signature';
        });
    });

    document.querySelector('.pause-subscription-btn').addEventListener('click', () => {
        const subscription = EncantosStorage.read('subscription');
        if (!subscription) return;

        if (subscription.status === 'paused') {
            subscription.status = 'active';
            EncantosStorage.write('subscription', subscription);
            renderSubscription();
            showNotification('Assinatura reativada (simulação).', 'success');
            return;
        }

        showModal('Pausar Assinatura', 'Sua assinatura será pausada e você não receberá novos kits. Confirmar?', () => {
            subscription.status = 'paused';
            EncantosStorage.write('subscription', subscription);
            renderSubscription();
            showNotification('Assinatura pausada (simulação).', 'warning');
        });
    });

    document.querySelector('.cancel-subscription-btn').addEventListener('click', () => {
        showModal('Cancelar Assinatura', 'Tem certeza que deseja cancelar sua assinatura?', () => {
            EncantosStorage.remove('subscription');
            renderSubscription();
            showNotification('Assinatura cancelada (simulação).', 'error');
        });
    });

    // Trocar o cartão = refazer o checkout do mesmo plano
    document.querySelector('.change-payment-btn').addEventListener('click', () => {
        const subscription = EncantosStorage.read('subscription');
        if (subscription) {
            EncantosStorage.writeSession('selectedPlanId', subscription.planId);
        }
        window.location.href = 'payment.html';
    });
}

// ---------- Preferências ----------

function initializePreferences() {
    const genreInputs = [...document.querySelectorAll('.genre-tag input')];
    const notificationInputs = [...document.querySelectorAll('.notification-item input')];
    const saved = EncantosStorage.read('preferences');

    if (saved) {
        genreInputs.forEach(input => { input.checked = saved.genres.includes(input.value); });
        notificationInputs.forEach(input => { input.checked = saved.notifications.includes(input.value); });
    }

    document.querySelector('.save-preferences-btn').addEventListener('click', () => {
        const preferences = {
            genres: genreInputs.filter(i => i.checked).map(i => i.value),
            notifications: notificationInputs.filter(i => i.checked).map(i => i.value)
        };

        if (EncantosStorage.write('preferences', preferences)) {
            showNotification('Preferências salvas neste navegador.', 'success');
        } else {
            showNotification('Não foi possível salvar as preferências.', 'error');
        }
    });
}

// ---------- Histórico e avaliações ----------

function getRatings() {
    return { ...DEFAULT_RATINGS, ...EncantosStorage.read('ratings', {}) };
}

function renderRating(container, key) {
    const rating = getRatings()[key];
    const book = HISTORY_BOOKS[key];

    if (!rating) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rate-btn';
        btn.textContent = 'Avaliar';
        btn.setAttribute('aria-label', `Avaliar ${book.title}`);
        btn.addEventListener('click', () => {
            showRatingModal(book.title, (value) => {
                const ratings = { ...EncantosStorage.read('ratings', {}), [key]: value };
                EncantosStorage.write('ratings', ratings);
                renderRating(container, key);
                updateRatingsCount();
                showNotification(`Avaliação de ${value} estrelas salva para "${book.title}".`, 'success');
            });
        });
        container.replaceChildren(btn);
        return;
    }

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.setAttribute('role', 'img');
    stars.setAttribute('aria-label', `${rating} de 5 estrelas`);
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = `star${i <= rating ? ' filled' : ''}`;
        star.textContent = '★';
        star.setAttribute('aria-hidden', 'true');
        stars.appendChild(star);
    }
    container.replaceChildren(stars);
}

function updateRatingsCount() {
    document.getElementById('ratings-count').textContent = Object.keys(getRatings()).length;
}

function initializeHistory() {
    document.querySelectorAll('.book-item[data-book]').forEach(item => {
        const key = item.dataset.book;
        EncantosCovers.renderCover(item.querySelector('.history-cover'), HISTORY_BOOKS[key]);
        renderRating(item.querySelector('.book-rating'), key);
    });
    updateRatingsCount();
}

// ---------- Conta ----------

function initializeAccountActions() {
    const logoutBtn = document.querySelector('.logout-btn');
    logoutBtn.addEventListener('click', () => {
        showModal('Sair da Conta', 'Este protótipo não tem login real. Ao sair, você volta para a página inicial e seus dados continuam salvos neste navegador.', () => {
            ['selectedPlanId', 'lastCheckout'].forEach(EncantosStorage.removeSession);
            window.location.href = 'index.html';
        });
    });

    document.querySelector('.reset-demo-btn').addEventListener('click', () => {
        showModal('Apagar dados salvos', 'Isso apaga perfil, endereço, foto, preferências, avaliações, favoritos e assinatura de demonstração deste navegador.', () => {
            EncantosStorage.clearAll();
            window.location.reload();
        });
    });
}

// ---------- Avisos e janelas ----------

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

function showNotification(message, type = 'info') {
    document.querySelector('.notification')?.remove();

    const notification = el('div', `notification notification-${type}`);
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const closeBtn = el('button', 'notification-close', '×');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Fechar aviso');

    notification.append(el('span', '', message), closeBtn);
    document.body.appendChild(notification);
    requestAnimationFrame(() => notification.classList.add('show'));

    const dismiss = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };
    closeBtn.addEventListener('click', dismiss);
    setTimeout(() => {
        if (notification.isConnected) dismiss();
    }, 5000);
}

// Janela de confirmação acessível (fecha com Esc, devolve o foco)
function openDialog(content, labelId) {
    const opener = document.activeElement;
    const overlay = el('div', 'modal-overlay');
    const dialog = el('div', 'modal');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', labelId);
    dialog.append(...content);
    overlay.appendChild(dialog);

    function close() {
        overlay.remove();
        document.removeEventListener('keydown', onKey);
        if (opener && opener.isConnected) opener.focus();
    }

    function onKey(e) {
        if (e.key === 'Escape') close();
    }

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);

    return { dialog, close };
}

function showModal(title, message, onConfirm) {
    const heading = el('h3', '', title);
    heading.id = 'modal-title';

    const cancelBtn = el('button', 'modal-cancel', 'Voltar');
    cancelBtn.type = 'button';
    const confirmBtn = el('button', 'modal-confirm', 'Confirmar');
    confirmBtn.type = 'button';

    const actions = el('div', 'modal-actions');
    actions.append(cancelBtn, confirmBtn);

    const { close } = openDialog([heading, el('p', '', message), actions], 'modal-title');

    cancelBtn.addEventListener('click', close);
    confirmBtn.addEventListener('click', () => {
        close();
        onConfirm();
    });
    confirmBtn.focus();
}

function showRatingModal(bookTitle, onRate) {
    const heading = el('h3', '', `Avaliar "${bookTitle}"`);
    heading.id = 'rating-modal-title';

    const stars = el('div', 'rating-stars');
    stars.setAttribute('role', 'radiogroup');
    stars.setAttribute('aria-label', 'Nota');

    const submitBtn = el('button', 'modal-confirm', 'Avaliar');
    submitBtn.type = 'button';
    submitBtn.disabled = true;
    const cancelBtn = el('button', 'modal-cancel', 'Cancelar');
    cancelBtn.type = 'button';

    let selected = 0;
    const starButtons = [1, 2, 3, 4, 5].map(value => {
        const star = el('button', 'rating-star', '★');
        star.type = 'button';
        star.setAttribute('role', 'radio');
        star.setAttribute('aria-checked', 'false');
        star.setAttribute('aria-label', `${value} ${value === 1 ? 'estrela' : 'estrelas'}`);
        star.addEventListener('mouseenter', () => paint(value));
        star.addEventListener('mouseleave', () => paint(selected));
        star.addEventListener('click', () => {
            selected = value;
            submitBtn.disabled = false;
            starButtons.forEach((s, i) => s.setAttribute('aria-checked', String(i + 1 === value)));
            paint(selected);
        });
        return star;
    });
    stars.append(...starButtons);

    function paint(upTo) {
        starButtons.forEach((s, i) => s.classList.toggle('lit', i < upTo));
    }

    const actions = el('div', 'modal-actions');
    actions.append(cancelBtn, submitBtn);

    const { close } = openDialog(
        [heading, el('p', '', 'Escolha de 1 a 5 estrelas:'), stars, actions],
        'rating-modal-title'
    );

    cancelBtn.addEventListener('click', close);
    submitBtn.addEventListener('click', () => {
        close();
        onRate(selected);
    });
    starButtons[0].focus();
}
