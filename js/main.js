
// Хэш элемент для изменения содержимого страниц
let hash = location.hash.substring(1);




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
try {
  const goodsList = document.querySelector('.goods__list');
  const goodsTitle = document.querySelector('.goods__title');
  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };
  const createCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');
    li.classList.add('goods__item');
    li.innerHTML = `
    <article class="good">
      <a class="good__link-img" href="card-good.html#${id}">
        <img class="good__img" src="./images/goods-image/${preview}" alt="">
      </a>
      <div class="good__description">
        <p class="good__price">${cost} RUB;</p>
        <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
        ${sizes ?
      `<p class="good__sizes">Размеры: <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
      ''}
        <a class="good__link" href="card-good.html#${id}">Подробнее</a>
      </div>
    </article>
    `;
    return li;
  };

  const renderGoodsList = data => {
    goodsList.textContent = '';
    data.forEach(item => {
      const card = createCard(item);
      goodsList.append(card);
    });
  };

  // Изменение содержимого при смене страниц
  window.addEventListener('hashchange', () => {
    hash = location.hash.substring(1);
    getGoods(renderGoodsList, 'category', hash);
    changeTitle();
  });

  getGoods(renderGoodsList, 'category', hash);
  changeTitle();
}
catch (err) {
  console.warn(err);
}

// Страница товара
try {
  const cardGoodImage = document.querySelector('.card-good__image');
  const cardGoodBrand = document.querySelector('.card-good__brand');
  const cardGoodTitle = document.querySelector('.card-good__title');
  const cardGoodPrice = document.querySelector('.card-good__price');
  const cardGoodDescr = document.querySelector('.card-good__descr');
  const cardGoodColor = document.querySelector('.card-good__color');
  const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper');
  const cardGoodColorList = document.querySelector('.card-good__color-list');
  const cardGoodSizes = document.querySelector('.card-good__sizes');
  const cardGoodSizesList = document.querySelector('.card-good__sizes-list');
  const cardGoodBuy = document.querySelector('.card-good__buy');

  const generateList = data => data.reduce((html, item, i) =>
  html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '');

  const renderCardGood = ([{ id, brand, name, cost, descr, color, sizes, photo }]) => {
    const data = { brand, name, cost, descr, id };
    cardGoodImage.src = `./images/goods-image/${photo}`;
    cardGoodImage.alt = `${brand} ${name}`;
    cardGoodBrand.textContent = brand;
    cardGoodTitle.textContent = name;
    cardGoodPrice.textContent = `${cost} RUB`;
    cardGoodDescr.textContent = descr;
    if (color) {
      cardGoodColor.textContent = color[0];
      cardGoodColor.dataset.id = 0;
      cardGoodColorList.innerHTML = generateList(color);
    }
    else {
      cardGoodColor.style.display = 'none';
    }
    if (sizes) {
      cardGoodSizes.textContent = sizes[0];
      cardGoodSizes.dataset.id = 0;
      cardGoodSizesList.innerHTML = generateList(sizes);
    }
    else{
      cardGoodSizes.style.display = 'none';
    }

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

  cardGoodSelectWrapper.forEach(item => {
    item.addEventListener('click', e => {
      const target = e.target;
      if (target.closest('.card-good__select')) {
        target.classList.toggle('card-good__select__open');
      }
      if (target.closest('.card-good__select-item')) {
        const cardGoodSelect = item.querySelector('.card-good__select');
        cardGoodSelect.textContent = target.textContent;
        cardGoodSelect.dataset.id = target.dataset.id;
        cardGoodSelect.classList.remove('card-good__select__open');
      }
    });
  });

  getGoods(renderCardGood, 'id', hash);
}
catch (err) {
  console.warn(err);
}
