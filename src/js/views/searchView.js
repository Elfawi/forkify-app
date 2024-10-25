import View from './view.js';

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
      handler();
    });
  }
}

export default new SearchView();
