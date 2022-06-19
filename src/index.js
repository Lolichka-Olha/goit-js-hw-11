import ApiServiceImages from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('.input'),
  searchBtn: document.querySelector('.search-btn'),
  loadBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  scrollBtn: document.querySelector('.scroll-btn'),
};

const apiServiceImages = new ApiServiceImages();

refs.form.addEventListener('submit', handleSubmit);
refs.loadBtn.addEventListener('click', handleLoadMore);
refs.gallery.addEventListener('click', handleImageClick);
refs.scrollBtn.addEventListener('click', onScrollBtnClick);

function renderGallery({
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  const card = document.createElement('div');
  card.classList.add('photo-card');
  card.innerHTML = `<div class="card-container"><a class="gallery-item" href="${largeImageURL}"><img class="card-image" src="${largeImageURL}" alt="${tags}"  loading="lazy" /></a></div>
  <div class="info">
      <p class="info-item">
        <b>Likes : ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>`;
  refs.gallery.append(card);
}

function clearMarkup() {
  refs.gallery.innerHTML = '';
}

function handleSubmit(e) {
  e.preventDefault();

  apiServiceImages.query = e.currentTarget.elements.searchQuery.value;
  apiServiceImages.resetPage();
  clearMarkup();
  refs.scrollBtn.classList.add('is-hidden');

  if (apiServiceImages.query === '' || apiServiceImages.query === ' ') {
    refs.loadBtn.classList.add('is-hidden');
    return Notify.warning('Please enter what you want to find.');
  }

  apiServiceImages
    .fetchImages()
    .then(data => {
      if (data.hits.length === 0) {
        refs.loadBtn.classList.add('is-hidden');
        return Notify.failure('No results found. Please try again.');
      } else {
        //   data.hits.forEach(renderGallery);
        data.hits.map(renderGallery);
        handleImageClick();
        refs.loadBtn.classList.remove('is-hidden');
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    })
    .catch(error => console.log(error));
}

// function handleLoadMore(e) {
//   e.preventDefault();

//   apiServiceImages
//     .fetchImages()
//     .then(data => {
//       if (data.hits.length === 0) {
//         refs.loadBtn.classList.add('is-hidden');
//         refs.scrollBtn.classList.add('is-hidden');
//         return Notify.failure(
//           `We're sorry, but you've reached the end of search results.`
//         );
//       } else {
//         //   data.hits.forEach(renderGallery);
//         data.hits.map(renderGallery);
//         handleImageClick();
//         pageScroll();
//         refs.scrollBtn.classList.remove('is-hidden');
//       }
//     })
//     .catch(error => console.log(error));
// }

async function handleLoadMore(e) {
  e.preventDefault();

  const data = await apiServiceImages.fetchImages();
  const markup = data.hits.forEach(renderGallery);
  pageScroll();
  handleImageClick(markup);
  refs.scrollBtn.classList.remove('is-hidden');

  if (apiServiceImages.page >= data.totalHits / 40) {
    refs.loadBtn.classList.add('is-hidden');
    return Notify.failure(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function handleImageClick() {
  const galleryCard = new SimpleLightbox('.card-container a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  galleryCard.refresh();
  refs.gallery.addEventListener('click', galleryCard);
  refs.scrollBtn.classList.add('is-hidden');
}

function onScrollBtnClick(e) {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
  refs.loadBtn.classList.add('is-hidden');
  refs.scrollBtn.classList.add('is-hidden');
}

function pageScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
