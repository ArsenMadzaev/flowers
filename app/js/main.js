const body = document.body;
const app = function () {
    return {
        init: () => {
            // Тут подключаются функции
                app.Submenu(),
                app.MobMenu(),
                app.arrowTop(),
                app.ClickOutside(),
                app.FeedbackForm(),
                app.Accordion(),
                app.ScrollHeaderFix(),
                app.ScrolltoObject()
                // app.PopupInit('popupFeedback')
        },

        // Показать BackGround
        BackgroundShow: () => {
            body.classList.add('popup__show');
        },

        // Скрыть Background
        BackgroundHide: () => {
            body.classList.remove('popup__show');
        },

        arrowTop: () => {
            window.addEventListener('scroll', app.Throttle(() => {
                window.scrollY > 500
                    ? body.classList.add('show__arrow')
                    : body.classList.remove('show__arrow')
            }, 300))
        },

        // Работа с Background при вызове SubMenu
        Submenu: () => {
            let items = Array.from(document.querySelectorAll(".header__submenu")).map(i => i.parentNode);
            if(items){
                for (i = 0; i < items.length; i++) {
                    items[i].addEventListener('mouseenter', () => {
                        app.BackgroundShow();
                    })
                    items[i].addEventListener('mouseleave', () => {
                        app.BackgroundHide();
                    })
                }
            }
        },
        
        // Работа с мобильным меню
        MobMenu: () => {
            let item__open = document.querySelector('.header__mobile-burger');
           
            if(item__open){
                item__open.addEventListener('click', () => {
                    item__open.classList.toggle('header__mobile-burger--active');
                    if (item__open.classList.contains('header__mobile-burger--active')) {
                        app.MobMenuOpen();
                    } else {
                        app.MobMenuClose();
                    }
                });
            }
        },

        // Открываем мобильное меню
        MobMenuOpen: () => {
            body.classList.add('show__navbar');
            app.LockScreen();
        },

        // Закрываем мобильное меню
        MobMenuClose: () => {
            body.classList.remove('show__navbar');
            app.UnlockScreen();
        },

        /**
         * Инициализрует popup окно которое следует стандартной HTML структуре
         * @param {string} popupId - ID попап элемента
        */
        PopupInit: (popupId) => {
            let popup = document.querySelector(`#${popupId}`);
            if (popupId) {
                let openBtns = document.querySelectorAll(`button[data-button-for-id="${popupId}"]`);
                closeBtn = popup.querySelector('.popup__close');

                openBtns.forEach((openButton) => {
                    openButton.addEventListener('click', (e) => {
                        popup.style.display = 'block';
                        app.BackgroundShow();
                        app.LockScreen();
                    });
                });

                closeBtn.addEventListener('click', (e) => {
                    popup.removeAttribute('style');
                    app.BackgroundHide();
                    app.UnlockScreen();
                });
            }
        },
        
        /**
         * Удаляет определенный класс у всех элементов ноды
         * @param {object} listNode - Массив или объект элементов
         * @param {string} className - Имя класса
        */
        ResetClassOnListItems: (listNode, className) => {
            try {
                arrayList = Array.from(listNode);
                for (select of arrayList) {
                    select.classList.remove(className);
                }
            }
            catch(e) {
                console.error(e);
            }
        },

        /**
         * Устанавливает определенный aria атрибут всем элементам ноды 
         * @param {object} listNode - Массив или объект элементов
         * @param {string} ariaAtr - Aria атрибут
         * @param {string} ariaValue - Значение aria атрибута
        */
        SetAriaAtrOnListItems: (listNode, ariaAtr, ariaValue) => {
            try {
                arrayList = Array.from(listNode);
                for (select of arrayList) {
                    select.setAttribute(ariaAtr, ariaValue);
                }
            }
            catch(e) {
                console.error(e);
            }
        },

        // Блочим скролл 
        LockScreen: () => {
            let paddingWidth = window.innerWidth - document.getElementsByTagName('html')[0].clientWidth + 'px';
            if (document.querySelector('.header--fixed')){
                document.querySelector('.header--fixed').style.paddingRight = paddingWidth;
            };
            body.style.paddingRight = paddingWidth;
            body.classList.add('lock__screen');
        },

        // Разлочим скролл
        UnlockScreen: () => {
            if (document.querySelector('.header--fixed')){
                document.querySelector('.header--fixed').style.paddingRight = null;
            };
            body.style.paddingRight = null;
            body.classList.remove('lock__screen');
        },

        // Клик вне блока.
        ClickOutside: () => {
            let overlay = document.querySelector('.overlay-blur');
            if(overlay){
                overlay.addEventListener('click', () => {
                    app.MobMenuClose();
                })
            }
        },

        //Фиксация хедера при скролле
        ScrollHeaderFix: () => {
            let header = document.querySelector('.header');

            let offset = document.querySelector('.main-banner').offsetHeight ;
            console.log(offset);
            window.onscroll = function() {
                if (window.scrollY > offset-10 && window.innerWidth <= 1200) {
                    body.style.marginTop = header.offsetHeight + 'px';
                    header.classList.add("header--fixed");
                } else if(window.scrollY < offset-20) {
                    body.style.marginTop = null;
                    header.classList.remove("header--fixed");
                }
            }
        },

        // Форма аутентификации
        Accordion: () => {
            let accordionWrap = document.querySelector('.accordion__wrapper');
            if(accordionWrap){
                accordionItems = document.querySelectorAll('.accordion__item');
                accordionItems.forEach((accordionItem) => {
                    accordionItem.querySelector('.accordion__header').addEventListener('click', (e) => {
                        accordionItem.classList.toggle('accordion__item--active');
                    })
                })

            }
        },

        // Форма обратной связи
        FeedbackForm: () => {
            const forms = document.querySelectorAll('[data-form="feedback"]');

            if (forms) {
                forms.forEach((form) => {
                    let button = form.querySelector('button[type="submit"]');
                    let inputsForm = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"])');
                    let areaText = form.querySelector('textarea');
                    let checkbox = form.querySelector('input[type="checkbox"]');

                    app.FormValidate();
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        if(app.FormControl(button)){
                            let form_result = form.querySelector('.form-result');
                            let sendData = new FormData(form);        
                            
                            button.classList.add('loading');
                            button.setAttribute('disabled', '');
                
                            FetchRequest('test.php', sendData)
                                .then(data => {
                                    //Состояния кнопки отправки
                                    button.classList.remove('loading');
                                    button.removeAttribute('disabled');
                                    //Сброс полей формы
                                    for(i=0; i < inputsForm.length; i++) {
                                        inputsForm[i].value = '';
                                    }
                                    checkbox.checked = 'false';
                                    areaText.value = '';
                                    //Если статус успешно
                                    if (data.status) {
                                    //Логика успешного статуса
                                    }
                                    //Если статус неудачно
                                    if (!data.status) {
                                        form_result.innerHTML = data.text;
                                    }
                                    
                                })
                                .catch(error => {
                                    //Сброс полей формы
                                    for(i=0; i < inputsForm.length; i++) {
                                        inputsForm[i].value = '';
                                    }
                                    areaText.value = '';
                                    checkbox.checked = 'false';
                                    //Состояния кнопки отправки
                                    button.classList.remove('loading');
                                    button.removeAttribute('disabled');
                                    form_result.textContent = `Ошибка - ${error}`;
                                })
                        }
                    })
                })
            }
        },

        /**
         * Функция для Fetch запросов. Ошибки нужно рендерить через .error запроса, либо вызывать try/catch при запросе
         * @param {string} url - Адрес обработчика
         * @param {string} data - Данные
        */
        FetchRequest: (url, data) => {
            // Если это FormData.
            if (data.constructor.name === "FormData") {
            let FormData = Object.fromEntries(data.entries());
            data = JSON.stringify(FormData);
            } else {
            data = JSON.stringify(data);
            }
            let RequestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: data,
            };
            return fetch(url, RequestOptions).then((response) => response.json());
        },

        //Функция валидации ввода
        FormValidate: () => {
            [].forEach.call(document.querySelectorAll('[type="phone"]'), function (input) {
                let keyCode;
              
                function mask(event) {
                  event.keyCode && (keyCode = event.keyCode);
                  let pos = this.selectionStart;
              
                  if (pos < 3) event.preventDefault();
              
                  let matrix = "+7 (___)-___-__-__",
                    i = 0,
                    def = matrix.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, ""),
                    new_value = matrix.replace(/[_\d]/g, function (a) {
                      return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                    });
              
                  i = new_value.indexOf("_");
              
                  if (i != -1) {
                    i < 5 && (i = 3);
                    new_value = new_value.slice(0, i);
                  }
              
                  let reg = matrix
                    .substr(0, this.value.length)
                    .replace(/_+/g, function (a) {
                      return "\\d{1," + a.length + "}";
                    })
                    .replace(/[+()]/g, "\\$&");
              
                  reg = new RegExp("^" + reg + "$");
              
                  if (
                    !reg.test(this.value) ||
                    this.value.length < 5 ||
                    (keyCode > 47 && keyCode < 58)
                  )
                    this.value = new_value;
              
                  if (event.type == "blur" && this.value.length < 5) this.value = "";
                }
              
                ['input', 'focus', 'blur', 'keydown'].forEach((event) => input.addEventListener(event, mask, false));
            });

            [].forEach.call(document.querySelectorAll('[type="text"]'), function (input) {
                let keyCode;
            
                function mask(event) {
                    event.keyCode && (keyCode = event.keyCode);
                    let pos = this.selectionStart;
            
                    if (pos < 3 && event.key.length === 1 && !event.key.match(/[а-яА-Я]/)) {
                        event.preventDefault();
                        return;
                    }
            
                    let val = this.value.replace(/[^а-яА-Я]/g, ""); // Только русские буквы
            
                    if (val.length > 0) {
                        this.value = val;
                    } else if (event.type == "blur" && this.value.length < 5) {
                        this.value = "";
                    }
                }
            
                ['input', 'focus', 'blur', 'keydown'].forEach((event) => input.addEventListener(event, mask, false));
            });
        },
        
        /**
         * Для проверки форм (Если обратить внимание, то он находит родителей кнопки). Семантика обязательно должна быть соблюдена!!!
         * @param {object} itemSubmit - Элемент отправки формы
        */
        FormControl: (item__submit) => {
            let result = [],
                find__error = false
            let children = item__submit.closest('form');

            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('required')) {
                    if (children[i].value === '') {
                      
                        children[i].parentNode.classList.add('error');
                        result += false;
                    }
                    else if (children[i].type === 'phone' && children[i].value.length < 18) {
                        children[i].parentNode.classList.add('error');
                        result += false;
                    }
                    else if (children[i].type === 'email' && !(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(String(children[i].value).toLowerCase()))) {
                        children[i].parentNode.classList.add('error');
                        result += false;
                    }
                    else if (children[i].type === 'checkbox' && !children[i].checked) {
                        children[i].parentNode.classList.add('error');
                        result += false;
                    }
                    else {
                        children[i].parentNode.classList.remove('error');
                        result += true;
                    }
                }
            }
            find__error = result.includes(false);
            if (find__error === false) {
                find__error = true
            }
            else {
                find__error = false
            }
            return find__error;
        },
        
        // Проверим, мобилка ли
        IsMobile: () => {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        },
        
        // стандартный smooth скролл до объекта.
        ScrolltoObject: () => {
            let items = document.querySelectorAll('[data-scroll]');
            for (i = 0; i < items.length; i++) {
                let item = items[i];
                item.addEventListener('click', (e) => {
                    let link = item.dataset.scroll;
                    if (link === 'this') {
                        e.target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                    else {
                        document.querySelector(link).scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }

                })
            }
        },

        // Игнорирует вызовы передаваемой функции пока не пройдет определенное ожидание
        Throttle: (func, ms) => {
            let locked = false
            return function () {
                if (locked) return
                const context = this
                const args = arguments
                locked = true
                setTimeout(() => {
                    func.apply(context, args)
                    locked = false
                }, ms)

            }
        },
        
        // Игнорирование вызовов передаваемой функции (resize, scroll, keydown)
        Debounce: function (func, ms, now) {
            let onLast
            return function () {
                const context = this
                const args = arguments
                const onFirst = now && !onLast
                clearTimeout(onLast)
                onLast = setTimeout(() => {
                    onLast = null
                    if (!now) func.apply(context, args)
                }, ms)
                if (onFirst) func.apply(context, args)
            }
        },
    }
}();

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    app.init();
});

