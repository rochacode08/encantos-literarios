// Capas de livros.
// As imagens vêm da API pública de capas da Open Library (openlibrary.org),
// carregadas diretamente dos servidores deles. Se a capa não carregar
// (sem internet, capa removida...), mostramos uma capa gerada com o título.

(function (global) {
  const FALLBACK_GRADIENTS = [
    ['#7D298A', '#144A72'],
    ['#2374A4', '#3F0F41'],
    ['#9547A5', '#08233C'],
    ['#358BB9', '#7D298A']
  ];

  function coverUrl(coverId, size = 'M') {
    // default=false: devolve erro 404 em vez de uma imagem em branco, para cair na capa gerada
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg?default=false`;
  }

  function workUrl(olKey) {
    return `https://openlibrary.org${olKey}`;
  }

  // Capa gerada: gradiente + título + autor
  function createFallback(book) {
    const fallback = document.createElement('div');
    fallback.className = 'cover-fallback';
    const [from, to] = FALLBACK_GRADIENTS[book.title.length % FALLBACK_GRADIENTS.length];
    fallback.style.background = `linear-gradient(160deg, ${from}, ${to})`;

    const title = document.createElement('span');
    title.className = 'cover-fallback-title';
    title.textContent = book.title;

    const author = document.createElement('span');
    author.className = 'cover-fallback-author';
    author.textContent = book.author;

    fallback.append(title, author);
    return fallback;
  }

  // Preenche `container` com a capa do livro (ou a capa gerada)
  function renderCover(container, book, size = 'M') {
    container.replaceChildren();

    if (!book.coverId) {
      container.appendChild(createFallback(book));
      return;
    }

    const img = document.createElement('img');
    img.src = coverUrl(book.coverId, size);
    img.alt = `Capa de ${book.title}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.replaceWith(createFallback(book));
    }, { once: true });

    container.appendChild(img);
  }

  global.EncantosCovers = { renderCover, coverUrl, workUrl };
})(window);
