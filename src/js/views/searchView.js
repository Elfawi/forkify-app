import View from './view.js';
const searchContainer = document.querySelector('.search-results');
class SearchView extends View {
  #parentEl = document.querySelector('.search');
  // searchQuery = document.querySelector('.search__field');
  // #btnSearch = document.querySelector('.search__btn');
  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value;
    // if (query === '') return this.renderErrorMessage();
    this.#clearSearchInput();
    return query;
  }
  #clearSearchInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addSearchHandler(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      searchContainer.style.display = 'block';
      handler();
    });
  }
  removeSearchResults() {
    window.addEventListener('hashchange', () => {
      if (window.screen.availWidth < 980) {
        searchContainer.style.display = 'none';
      }
    });
  }
}

export default new SearchView();
