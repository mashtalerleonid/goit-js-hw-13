import './css/style.css';
import 'simplelightbox/dist/simple-lightbox.css';
import 'tui-pagination/dist/tui-pagination.min.css';

import imageCardTpl from './templates/image-card.hbs';
import ImagesApiService from './js/image-service';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import Pagination from 'tui-pagination';

Notiflix.Notify.init({
  distance: '30px',
  fontSize: '20px',
  width: '400px',
});

const lightbox = new SimpleLightbox('.gallery a', { showCounter: false });

const imagesApiService = new ImagesApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  container: document.querySelector('#tui-pagination-container'),
};

const optionsPagination = {
  totalItems: 0,
  itemsPerPage: imagesApiService.options.params.per_page,
  visiblePages: 10,
  page: 1,
};

const pagination = new Pagination(refs.container, optionsPagination);

refs.searchForm.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;

  imagesApiService.resetPage();

  if (imagesApiService.query === '') {
    makeNotificationError('Please, enter something');
    return;
  }

  clearArticlesContainer();

  await renderFetchedImages();

  pagination.reset(imagesApiService.totalHits);

  refs.container.classList.remove('is-hidden');
}

pagination.on('afterMove', event => {
  const currentPage = event.page;
  imagesApiService.page = currentPage;
  renderFetchedImages();
});

async function renderFetchedImages() {
  try {
    showLoading();

    const fetchedImages = await imagesApiService.fetchImages();

    hideLoading();

    const totalHits = imagesApiService.totalHits;
    const currentPage = imagesApiService.page;

    if (currentPage === 1) {
      makeNotificationSuccess(`Hooray! We found ${totalHits} images.`);
    }

    clearArticlesContainer();

    appendMarkup(fetchedImages);

    lightbox.refresh();
  } catch (error) {
    console.log(error);

    hideLoading();

    makeNotificationError(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
}

function appendMarkup(fetchedImages) {
  refs.imagesContainer.insertAdjacentHTML('beforeend', imageCardTpl(fetchedImages));

  window.scroll(0, 0);
}

function makeNotificationSuccess(text) {
  Notiflix.Notify.success(text);
}

function makeNotificationInfo(text) {
  Notiflix.Notify.info(text);
}

function makeNotificationError(text) {
  Notiflix.Notify.failure(text);
}

function showLoading() {
  Notiflix.Loading.arrows('Loading...');
}

function hideLoading() {
  Notiflix.Loading.remove();
}

function clearArticlesContainer() {
  refs.imagesContainer.innerHTML = '';
}
