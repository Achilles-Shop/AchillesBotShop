let hash = window.location.hash.substring(1);

// Запрос в базу данных
const getData = async () => {
  try {
    const data = await fetch('db.json');

    if (!data.ok) {
      throw new Error(`Данные не были получены. Ошибка: ${data.status} ${data.statusText}`);
    }

    return data.json();
  } catch (error) {
    console.error(error);
  }
};

// Формирование товаров по категориям
const getGoods = (callback, prop, value) => {
  getData()
    .then(data => {
      console.log(data); // Добавьте эту строку
      if (value) {
        callback(data.filter(item => item[prop] === value));
      } else {
        callback(data);
      }
    })
    .catch(err => {
      console.error(err);
    });
};

// Обработчик события смены хэша
const handleHashChange = () => {
  hash = location.hash.substring(1);
  getGoods(renderGoodsList, 'category', hash);
  changeTitle();
};

// Инициализация страницы товаров
const initGoodsPage = () => {
  const goodsList = document.querySelector('.goods__list');
  const goodsTitle = document.querySelector('.goods__title');

  // Изменение заголовка при смене хэша
  const changeTitle = () => {
    goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
  };

  // Формирование карточки товара
  const createCard = ({ id, preview, cost, brand, name, sizes }) => {
    const li = document.createElement('li');
    li.classList.add('goods__item');
    li.innerHTML = `
      <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
          <img class="good__img" src="./images/goods-image/${preview}" alt="">
        </a>
        <div class="good__description">
          <p class="good__price">${cost} &#8381;</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
          ${sizes ?
            `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
            ''}
          <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
      </article>
    `;
    return li;
  };

  // Рендер списка товаров
  const renderGoodsList = data => {
    goodsList.textContent = '';
    data.forEach(item => {
      const card = createCard(item);
      goodsList.append(card);
    });
  };

  // Обработчик смены хэша
  window.addEventListener('hashchange', handleHashChange);

  // Начальная загрузка товаров
  getGoods(renderGoodsList, 'category', hash);
  changeTitle();
};

try {
  initGoodsPage();
} catch (err) {
  console.warn(err);
}

// Другие части кода (карточка товара) оставьте без изменений.
