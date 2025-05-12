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
        sortedBrands.forEach(brand => {
            const button = document.createElement('button');
            button.className = 'brand-button';
            button.textContent = brand;
            button.onclick = () => showModels(brand, carData);
            brandsContainer.appendChild(button);
        });
    });

function showModels(brand, carData) {
    const modelsContainer = document.getElementById('models-container');
    modelsContainer.innerHTML = `<h2>Models of ${brand}</h2>`;
    const models = new Set();

    for (const key in carData) {
        const [carBrand, model] = key.split('/');
        if (carBrand === brand) {
            models.add(model);
        }
    }

    models.forEach(model => {
        const modelButton = document.createElement('button');
        modelButton.className = 'model-button';
        modelButton.textContent = model;
        modelButton.onclick = () => showYears(brand, model, carData);
        modelsContainer.appendChild(modelButton);
    });
}

function showYears(brand, model, carData) {
    const modelsContainer = document.getElementById('models-container');

    // Очищаємо попередній вміст контейнера для років
    const existingYearsContainer = document.getElementById('years-container');
    if (existingYearsContainer) {
        existingYearsContainer.remove();
    }

    // Створюємо новий контейнер для років
    const yearsContainer = document.createElement('div');
    yearsContainer.id = 'years-container'; // Додаємо ID для контейнера
    yearsContainer.innerHTML = `<h3>Years of ${brand} ${model}</h3>`;
    const years = new Set();

    // Витягуємо роки для вибраної моделі
    for (const key in carData) {
        const [carBrand, carModel, year] = key.split('/');
        if (carBrand === brand && carModel === model) {
            years.add(year);
        }
    }

    // Сортуємо роки
    const sortedYears = Array.from(years).sort((a, b) => a - b);

    // Додаємо кнопки для кожного року
    sortedYears.forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.className = 'year-button';
        yearButton.textContent = year;
        yearButton.onclick = () => showImages(brand, model, year, carData);
        yearsContainer.appendChild(yearButton);
    });

    modelsContainer.appendChild(yearsContainer);
}

function showImages(brand, model, year, carData) {
    const modelsContainer = document.getElementById('models-container');
    const imagesContainer = document.createElement('div');
    imagesContainer.innerHTML = `<h3>Images of ${brand} ${model} (${year})</h3>`;

    let imagesFound = false;
    const images = []; // Масив для зберігання всіх зображень

    for (const key in carData) {
        const [carBrand, carModel, carYear] = key.split('/');
        if (carBrand === brand && carModel === model && carYear === year) {
            const img = document.createElement('img');
            img.src = carData[key];
            img.style.margin = '10px';
            img.style.width = '200px';
            img.style.height = '150px';
            img.style.objectFit = 'cover';

            // Перевірка розміру зображення перед додаванням
            img.onload = () => {
                if (img.naturalWidth > 10 && img.naturalHeight > 10) {
                    images.push(carData[key]); // Додаємо URL зображення до масиву
                    img.onclick = () => openImageInModal(img.src, images); // Передаємо масив зображень
                    imagesContainer.appendChild(img);
                    imagesFound = true;
                }
            };

            img.onerror = () => {
                console.warn(`Image failed to load: ${carData[key]}`);
            };
        }
    }

    if (!imagesFound) {
        const message = document.createElement('p');
        message.textContent = 'No images found for this selection.';
        imagesContainer.appendChild(message);
    }

    modelsContainer.appendChild(imagesContainer);
}

function openImageInModal(src, images) {
    let currentIndex = images.indexOf(src);

    // Створюємо накладку
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.onclick = () => overlay.remove(); // Закриття при натисканні на фон

    // Створюємо контейнер для модального вікна
    const modal = document.createElement('div');
    modal.className = 'image-modal';

    // Створюємо зображення
    const fullImage = document.createElement('img');
    fullImage.src = src;
    fullImage.className = 'modal-image';

    // Створюємо кнопки для навігації
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = 'modal-nav-button';
    prevButton.onclick = (e) => {
        e.stopPropagation(); // Запобігаємо закриттю модального вікна
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Перехід до попереднього зображення
        fullImage.src = images[currentIndex];
    };

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'modal-nav-button';
    nextButton.onclick = (e) => {
        e.stopPropagation(); // Запобігаємо закриттю модального вікна
        currentIndex = (currentIndex + 1) % images.length; // Перехід до наступного зображення
        fullImage.src = images[currentIndex];
    };

    // Додаємо елементи до модального вікна
    modal.appendChild(prevButton);
    modal.appendChild(fullImage);
    modal.appendChild(nextButton);
    overlay.appendChild(modal);

    // Додаємо накладку до тіла сторінки
    document.body.appendChild(overlay);
}