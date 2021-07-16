const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '22509463-498a875afefc35fc9228c8f09';

export default class ImagesApiService {
  constructor() {
    // this.pageCount = 0;
    // this.searchQuery = '';
    this.options = {
      method: 'get',
      baseURL: BASE_URL,
      params: {
        key: API_KEY,
        q: '',
        per_page: 30,
        page: 1,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
      },
    };
  }

  // async fetchImages() {
  //   const url = `${BASE_URL}/?image_type=photo&orientation=horizontal&q=cat&page=1&per_page=12&key=${API_KEY}`;
  //   const respons = await fetch(url);
  //   const pictures = await respons.json();
  //   // const { hits } = await pictures;
  //   this.incrementPage();
  //   console.log(pictures);
  //   return pictures;
  // }

  async fetchImages() {
    const response = await axios.request(this.options);
    console.log(response);

    if (response.data.hits.length === 0) {
      throw new Error();
    }

    this.incrementPage();
    console.log(response.data);
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
}
