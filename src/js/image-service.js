const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '22509463-498a875afefc35fc9228c8f09';

// export const options = {
//   method: 'get',
//   baseURL: BASE_URL,
//   params: {
//     key: API_KEY,
//     q: 'tiger',
//     per_page: '105',
//     page: '1',
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: 'true',
//   },
// };
// async function fetchImages() {
//   const response = await axios.request(options);
//   console.log(response);
//   console.log(response.data.hits.length);

//   if (response.data.hits.length === 0) {
//     throw new Error();
//   }
//   return response;
// }

// export default { fetchImages };

// const API_KEY = '4330ebfabc654a6992c2aa792f3173a3';
// const BASE_URL = 'https://newsapi.org/v2';
// const options = {
//   headers: {
//     Authorization: API_KEY,
//   },
// };
export default class ImagesApiService {
  constructor() {
    // this.searchQuery = '';
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
        SameSite: 'Lax',
      },
    };
  }

  async fetchImages() {
    const response = await axios.request(this.options);

    if (response.data.hits.length === 0) {
      throw new Error();
    }
    this.incrementPage();
    console.log(this.options.params.page);
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
// export default class NewsApiService {
//   constructor() {
//     this.searchQuery = '';
//     this.page = 1;
//   }

//   fetchArticles() {
//     const url = `${BASE_URL}/everything?q=${this.searchQuery}&language=en&pageSize=5&page=${this.page}`;

//     return fetch(url, options)
//       .then(response => response.json())
//       .then(({ articles }) => {
//         this.incrementPage();
//         return articles;
//       });
//   }

//   incrementPage() {
//     this.page += 1;
//   }

//   resetPage() {
//     this.page = 1;
//   }

//   get query() {
//     return this.searchQuery;
//   }

//   set query(newQuery) {
//     this.searchQuery = newQuery;
//   }
// }
