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
    modelsContainer.innerHTML = `<h2>Years of ${brand} ${model}</h2>`;
    const years = new Set();

    for (const key in carData) {
        const [carBrand, carModel, year] = key.split('/');
        if (carBrand === brand && carModel === model) {
            years.add(year);
        }
    }

    years.forEach(year => {
        const yearButton = document.createElement('button');
        yearButton.className = 'year-button';
        yearButton.textContent = year;
        yearButton.onclick = () => showGallery(brand, model, year, carData);
        modelsContainer.appendChild(yearButton);
    });
}

function showGallery(brand, model, year, carData) {
    currentImages = [];
    for (const key in carData) {
        const [carBrand, carModel, carYear] = key.split('/');
        if (carBrand === brand && carModel === model && carYear === year) {
            currentImages.push(carData[key]);
        }
    }

    if (currentImages.length > 0) {
        currentImageIndex = 0;
        updateGalleryImage();
        document.getElementById('gallery-container').style.display = 'block';
    }
}

function updateGalleryImage() {
    const galleryImage = document.getElementById('gallery-image');
    galleryImage.src = currentImages[currentImageIndex];
}

document.getElementById('prev-button').onclick = () => {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateGalleryImage();
    }
};

document.getElementById('next-button').onclick = () => {
    if (currentImageIndex < currentImages.length - 1) {
        currentImageIndex++;
        updateGalleryImage();
    }
};