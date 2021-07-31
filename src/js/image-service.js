const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '22509463-498a875afefc35fc9228c8f09';

export default class ImagesApiService {
  constructor() {
    this.options = {
      method: 'get',
      baseURL: BASE_URL,
      params: {
        key: API_KEY,
        q: '',
        per_page: 40,
        page: 1,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };
    this.totalHits = 0;
  }

  async fetchImages() {
    const response = await axios.request(this.options);
    this.totalHits = response.data.totalHits;

    if (response.data.hits.length === 0) {
      throw new Error();
    }

    return response.data;
  }

  incrementPage() {
    this.options.params.page += 1;
  }

  resetPage() {
    this.options.params.page = 1;
  }

  get query() {
    return this.options.params.q;
  }

  set query(newQuery) {
    this.options.params.q = newQuery;
  }

  get page() {
    return this.options.params.page;
  }

  set page(newPage) {
    this.options.params.page = newPage;
  }
}
