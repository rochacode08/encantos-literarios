// Biblioteca: catálogo, busca, filtros, favoritos e detalhes do livro.
// Capas e páginas dos livros vêm da Open Library (ver js/covers.js).
// Favoritos ficam salvos no localStorage deste navegador (protótipo sem servidor).

const booksData = [
  {
    id: 1,
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    category: "fantasia",
    description: "Uma épica jornada através da Terra-média, onde um hobbit deve destruir um anel poderoso para salvar o mundo.",
    rating: 4.9,
    coverId: 14627060,
    olKey: "/works/OL27513W"
  },
  {
    id: 2,
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    category: "romance",
    description: "A história de Elizabeth Bennet e Mr. Darcy, explorando temas de amor, classe social e primeiras impressões.",
    rating: 4.7,
    coverId: 14348537,
    olKey: "/works/OL66554W"
  },
  {
    id: 3,
    title: "O Assassinato no Expresso do Oriente",
    author: "Agatha Christie",
    category: "misterio",
    description: "Hercule Poirot investiga um assassinato misterioso em um trem luxuoso preso na neve.",
    rating: 4.6,
    coverId: 11100465,
    olKey: "/works/OL471576W"
  },
  {
    id: 4,
    title: "1984",
    author: "George Orwell",
    category: "ficcao",
    description: "Uma distopia sobre vigilância totalitária e controle do pensamento em uma sociedade opressiva.",
    rating: 4.8,
    coverId: 9267242,
    olKey: "/works/OL1168083W"
  },
  {
    id: 5,
    title: "Steve Jobs",
    author: "Walter Isaacson",
    category: "biografia",
    description: "A biografia definitiva do cofundador da Apple, explorando sua vida pessoal e profissional.",
    rating: 4.5,
    coverId: 12374726,
    olKey: "/works/OL16085155W"
  },
  {
    id: 6,
    title: "O Poder do Agora",
    author: "Eckhart Tolle",
    category: "autoajuda",
    description: "Um guia espiritual para viver no momento presente e encontrar a paz interior.",
    rating: 4.4,
    coverId: 551262,
    olKey: "/works/OL5727686W"
  },
  {
    id: 7,
    title: "Harry Potter e a Pedra Filosofal",
    author: "J.K. Rowling",
    category: "fantasia",
    description: "Um jovem bruxo descobre seu destino mágico em uma escola de magia e bruxaria.",
    rating: 4.9,
    coverId: 15155833,
    olKey: "/works/OL82563W"
  },
  {
    id: 8,
    title: "Me Chame Pelo Seu Nome",
    author: "André Aciman",
    category: "romance",
    description: "Uma história de amor de verão entre dois jovens na Itália dos anos 80.",
    rating: 4.3,
    coverId: 11123807,
    olKey: "/works/OL8034526W"
  },
  {
    id: 9,
    title: "A Garota no Trem",
    author: "Paula Hawkins",
    category: "misterio",
    description: "Um thriller psicológico sobre uma mulher que se envolve em um caso de desaparecimento.",
    rating: 4.2,
    coverId: 7350360,
    olKey: "/works/OL17112428W"
  },
  {
    id: 10,
    title: "O Handmaid's Tale",
    author: "Margaret Atwood",
    category: "ficcao",
    description: "Uma distopia sobre uma sociedade teocrática onde mulheres são subjugadas.",
    rating: 4.6,
    coverId: 8231851,
    olKey: "/works/OL675783W"
  },
  {
    id: 11,
    title: "Becoming",
    author: "Michelle Obama",
    category: "biografia",
    description: "As memórias íntimas da ex-primeira-dama dos Estados Unidos.",
    rating: 4.7,
    coverId: 8824664,
    olKey: "/works/OL17930367W"
  },
  {
    id: 12,
    title: "Hábitos Atômicos",
    author: "James Clear",
    category: "autoajuda",
    description: "Um guia prático para formar bons hábitos e quebrar os ruins.",
    rating: 4.8,
    coverId: 12539702,
    olKey: "/works/OL17930368W"
  },
  {
    id: 13,
    title: "As Crônicas de Nárnia: O Leão, a Feiticeira e o Guarda-Roupa",
    author: "C.S. Lewis",
    category: "fantasia",
    description: "Quatro irmãos descobrem um mundo mágico através de um guarda-roupa.",
    rating: 4.5,
    coverId: 8441376,
    olKey: "/works/OL71037W"
  },
  {
    id: 14,
    title: "Como Eu Era Antes de Você",
    author: "Jojo Moyes",
    category: "romance",
    description: "Uma história tocante sobre amor, perda e a importância de viver plenamente.",
    rating: 4.4,
    coverId: 14419339,
    olKey: "/works/OL28353073W"
  },
  {
    id: 15,
    title: "O Código Da Vinci",
    author: "Dan Brown",
    category: "misterio",
    description: "Um thriller que mistura arte, história e conspiração religiosa.",
    rating: 4.3,
    coverId: 9255229,
    olKey: "/works/OL76837W"
  },
  {
    id: 16,
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    category: "ficcao",
    description: "Uma sociedade futurista onde livros são proibidos e queimados.",
    rating: 4.5,
    coverId: 12993656,
    olKey: "/works/OL103123W"
  },
  {
    id: 17,
    title: "Einstein: Sua Vida e Universo",
    author: "Walter Isaacson",
    category: "biografia",
    description: "A biografia completa do gênio da física moderna.",
    rating: 4.6,
    coverId: 474440,
    olKey: "/works/OL4288870W"
  },
  {
    id: 18,
    title: "Mindset: A Nova Psicologia do Sucesso",
    author: "Carol S. Dweck",
    category: "autoajuda",
    description: "Como a mentalidade de crescimento pode transformar sua vida.",
    rating: 4.5,
    coverId: 746414,
    olKey: "/works/OL2003465W"
  }
];

const CATEGORY_NAMES = {
  fantasia: 'Fantasia',
  romance: 'Romance',
  misterio: 'Mistério',
  ficcao: 'Ficção',
  biografia: 'Biografia',
  autoajuda: 'Autoajuda'
};

const DEFAULT_FAVORITES = [2, 7, 12];
const BOOKS_PER_PAGE = 9;

const state = {
  searchTerm: '',
  filter: 'todos',
  view: 'grid',
  page: 1,
  favorites: new Set(EncantosStorage.read('favorites', DEFAULT_FAVORITES))
};

let booksContainer;
let searchInput;
let loadMoreBtn;
let openModal = null;

document.addEventListener('DOMContentLoaded', () => {
  booksContainer = document.getElementById('books-container');
  searchInput = document.getElementById('search-input');
  loadMoreBtn = document.getElementById('load-more-btn');

  setupEventListeners();
  displayBooks();
  updateStats();
});

function setupEventListeners() {
  searchInput.addEventListener('input', () => {
    state.searchTerm = searchInput.value.toLowerCase().trim();
    state.page = 1;
    displayBooks();
  });

  document.querySelector('.search-container').addEventListener('submit', (e) => e.preventDefault());

  document.getElementById('search-clear').addEventListener('click', () => {
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.category;
      state.page = 1;
      document.querySelectorAll('.filter-btn').forEach(b => {
        const active = b === btn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      displayBooks();
    });
  });

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => setView(btn.dataset.view));
  });

  loadMoreBtn.addEventListener('click', () => {
    state.page++;
    displayBooks();
  });

  document.addEventListener('keydown', handleKeyboardShortcuts);
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('.view-btn').forEach(btn => {
    const active = btn.dataset.view === view;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  booksContainer.classList.toggle('list-view', view === 'list');
}

function getFilteredBooks() {
  const term = state.searchTerm;
  return booksData.filter(book => {
    const matchesFilter = state.filter === 'todos' || book.category === state.filter;
    const matchesSearch = term === '' ||
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      CATEGORY_NAMES[book.category].toLowerCase().includes(term) ||
      book.description.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });
}

function displayBooks() {
  const filtered = getFilteredBooks();
  const visible = filtered.slice(0, state.page * BOOKS_PER_PAGE);

  if (visible.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'books-empty';
    const title = document.createElement('h3');
    title.textContent = 'Nenhum livro encontrado';
    const hint = document.createElement('p');
    hint.textContent = 'Tente ajustar sua busca ou filtros.';
    empty.append(title, hint);
    booksContainer.replaceChildren(empty);
    loadMoreBtn.hidden = true;
    return;
  }

  booksContainer.replaceChildren(...visible.map(createBookCard));
  loadMoreBtn.hidden = visible.length >= filtered.length;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function starsText(rating) {
  const full = Math.floor(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function createOpenLibraryLink(book, className) {
  const link = el('a', className, 'Ver na Open Library');
  link.href = EncantosCovers.workUrl(book.olKey);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function createFavoriteButton(book) {
  const isFavorite = state.favorites.has(book.id);
  const btn = el('button', `btn-favorite${isFavorite ? ' favorited' : ''}`, isFavorite ? '❤️' : '🤍');
  btn.type = 'button';
  btn.setAttribute('aria-pressed', String(isFavorite));
  btn.setAttribute('aria-label', isFavorite ? `Remover ${book.title} dos favoritos` : `Adicionar ${book.title} aos favoritos`);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(book.id);
  });
  return btn;
}

function createBookCard(book) {
  const card = el('article', 'book-card');

  const cover = el('div', 'book-cover');
  EncantosCovers.renderCover(cover, book, 'L');

  const info = el('div', 'book-info');

  // O título é um botão: abre os detalhes e funciona pelo teclado
  const title = el('h3', 'book-title');
  const titleBtn = el('button', 'book-title-btn', book.title);
  titleBtn.type = 'button';
  titleBtn.addEventListener('click', () => showBookDetails(book));
  title.appendChild(titleBtn);

  const rating = el('div', 'book-rating');
  const stars = el('span', 'stars', starsText(book.rating));
  stars.setAttribute('aria-hidden', 'true');
  rating.append(stars, el('span', 'rating-text', `${book.rating}/5`));

  const actions = el('div', 'book-actions');
  actions.append(createOpenLibraryLink(book, 'btn-read'), createFavoriteButton(book));

  info.append(
    title,
    el('p', 'book-author', `por ${book.author}`),
    el('span', 'book-category', CATEGORY_NAMES[book.category]),
    el('p', 'book-description', book.description),
    rating,
    actions
  );

  card.append(cover, info);

  // Clique em qualquer parte do card (fora das ações) também abre os detalhes
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.book-actions, .book-title-btn')) {
      showBookDetails(book);
    }
  });

  return card;
}

function toggleFavorite(bookId) {
  const book = booksData.find(b => b.id === bookId);
  if (!book) return;

  if (state.favorites.has(bookId)) {
    state.favorites.delete(bookId);
  } else {
    state.favorites.add(bookId);
  }

  const saved = EncantosStorage.write('favorites', [...state.favorites]);
  displayBooks();
  updateStats();

  if (!saved) {
    showNotification('Não foi possível salvar seus favoritos neste navegador.');
  } else {
    showNotification(state.favorites.has(bookId) ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
  }
}

function showBookDetails(book) {
  closeModal();
  const opener = document.activeElement;

  const overlay = el('div', 'book-modal');
  const dialog = el('div', 'book-modal-content');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'book-modal-title');

  const cover = el('div', 'book-modal-cover');
  EncantosCovers.renderCover(cover, book, 'L');

  const title = el('h2', '', book.title);
  title.id = 'book-modal-title';

  const rating = el('div', 'book-modal-rating');
  const stars = el('span', 'stars', starsText(book.rating));
  stars.setAttribute('aria-hidden', 'true');
  rating.append(stars, el('span', '', `${book.rating}/5`));

  const isFavorite = state.favorites.has(book.id);
  const favBtn = el('button', 'btn-secondary', isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
  favBtn.type = 'button';
  favBtn.addEventListener('click', () => {
    toggleFavorite(book.id);
    closeModal();
  });

  const closeBtn = el('button', 'btn-ghost', 'Fechar');
  closeBtn.type = 'button';
  closeBtn.addEventListener('click', closeModal);

  const actions = el('div', 'book-modal-actions');
  actions.append(createOpenLibraryLink(book, 'btn-primary'), favBtn, closeBtn);

  dialog.append(
    cover,
    title,
    el('p', 'book-modal-author', `por ${book.author}`),
    el('span', 'book-category', CATEGORY_NAMES[book.category]),
    rating,
    el('p', 'book-modal-description', book.description),
    actions
  );

  overlay.appendChild(dialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('open'));
  closeBtn.focus();

  openModal = { overlay, opener };
}

function closeModal() {
  if (!openModal) return;
  const { overlay, opener } = openModal;
  openModal = null;
  overlay.classList.remove('open');
  setTimeout(() => overlay.remove(), 250);
  if (opener && document.contains(opener)) opener.focus();
}

function showNotification(message) {
  const notification = el('div', 'library-toast', message);
  notification.setAttribute('role', 'status');
  document.body.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add('show'));
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function handleKeyboardShortcuts(e) {
  if (e.key === 'Escape' && openModal) {
    closeModal();
    return;
  }

  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'f':
        e.preventDefault();
        searchInput.focus();
        break;
      case 'g':
        e.preventDefault();
        setView('grid');
        break;
      case 'l':
        e.preventDefault();
        setView('list');
        break;
    }
  }
}

// Estatísticas calculadas a partir do catálogo e dos favoritos salvos
function updateStats() {
  const genres = new Set(booksData.map(book => book.category));
  const average = booksData.reduce((sum, book) => sum + book.rating, 0) / booksData.length;

  document.getElementById('stat-catalog').textContent = booksData.length;
  document.getElementById('stat-favorites').textContent = state.favorites.size;
  document.getElementById('stat-genres').textContent = genres.size;
  document.getElementById('stat-average').textContent = average.toFixed(1).replace('.', ',');
}
