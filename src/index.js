import './css/style.css';
import 'simplelightbox/dist/simple-lightbox.css';

import imageCardTpl from './templates/image-card.hbs';
import ImagesApiService from './js/image-service';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

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
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', fetchImages);

function onSearch(e) {
  e.preventDefault();

  refs.loadMoreBtn.classList.add('is-hidden');

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imagesApiService.query === '') {
    makeNotificationError('Please, enter something');
    return;
  }

  imagesApiService.resetPage();

  clearArticlesContainer();

  fetchImages();
}

async function fetchImages() {
  try {
    showLoading();

    const fetchedImages = await imagesApiService.fetchImages();

    hideLoading();

    const totalHits = fetchedImages.totalHits;
    const currentPage = imagesApiService.options.params.page - 1;
    const perPage = imagesApiService.options.params.per_page;

    if (currentPage === 1) {
      makeNotificationSuccess(`Hooray! We found ${totalHits} images.`);
    }

    appendMarkup(fetchedImages);

    lightbox.refresh();

    checkImagesCount(totalHits, currentPage, perPage);

    smoothScroll();
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

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  if (imagesApiService.options.params.page !== 2) {
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}

function checkImagesCount(total, current, per) {
  if (current * per >= total) {
    makeNotificationInfo("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.classList.add('is-hidden');
  } else {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}
