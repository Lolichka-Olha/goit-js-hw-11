import axios from 'axios';

const API_URL = 'https://pixabay.com/api/';
const API_KEY = '28129133-250e8f189138f2de7512e2e52';

export default class ApiServiceImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const options = {
      key: API_KEY,
      q: '',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    };

    const URL = `${API_URL}?key=${options.key}&q=${this.searchQuery}&image_type=${options.image_type}&orientation=${options.orientation}&safesearch=${options.safesearch}&page=${this.page}&per_page=${options.per_page}`;
    console.log(URL);
    return await axios
      .get(URL, options)
      .then(response => {
        this.page += 1;
        console.log(response);
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
