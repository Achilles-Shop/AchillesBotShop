document.addEventListener('DOMContentLoaded', function () {

  // Хэш элемент для изменения содержимого страниц
  let hash = location.hash.substring(1);

  
// Закрытие меню  
  function toggleDropdown() {
        var dropdown = document.getElementById("myDropdown");
        dropdown.classList.toggle("show");
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
// Закрытие меню 

  
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
          <p class="good__price">${cost} RUB</p>
          <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
       
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

  const swiper = new Swiper('.swiper', {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
    },
  });

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
  
  
  

  
    const renderCardGood = ([{ id, brand, name, cost, descr, color, sizes, photos }]) => {
      const data = { brand, name, cost, descr, id };
      cardGoodImage.alt = `${brand} ${name}`;
      cardGoodBrand.textContent = brand;
      cardGoodTitle.textContent = name;
      cardGoodPrice.textContent = `${cost} RUB`;
      cardGoodDescr.textContent = descr;
  

        // слайдер--------------------------------------------------
      const swiperWrapper = document.querySelector('.swiper-wrapper');
      // Очищаем содержимое слайдера перед добавлением новых слайдов
      swiperWrapper.innerHTML = '';
      // Для каждой фотографии в массиве photos создаем новый слайд
      photos.forEach(photo => {
        const slide = document.createElement('div');
        slide.classList.add('swiper-slide');
        slide.innerHTML = `<img src="./images/goods-image/${photo}">`;
        swiperWrapper.appendChild(slide);
      });
       // слайдер--------------------------------------------------
   
  



  
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
  
    
    };
  
    cardGoodSelectWrapper.forEach(item => {
      item.addEventListener('click', e => {
        const target = e.target;
        if (target.closest('.card-good__select')) {
          target.classList.toggle('card-good__select__open');
        }
        
      });
    });
  
    
    getGoods(renderCardGood, 'id', hash);
  } catch (err) {
    console.warn(err);
  }











  });
