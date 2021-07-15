import './css/style.css';
import imageCardTpl from './templates/image-card.hbs';
import ImagesApiService from './js/image-service';
import Notiflix from 'notiflix';

const refs = {
  searchForm: document.querySelector('.search-form'),
  imagesContainer: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', onSearch);

const imagesApiService = new ImagesApiService();

function onSearch(e) {
  e.preventDefault();
  console.log(imagesApiService);

  imagesApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imagesApiService.query === '') {
    makeNotificationError('Please, enter something');
    return;
  }

  imagesApiService.resetPage();
  clearArticlesContainer();
  fetchImages();
}

async function fetchImages(images) {
  try {
    Notiflix.Loading.arrows('Loading...');

    const fetchedImages = await imagesApiService.fetchImages();
    // console.log(fetchedImages);
    Notiflix.Loading.remove();

    makeNotificationSuccess(`Hooray! We found ${fetchedImages.totalHits} images.`);
    appendMarkup(fetchedImages);
  } catch (error) {
    // console.log(error);
    Notiflix.Loading.remove();

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

function makeNotificationError(text) {
  Notiflix.Notify.failure(text);
}

function clearArticlesContainer() {
  refs.imagesContainer.innerHTML = '';
}
