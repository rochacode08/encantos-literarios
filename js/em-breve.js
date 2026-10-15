// Página "Em breve": mostra o título e o texto da seção pedida na URL
// (ex.: em-breve.html?pagina=blog). Só aceita as seções da lista abaixo.

const SOON_PAGES = {
  'kits-passados': {
    title: 'Kits passados',
    text: 'Em breve você vai poder rever todos os kits que já enviamos, mês a mês.'
  },
  blog: {
    title: 'Blog',
    text: 'Resenhas, listas de leitura e novidades do mundo literário estão chegando.'
  },
  'central-de-ajuda': {
    title: 'Central de ajuda',
    text: 'Estamos reunindo as respostas para as dúvidas mais comuns sobre o clube.'
  },
  regulamentos: {
    title: 'Regulamentos',
    text: 'Os termos de uso e as regras da assinatura serão publicados aqui.'
  },
  suporte: {
    title: 'Suporte',
    text: 'Em breve você poderá falar com a nossa equipe por aqui.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const key = new URLSearchParams(window.location.search).get('pagina');
  const page = Object.prototype.hasOwnProperty.call(SOON_PAGES, key) ? SOON_PAGES[key] : null;
  if (!page) return;

  document.getElementById('soon-title').textContent = page.title;
  document.getElementById('soon-text').textContent = page.text;
});
