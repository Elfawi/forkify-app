import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// const recipeContainer = document.querySelector('.recipe');

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // geting the id
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // 0=> Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
    // 1=> updating bookmarks views
    bookmarksView.update(model.state.bookmarks);
    // 2=> Loading recipe
    await model.loadRecipe(id);
    // 3  => Rendering recipe
    recipeView.render(model.state.recipe);
    // controlServings();
  } catch (err) {
    recipeView.renderErrorMessage();
    console.error(err);
  }
};
// controlRecipes();

// model.loadSearchResults();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);

const controlSearchResults = async function () {
  try {
    // (1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // (2) Load search results
    await model.loadSearchResults(query);
    // (3) Render search results
    const searchedRecipes = model.getSearchResultsPage();
    resultsView.render(searchedRecipes);
    // (4) Render inital pagination buttons
    paginationView.render(model.state.search);
    // controlPagination(1);
  } catch (err) {}
};
const controlPagination = function (goToPage) {
  // (3) Render new results
  const searchedRecipes = model.getSearchResultsPage(goToPage);
  resultsView.render(searchedRecipes);
  // (4) Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1=> Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 2=> Update recipe view
  recipeView.update(model.state.recipe);
  // 3=> Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render a spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderSuccessMessage();
    // Render bookmark view
    bookmarksView.render(model.state.recipe.bookmarks);
    // Change the ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // Close form
    setTimeout(function () {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderErrorMessage(err.message);
  }
};
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addSearchHandler(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
