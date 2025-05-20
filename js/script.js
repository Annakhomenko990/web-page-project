let currentImageIndex = 0;
let currentImages = [];

// Load data from sample.json
fetch('js/image_sources.json')
    .then(response => response.json())
    .then(carData => {
        const brands = new Set();
        for (const key in carData) {
            const brand = key.split('/')[0];
            brands.add(brand);
        }

        const sortedBrands = Array.from(brands).sort();
        const brandsContainer = document.getElementById('brands-container');
        brandsContainer.innerHTML = '';
        sortedBrands.forEach(brand => {
            const button = document.createElement('button');
            button.className = 'brand-button';
            button.textContent = brand;
            button.onclick = () => showModels(brand, carData);
            brandsContainer.appendChild(button);
        });
        // Очищаємо інші колонки
        document.getElementById('models-container').innerHTML = '';
        document.getElementById('years-container').innerHTML = '';
        document.getElementById('images-container').innerHTML = '';
    });

function showModels(brand, carData) {
    const modelsContainer = document.getElementById('models-container');
    modelsContainer.innerHTML = '';
    const yearsContainer = document.getElementById('years-container');
    yearsContainer.innerHTML = '';
    const models = new Set();

    for (const key in carData) {
        const [carBrand, model] = key.split('/');
        if (carBrand === brand) {
            models.add(model);
        }
    }

    Array.from(models).sort().forEach(model => {
        const modelButton = document.createElement('button');
        modelButton.className = 'model-button';
        modelButton.textContent = model;
        modelButton.onclick = () => showYears(brand, model, carData);
        modelsContainer.appendChild(modelButton);
    });

    document.getElementById('images-container').innerHTML = '';
}

function showYears(brand, model, carData) {
    const yearsContainer = document.getElementById('years-container');
    yearsContainer.innerHTML = '';
    const years = new Set();

    for (const key in carData) {
        const [carBrand, carModel, year] = key.split('/');
        if (carBrand === brand && carModel === model) {
            years.add(year);
        }
    }

    Array.from(years).sort((a, b) => a - b).forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.className = 'year-button';
        yearButton.textContent = year;
        yearButton.onclick = () => showImages(brand, model, year, carData);
        yearsContainer.appendChild(yearButton);
    });

    document.getElementById('images-container').innerHTML = '';
}

function showImages(brand, model, year, carData) {
    const imagesContainer = document.getElementById('images-container');
    imagesContainer.innerHTML = '';

    // Додаємо спінер
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    document.body.appendChild(spinner);

    setTimeout(() => {
        spinner.remove();

        // Збираємо всі зображення для вибраного року
        const allImages = [];
        for (const key in carData) {
            const [carBrand, carModel, carYear] = key.split('/');
            if (carBrand === brand && carModel === model && carYear === year) {
                allImages.push(carData[key]);
            }
        }

        let currentPage = 0;
        const imagesPerPage = 15; // Було 9, стало 15

        function filterValidImages(imageUrls, callback) {
            const validImages = [];
            let checked = 0;
            if (imageUrls.length === 0) callback([]);
            imageUrls.forEach(src => {
                const img = new window.Image();
                img.src = src;
                img.onload = function() {
                    if (img.naturalWidth >= 10 && img.naturalHeight >= 10) {
                        validImages.push(src);
                    }
                    checked++;
                    if (checked === imageUrls.length) {
                        callback(validImages);
                    }
                };
                img.onerror = function() {
                    checked++;
                    if (checked === imageUrls.length) {
                        callback(validImages);
                    }
                };
            });
        }

        function renderPage(validImages) {
            imagesContainer.innerHTML = '';
            const start = currentPage * imagesPerPage;
            const end = start + imagesPerPage;
            const pageImages = validImages.slice(start, end);

            pageImages.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.style.margin = '10px';
                img.style.width = '200px';
                img.style.height = '150px';
                img.style.objectFit = 'cover';
                img.onclick = () => openImageInModal(img.src, validImages);
                imagesContainer.appendChild(img);
            });

            // Кнопки пагінації
            const pagination = document.createElement('div');
            pagination.style.textAlign = 'center';
            pagination.style.marginTop = '20px';

            if (currentPage > 0) {
                const prevBtn = document.createElement('button');
                prevBtn.textContent = 'Previous';
                prevBtn.onclick = () => {
                    currentPage--;
                    renderPage(validImages);
                };
                pagination.appendChild(prevBtn);
            }

            if (end < validImages.length) {
                const nextBtn = document.createElement('button');
                nextBtn.textContent = 'Next';
                nextBtn.style.marginLeft = '10px';
                nextBtn.onclick = () => {
                    currentPage++;
                    renderPage(validImages);
                };
                pagination.appendChild(nextBtn);
            }

            if (pagination.children.length > 0) {
                imagesContainer.appendChild(pagination);
            }
        }

        filterValidImages(allImages, renderPage);
    }, 3000);
}

function openImageInModal(src, images) {
    // Видаляємо попередній оверлей, якщо він є
    const oldOverlay = document.querySelector('.image-overlay');
    if (oldOverlay) oldOverlay.remove();

    // Створюємо оверлей
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';

    // Створюємо контейнер для модального вікна
    const modal = document.createElement('div');
    modal.className = 'image-modal';

    // Створюємо зображення
    const modalImg = document.createElement('img');
    modalImg.className = 'modal-image';
    modalImg.src = src;

    // Додаємо зображення в модал
    modal.appendChild(modalImg);

    // БЕЗ кнопок навігації

    // Закриття по кліку на фон
    overlay.onclick = function(e) {
        if (e.target === overlay) overlay.remove();
    };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

document.addEventListener('DOMContentLoaded', function() {
    const commentBox = document.getElementById('comment-box');
    if (commentBox) {
        commentBox.addEventListener('focus', function() {
            this.placeholder = '';
        });
        commentBox.addEventListener('blur', function() {
            if (!this.value) this.placeholder = 'Comment...';
        });
    }
});