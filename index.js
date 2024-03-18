let disableBtn = (btn) => btn.setAttribute('disabled', null);
let enableBtn = (btn) => btn.removeAttribute('disabled');

let carouselSettings = {
    default: {
        slideDelay: 4000,
        autoSlide: false,
        wrapAround: false,
        dots: false,
        marginTop: 0
    },
    carousels: {
        stagesCarousel: {
            data: {
                currentPage: 0,
                totalPages: 0,
                itemsToShow: 0
            },
            settings: {
                itemsToShow: {
                    mobile: 1,
                    desktop: 3
                },
                dots: true,
                marginTop: 148
            }
        },
        tournamentCarousel: {
            data: {
                currentPage: 0,
                totalPages: 0,
                itemsToShow: 0
            },
            settings: {
                itemsToShow: {
                    mobile: 1,
                    desktop: 3
                },
                autoSlide: true,
                slideDelay: 4000,
                wrapAround: true,
            }
        }
    }
};

window.onload = function(){
    let carousels = document.querySelectorAll('.carousel');

    for (let carousel of carousels) {
        initCarousel(carousel);
    }
};

const initCarousel = (carousel) => {
    const wrapAround = carouselSettings.carousels[carousel.id].settings.wrapAround ?? carouselSettings.default.wrapAround;
    const autoSlide = carouselSettings.carousels[carousel.id].settings.autoSlide ?? carouselSettings.default.autoSlide;
    const slideDelay = carouselSettings.carousels[carousel.id].settings.slideDelay ?? carouselSettings.default.slideDelay;
    const dots = carouselSettings.carousels[carousel.id].settings.dots ?? carouselSettings.default.dots;
    const marginTop = carouselSettings.carousels[carousel.id].settings.marginTop ?? carouselSettings.default.marginTop;

    let getPrevBtn = () => {
        let prevBtn = document.getElementById(carousel.id + 'PrevBtn');
        prevBtn = prevBtn.offsetHeight > 0 ? prevBtn : document.getElementById(carousel.id + 'MobilePrevBtn');

        return prevBtn;
    };
    let getNextBtn = () => {
        let nextBtn = document.getElementById(carousel.id + 'NextBtn')
        nextBtn = nextBtn.offsetHeight > 0 ? nextBtn : document.getElementById(carousel.id + 'MobileNextBtn');

        return nextBtn;
    };

    const currentPage = () => {
        let currentPage = document.getElementById(carousel.id + 'CurrentPage')
        currentPage = currentPage.offsetHeight > 0 ? currentPage : document.getElementById(carousel.id + 'MobileCurrentPage');

        return currentPage;
    };
    const totalPages = () => {
        let totalPage = document.getElementById(carousel.id + 'TotalPages')
        totalPage = totalPage.offsetHeight > 0 ? totalPage : document.getElementById(carousel.id + 'MobileTotalPages');

        return totalPage;
    };

    let setPage = (page) => {
        carouselSettings.carousels[carousel.id].data.currentPage = page;

        if (dots) {
            for (let i = 0; i < getTotalPages(); i++) {
                let index = (i + 1);
                let dot = document.getElementById(`${ carousel.id }Dot${ index }`);

                if (page === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            }
        } else {
            currentPage().innerText = String(page * getItemsToShow());
        }

        for (let i = 0; i < carousel.children.length; i++) {
            let child = carousel.children[i];

            const showItems = getItemsToShow() - (page === 1 ? 1 : 0);
            let startIndex = (page * showItems) - showItems;
            let endIndex = startIndex + showItems - (page > 1 ? 1 : 0);

            if (i >= startIndex && i <= endIndex) {
                child.style.order = String(-1);
                child.style.display = 'block';
            } else {
                child.style.order = String(9999);
                child.style.display = 'none';
            }
        }
    };
    const getPage = () => carouselSettings.carousels[carousel.id].data.currentPage;
    let setTotalPages = (pages) => {
        carouselSettings.carousels[carousel.id].data.totalPages = pages;

        if (!dots) {
            totalPages().innerText = String(pages * getItemsToShow());
        }
    }

    const getTotalPages = () => carouselSettings.carousels[carousel.id].data.totalPages;
    const getItemsToShow = () => carouselSettings.carousels[carousel.id].data.itemsToShow;
    const setItemsToShow = (itemsToShow) => {
        carouselSettings.carousels[carousel.id].data.itemsToShow = itemsToShow;
        carousel.style.gridTemplateColumns = `repeat(${ itemsToShow }, minmax(0, 1fr))`;
    }

    const prevPage = () => {
        if(getPage() > 1) {
            setPage(getPage() - 1);

            enableBtn(getNextBtn());
            if (getPage() === 1 && !wrapAround) {
                disableBtn(getPrevBtn());
            }
        } else if (wrapAround) {
            setPage(getTotalPages());
        }
    }

    const nextPage = () => {
        if(getPage() < getTotalPages()) {
            setPage(getPage() + 1);

            enableBtn(getPrevBtn());
            if (getPage() === getTotalPages() && !wrapAround) {
                disableBtn(getNextBtn());
            }
        } else if (wrapAround) {
            setPage(1);
        }
    }

    const setCarouselHeight = () => {
        let height = 0;
        for (let i = 0; i < carousel.children.length; i++) {
            let child = carousel.children[i];

            if(child.offsetHeight > height) {
                height = child.offsetHeight;
            }
        }

        carousel.style.height = `${ height + marginTop }px`;
    }

    const createDots = () => {
        let dotsContainer = document.getElementById('stagesCarouselDots');

        while (dotsContainer.firstChild) {
            dotsContainer.firstChild.remove()
        }

        for (let i = 0; i < getTotalPages(); i++) {
            dotsContainer.insertAdjacentHTML('beforeend', `<div class="carousel-dot" id="${ carousel.id }Dot${ (i + 1) }"></div>`);
        }
    }

    let interval;
    const initParams = () => {
        if (!getNextBtn() || !getPrevBtn()) {
            return;
        }

        getPrevBtn().addEventListener('click', prevPage);
        getNextBtn().addEventListener('click', nextPage);

        // set carousel height
        setCarouselHeight();
        // set items per page
        setItemsToShow(carouselSettings.carousels[carousel.id].settings.itemsToShow[window.innerWidth > 1024 ? 'desktop' : 'mobile']);

        setTotalPages(carousel.childElementCount / getItemsToShow());
        if (dots) {
            createDots();
        }

        setPage(getPage() !== 0 ? getPage() : 1);

        if (!wrapAround) {
            if (getPage() === 1) {
                disableBtn(getPrevBtn());
            }

            if(getTotalPages() <= 1) {
                disableBtn(getNextBtn());
            }
        }

        if(autoSlide && !interval) {
            interval = setInterval(nextPage, slideDelay);
        }
    }

    initParams();
    window.addEventListener('resize', () => initParams());
};