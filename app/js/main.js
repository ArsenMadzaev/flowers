const body = document.body;
const app = function () {
    return {
        init: () => {
            // Тут подключаются функции
                app.Submenu(),
                app.MobMenu(),
                app.FeedbackFormEvent(),
                app.ClickOutside(),
                app.FeedbackForm(),
                app.GcaptchaRender()
        },

        // Показать BackGround
        BackgroundShow: () => {
            body.classList.add('popup__show');
        },

        // Скрыть Background
        BackgroundHide: () => {
            body.classList.remove('popup__show');
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
            let item__open = document.querySelector('.header__menu-button');
            let item__close = document.querySelector('.mobile-menu__close');
            let mobileMenuItems = document.querySelectorAll('.mobile-menu__link');

            Array.from(mobileMenuItems).forEach((item) => {
                item.addEventListener('click', app.MobMenuClose);
            })

            if(item__open){
                item__open.addEventListener('click', app.MobMenuOpen);
            }
            if(item__close){
                item__close.addEventListener('click', app.MobMenuClose);
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

        // Закрываем мобильное меню
        GcaptchaRender: () => {
            const captchaItems = {
                items: [
                  document.querySelector("#g-recatpcha-pricing"),
                ],
            };
            setTimeout(function () {
                if (typeof grecaptcha === 'undefined' || typeof grecaptcha.render ==='undefined') {
                    app.GcaptchaRender();
                } else {
                    if (captchaItems.items.length > 0) {
                        for (i = 0; i < captchaItems.items.length; i++) {
                          if (!captchaItems.items[i]) continue;
                          let item = captchaItems.items[i];
                          window.item = grecaptcha.render(item, {
                            sitekey: "6Lev1yopAAAAAEpsW1GVcQ3aNKe4HZ6YKQp-oh-3",
                            // 'callback': function (response) {
                            //   console.log(response)
                            //   // app.Captcha.WordCallback(response, item)
                            // },
                            theme: "light",
                          });
                          item.dataset.captchaId = window.item;
                        }
                    }
                }
            }.bind(this), 100);
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

        // Открываем мобильное меню
        PopupOpen: () => {
            body.classList.add('popup__show');
            app.LockScreen();
        },

        // Закрываем мобильное меню
        PopupClose: () => {
            body.classList.remove('popup__show');
            app.UnlockScreen();
        },

        // Работа с формой
        FeedbackFormEvent: () => {
            let popupClose = document.querySelector('.popup__close');
            let formOpenBtns = document.querySelectorAll('.calc-btn');
            const popupForm = document.querySelector('#popupForm');

            Array.from(formOpenBtns).forEach((item) => {
                
                item.addEventListener('click', (e) => {
                    popupForm.style.display = "block";
                    app.PopupOpen();
                });
            })
            if(popupClose){
                popupClose.addEventListener('click',  (e) => {
                    popupForm.style.display = "none";
                    app.PopupClose();
                });
            }
        },

        // Форма заказа
        FeedbackForm: () => {
            const form = document.querySelector('form#feedBack');
            if (form) {
                let button = form.querySelector('button[type="submit"]');
                let inputsForm = form.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"])');
                let areaText = form.querySelector('textarea');
                let checkbox = form.querySelector('input[type="checkbox"]');
                let formWrapper = form.parentElement;

                [].forEach.call(document.querySelectorAll('.tel'), function (input) {
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
                  
                    input.addEventListener("input", mask, false);
                    input.addEventListener("focus", mask, false);
                    input.addEventListener("blur", mask, false);
                    input.addEventListener("keydown", mask, false);
                  });
                  

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if(app.FormControl(button)){
                        button.disabled = true;
                        (async () => {
                            let sendData = new FormData(form);
                            let form_result = form.querySelector('.form__result');

                            let url = 'send.php'; 
                            try{
                            let response = await fetch(url, { 
                                method: 'POST', 
                                body: sendData,
                                });

                                let data = await response.json();
                                
                                //Сброс полей формы
                                for(i=0; i < inputsForm.length; i++) {
                                    inputsForm[i].value = '';
                                }
                                checkbox.checked = false;
                                areaText.value = '';

                                // Reset капчи.
                                let captchaEl = document.querySelector('#g-recatpcha-pricing');
                                captchaEl
                                ? (grecaptcha.reset(captchaEl.dataset.captchaId), captchaEl.nextElementSibling.value = '')
                                : '';
                                
                                if (data.status) {
                                    button.disabled = false;
                                    form.querySelector('.g-recaptcha') ? form.querySelector('.g-recaptcha').parentElement.remove() : '';
                                    form_result.innerHTML = data.text;
                                    formWrapper.innerHTML = '<div class="form-success"><h3>Спасибо за заявку!</h3><br><p>Мы свяжемся с вами в ближайшее время<p></div>'
                                }
                                if (!data.status) {
                                    button.disabled = false;
                                    form_result.innerHTML = data.text;
                                }
                                    
                            } catch (error) {
                                button.disabled = false;
                                //Сброс полей формы
                                for(i=0; i < inputsForm.length; i++) {
                                    inputsForm[i].value = '';
                                }
                                checkbox.checked = false;
                                areaText.value = '';
                                //Состояния кнопки отправки
                                form_result.textContent = `Ошибка - ${error}`;
                            }
                            
                        })();
                    }
                })
            }
        },
        
        // Для проверки форм (Если обратить внимание, то он находит родителей кнопки). Семантика обязательно должна быть соблюдена!!!
        FormControl: (item__submit) => {
            let result = [],
                find__error = false
            let children = item__submit.closest('form');
            
            for (i = 0; i < children.length; i++) {
                if (children[i].hasAttribute('required')) {
                    if (children[i].value === '') {
                        children[i].classList.add('error');
                        result += false;
                        
                    }
                    else if (children[i].type === 'checkbox' && !children[i].checked) {
                        children[i].classList.add('error');
                        result += false;
                    }
                    else {
                        children[i].classList.remove('error');
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
        
    }
}();

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    app.init();
});


//sliders init
const mainSlider = new Swiper('.product-slider .swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    preloadImages: false,
    lazy: true,
    lazy: {
        loadPrevNext: true, 
        loadPrevNextAmount: 2,
    },

    watchSlidesProgress: true,

    watchSlidesVisibility: true,

    breakpoints: {
      // Добавьте дополнительные настройки для разных разрешений экрана
      576: {
        slidesPerView: 2,
      },

      992: {
        slidesPerView: 3,
      },

      1200: {
        slidesPerView: 4,
      },

      1400: {
        slidesPerView: 5,
      },

      1600: {
        slidesPerView: 6,
      },
    },
});

Fancybox.bind('[data-fancybox]', {
   
});    

