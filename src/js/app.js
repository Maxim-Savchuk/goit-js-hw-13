import cardItemsTpl from '../templates/cardItem';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';

import CardsApiService from './fetchCards.js';
import LoadMoreBtn from './loadMoreBtn.js';

const cardsApiService = new CardsApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const lightbox = new SimpleLightbox('.photo-card a');

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  cardsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (cardsApiService.query === '') {
    return;
  }

  cardsApiService.resetPage();
  clearCardsGallery();
  try {
    const getCards = await cardsApiService.getCards();
    if (getCards.totalHits === 0) {
      loadMoreBtn.hide();
      showMessage('empty');
    }
    if (getCards.totalHits > 0) {
      loadMoreBtn.show();
      renderCards(getCards.hits);
      showMessage(getCards.totalHits);
      loadMoreBtn.enable();
      lightbox.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  loadMoreBtn.disable();

  try {
    const getCards = await cardsApiService.getCards();
    renderCards(getCards.hits);
    loadMoreBtn.enable();
    lightbox.refresh();

    const { height: cardHeight } = refs.cardList.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 1.5,
      behavior: 'smooth',
      block: 'end',
    });

    console.log(getCards.hits.length);

    if (getCards.hits.length < 40) {
      endCollection();
      return;
    }
  } catch (error) {
    endCollection();
  }
}

function renderCards(card) {
  const markup = cardItemsTpl(card);
  refs.cardList.insertAdjacentHTML('beforeend', markup);
}

function clearCardsGallery() {
  refs.cardList.innerHTML = '';
}

function showMessage(message) {
  if (message === 'end') {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  } else if (message === 'empty') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  } else if (message === Number(message)) {
    Notiflix.Notify.info(`Hooray! We found ${message} images.`);
  }
}

function endCollection() {
  loadMoreBtn.hide();
  showMessage('end');
}
