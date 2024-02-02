
// Хэш элемент для изменения содержимого страниц
let hash = location.hash.substring(1);



// Импорт стилей Swiper
import 'swiper/swiper-bundle.min.css';

// Импорт Swiper и его стилей
import Swiper from 'swiper/swiper-bundle.min.js';


// Запрос в базу данных
const getData = async () => {
  const data = await fetch('db.json');
  if (data.ok) {
    return data.json();
  }
  else {
    throw new Error(`Данные не были получены ошибка ${data.status} ${data.statusText}`);
  }
};

// Формирование товаров по категориям
const getGoods = (callback, prop, value) => {
  getData()
  .then(data => {
    if (value) {
      callback(data.filter(item => item[prop] === value));
    }
    else {
      callback(data);
    }
  })
  .catch(err => {
    console.error(err);
  });
};



// Страница категорий товаров
// ... (ваш код до этого момента)

// Страница товара
try {
  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodDescr = document.querySelector('.card-good__descr');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodSelectWrapper = document.querySelector('.card-good__select-wrapper'); // Изменено на querySelector
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodBuy = document.querySelector('.card-good__buy');

  const generateList = data => data.reduce((html, item, i) =>
    html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

  const renderCardGood = ([{ id, brand, name, cost, descr, color, sizes, photos }]) => {
    const data = { brand, name, cost, descr, id };
    cardGoodImage.src = `./images/goods-image/${photos[0]}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} ₽`;
    cardGoodDescr.textContent = descr;

    // Исправлено: cardGoodImage.innerHTML = cardGoodImages;
    cardGoodImage.innerHTML = photos.map(photo => `<div class="swiper-slide"><img src="./images/goods-image/${photo}" alt="${brand} ${name}"></div>`).join('');

    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    } else {
      cardGoodColor.style.display = 'none';
    }
    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    } else {
      cardGoodSizes.style.display = 'none';
    }

    // Исправлено: убедитесь, что getLocalStorage, setLocalStorage и deleteItemCart определены где-то в вашем коде

    if (getLocalStorage().some(item => item.id === id)) {
      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';
    }

    cardGoodBuy.addEventListener('click', () => {
      if (cardGoodBuy.classList.contains('delete')) {
        deleteItemCart(id);
        cardGoodBuy.classList.remove('delete');
        cardGoodBuy.textContent = 'Добавить в корзину';
        return;
      }
      if (color) {
        data.color = cardGoodColor.textContent;
      }
      if (sizes) {
        data.size = cardGoodSizes.textContent;
      }

      cardGoodBuy.classList.add('delete');
      cardGoodBuy.textContent = 'Удалить из корзины';

      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
    });
  };

  cardGoodSelectWrapper.addEventListener('click', e => { // Изменено на addEventListener
    const target = e.target;
    if (target.closest('.card-good__select')) {
      target.classList.toggle('card-good__select__open');
    }
    if (target.closest('.card-good__select-item')) {
      const cardGoodSelect = cardGoodSelectWrapper.querySelector('.card-good__select'); // Изменено на cardGoodSelectWrapper
      cardGoodSelect.textContent = target.textContent;
      cardGoodSelect.dataset.id = target.dataset.id;
      cardGoodSelect.classList.remove('card-good__select__open');
    }
  });

  getGoods(renderCardGood, 'id', hash);
} catch (err) {
  console.warn(err);
}

// Инициализация Swiper
const swiper = new Swiper('.swiper-container', {
  slidesPerView: 1,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

