//очищаем все классы размеров определенного товара
function clearClassToSizes(sizesArr) {
    sizesArr.forEach(function (item){
        if (item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });
    //возвращаем заголовок "РАЗМЕРЫ" на место
    sizesArr[0].parentElement.previousElementSibling.innerHTML = "РАЗМЕРЫ";
}
//считываем размеры, делаем активный размер
function activeSize() {
    const productSizes = document.querySelectorAll('.product-size');
    productSizes.forEach(item => {
        let sizes = item.childNodes;

        item.addEventListener('click', event => {
            if (event.target.classList.contains('size')) {
                //убираем у остальных класс
                clearClassToSizes(sizes);
                //добавляем класс выбранного
                event.target.classList.toggle('active')
            }
        });
    })
}
activeSize();
// переменные для корзины и отправки сообщения
var idNow, nameNow, imgNow, sizeNow, priceNow;

//слушаем кнопки купить
const btnArr = document.querySelectorAll('.btn-buy');
btnArr.forEach(item => {
    item.addEventListener('click', event => {
        productsCard.forEach(elem => {
            //находим товар на который кликнули
            if (elem.dataset.id === item.id ) {
                // записываем div с размерами данного товара
                let productSize = elem.querySelector('.product-size')
                // проверяем содержат ли размеры активные элементы
                if (productSize.querySelector('.active') == null) {
                    elem.querySelector('.product-size-titile').innerHTML = '<span class="alert alert-danger py-0 px-1">Выберите размер</span>';
                } else {
                    idNow = item.id;
                    nameNow =  elem.querySelector('.h5').innerHTML;
                    imgNow = elem.querySelector('.product-img img').src;
                    sizeNow = elem.querySelector('.product-size .active').innerHTML;
                    priceNow = elem.querySelector('.product-price').innerHTML;
                    showModalCart(idNow, nameNow, imgNow, sizeNow, priceNow);
                }
            }
        })
    })
})
// отправляем сообщение в telegram
function sendMessage(phone) {
    let message = "Артикул: " + idNow + "%0AРазмер: " + sizeNow + "%0AЦена: " + priceNow.slice(0,4) + "р.%0A" + phone;
    var token = "5588833453:AAFH83jOSCgzEQVZc5U9kJ02hgENqC3bF5w";
    var chat_id = "-778150313";
    var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${message}`;
    var tReq = new XMLHttpRequest();
    tReq.open("GET", url, true);
    tReq.send();
    tReq.onload = function () {
        if (tReq.status !== 200 ) {
            alertSendMessage(false, `Ошибка ${tReq.status}`);
        } else {
            alertSendMessage(true,'Заказ отправлен');
        }
    }
}
// уведомление об отправке и ошибки
const alertSendMessage = (status, message) => {
    let position = document.querySelector('.cart-product__title');
    let alert = document.createElement('div');
    status ? alert.className = 'alert alert-success mb-4 p-2' : alert.className = 'alert alert-danger mb-4 p-2';
    alert.innerHTML = message;
    position.after(alert);
    setTimeout(function () {
        alert.remove()
    }, 4000);
}
// отрисовываем корзину
var modalWrap = null;
const showModalCart = (id, name, img, size, price) => {
    if(modalWrap !== null) {
        modalWrap.remove();
    }
    modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
    <div class="modal fade" id="modalCart">
       <div class="modal-dialog modal-dialog-centered modal">
            <div class="modal-content p-2">
            <div class="row justify-content-between mt-2 mb-3 cart-product__title">
                <h5 class="col-auto modal-title">${name}</h5>
                <div class="col-auto">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>
            <div class="cart-product row justify-content-center justify-content-md-start">
                <div class="cart-product__image col-6 col-md-5">
                    <img class="img-fluid img-thumbnail mb-3 mb-md-0" src="${img}" alt="${name}">
                </div>
                <div class="cart-product__info col-6 col-md-7">
                    <div>
                        <p class="text-muted mb-2">Арт: ${id}</p>
                        <p class="mb-1">Размер: ${size}</p>
                    </div>
                    <div class="product-info__price">${price}</div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-10 col-sm-7 mt-2">
                        <label for="phoneInput" class="form-label mb-0">Телефон</label>
                        <input type="phone" id="phoneInput" class="form-control" placeholder="+7(909)-000-00-00">
                </div>
                <div class="col-5  col-sm-7 mt-3 text-center">
                    <button onclick='checkInputPhone()' class="btn btn-success w-100">Купить</button>
                </div>
            </div> 
            </div>
       </div>
    </div>
    `;
    document.body.append(modalWrap);
    var modal = new bootstrap.Modal(modalWrap.querySelector('.modal'));
    modal.show();

    //включаем проверку телефона по маске
    var inputPhone = document.getElementById('phoneInput');
    var maskOptions = {
        mask: '+{7}(000)000-00-00'
    };
    var mask = IMask(inputPhone, maskOptions);
}
//проверка телефона на пустоту
function checkInputPhone() {
    let input = document.getElementById('phoneInput').value
    if (input.length !== 0) {
        sendMessage(input);
    } else {
        alertSendMessage(false, 'Заполните поле телефон')
    }
}