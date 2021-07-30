import axios from 'axios';

const API_KEY = '22714913-606cac6e21aef876ccb1111b2';

const BASE_URL = 'https://pixabay.com/api/';

export default class CardsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async getCards() {
    try {
      const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;
      const response = await axios.get(url);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
