// Armazenamento local do protótipo.
// Não existe servidor: os dados ficam apenas neste navegador (localStorage).
// Nunca guarde aqui número de cartão, CVV ou senhas.

(function (global) {
  const PREFIX = 'encantos:';

  function read(key, fallback = null) {
    try {
      const raw = global.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  // Retorna true se conseguiu salvar (pode falhar por cota cheia ou navegação privada)
  function write(key, value) {
    try {
      global.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function remove(key) {
    try {
      global.localStorage.removeItem(PREFIX + key);
    } catch (e) { }
  }

  // sessionStorage: usado só para passar o id do plano escolhido entre páginas
  function readSession(key, fallback = null) {
    try {
      const raw = global.sessionStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeSession(key, value) {
    try {
      global.sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function removeSession(key) {
    try {
      global.sessionStorage.removeItem(PREFIX + key);
    } catch (e) { }
  }

  // Apaga todos os dados do protótipo (localStorage e sessionStorage)
  function clearAll() {
    ['localStorage', 'sessionStorage'].forEach(name => {
      try {
        const store = global[name];
        Object.keys(store)
          .filter(key => key.startsWith(PREFIX))
          .forEach(key => store.removeItem(key));
      } catch (e) { }
    });
  }

  global.EncantosStorage = { read, write, remove, readSession, writeSession, removeSession, clearAll };
})(window);
