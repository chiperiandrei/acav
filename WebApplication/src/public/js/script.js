'use strict';

window.onload = _ => {
    const menuElement = document.getElementById('menu');
    let menuShown = false;

    if (menuElement) {
        const bodyElement = document.querySelector('body');
        const userElement = menuElement.parentElement;

        bodyElement.addEventListener('click', (e) => {
            const userId = e.target.getAttribute('id');
            const userClass = e.target.getAttribute('class');
            if (menuShown === true && (userId !== 'user' && userClass !== 'active')) {
                menuElement.classList.remove('ready');
                userElement.classList.remove('active');
                setTimeout(_ => {
                    menuElement.classList.remove('active');
                }, 200);
                menuShown = false;
            }
        });

        if (menuShown === false) {
            userElement.addEventListener('click', (e) => {
                userElement.classList.add('active');
                menuElement.classList.add('active');
                setTimeout(_ => {
                    menuElement.classList.add('ready');
                }, 10);
                menuShown = true;
            });
        }
    }
};

