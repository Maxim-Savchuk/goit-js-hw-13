import cardItemsTpl from '../templates/cardItem';

import CardsApiService from './fetchCards';
import LoadMoreBtn from './loadMoreBtn';

const cardsApiService = new CardsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchCards);

async function onSearch(e) {
  e.preventDefault();

  cardsApiService.query = e.currentTarget.elements.searchQuery.value;

  if (cardsApiService.query === '') {
    return;
  }

  loadMoreBtn.show();
  cardsApiService.resetPage();
  clearCardsGallery();
  fetchCards();
}

async function fetchCards() {
  loadMoreBtn.disable();
  try {
    const getCards = await cardsApiService.getCards();
    renderCards(getCards.hits);
    loadMoreBtn.enable();
  } catch (error) {
    console.log(error);
  }
}

function renderCards(card) {
  const markup = cardItemsTpl(card);
  refs.cardList.insertAdjacentHTML('beforeend', markup);
}

function clearCardsGallery() {
  refs.cardList.innerHTML = '';
}
