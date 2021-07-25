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

let showMore = true;

const lightbox = new SimpleLightbox('.gallery a', { showCounter: false });

const imagesApiService = new ImagesApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  sentinel: document.querySelector('#sentinel'),
};

const optionsObserver = { rootMargin: '200px' };
const observer = new IntersectionObserver(onEntry, optionsObserver);
observer.observe(refs.sentinel);

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  showMore = true;
  refs.sentinel.textContent = '';

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
    if (imagesApiService.page === 1) {
      showLoading();
    }

    const fetchedImages = await imagesApiService.fetchImages();

    if (imagesApiService.page === 1) {
      hideLoading();
    }

    const totalHits = fetchedImages.totalHits;
    const currentPage = imagesApiService.page;
    const perPage = imagesApiService.options.params.per_page;

    if (currentPage === 1) {
      makeNotificationSuccess(`Hooray! We found ${totalHits} images.`);
    }

    appendMarkup(fetchedImages);

    lightbox.refresh();

    checkImagesCount(totalHits, currentPage, perPage);

    imagesApiService.incrementPage();
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

function checkImagesCount(total, current, per) {
  if (current * per >= total) {
    refs.sentinel.textContent = "We're sorry, but you've reached the end of search results.";

    showMore = false;
  }
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.page !== 1 && showMore) {
      fetchImages();
    }
  });
}
