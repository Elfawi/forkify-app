import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   *  Render the recived object to the DOM
   * @param {Object|Object[]} data The data to be rendered (e.g. recipe)
   * @param {Boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined,string} A markup String is returned if render = false
   * @this {Object} View instance
   * @author Mohamed Elfawi
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newmarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newmarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currEl = currElements[i];
      ////  a way
      // if (!newEl.isEqualNode(currEl)) {
      //   currEl.innerHTML = newEl.innerHTML;
      // }
      ///// another way
      if (
        !newEl.isEqualNode(currEl) &&
        newEl?.firstChild?.nodeValue?.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        currEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderErrorMessage(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSuccessMessage() {
    const markup = `
          <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${this._successMessage}</p>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
}
