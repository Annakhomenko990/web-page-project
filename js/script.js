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
    const yearsContainer = document.createElement('div');
    yearsContainer.innerHTML = `<h3>Years of ${brand} ${model}</h3>`;
    const years = new Set();

    for (const key in carData) {
        const [carBrand, carModel, year] = key.split('/');
        if (carBrand === brand && carModel === model) {
            years.add(year);
        }
    }

    const sortedYears = Array.from(years).sort((a, b) => a - b);

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
    for (const key in carData) {
        const [carBrand, carModel, carYear] = key.split('/');
        if (carBrand === brand && carModel === model && carYear === year) {
            const img = document.createElement('img');
            img.src = carData[key];
            img.style.margin = '10px';
            img.style.width = '200px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.onload = () => {
                if (img.naturalWidth === 1 && img.naturalHeight === 1) {
                    img.style.display = 'none';
                }
            };
            img.onerror = () => img.style.display = 'none';
            imagesContainer.appendChild(img);
            imagesFound = true;
        }
    }

    if (!imagesFound) {
        const message = document.createElement('p');
        message.textContent = 'No images found for this selection.';
        imagesContainer.appendChild(message);
    }

    modelsContainer.appendChild(imagesContainer);
}
function openImageInModal(src) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.onclick = () => overlay.remove(); // Close on clicking the background

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'image-modal';

    // Create image element
    const fullImage = document.createElement('img');
    fullImage.src = src;
    fullImage.className = 'modal-image';

    // Append image to modal
    modal.appendChild(fullImage);
    overlay.appendChild(modal);

    // Append overlay to body
    document.body.appendChild(overlay);
}

// Modify showImages function to enable image click to open modal
function showImages(brand, model, year, carData) {
    const modelsContainer = document.getElementById('models-container');
    const imagesContainer = document.createElement('div');
    imagesContainer.innerHTML = `<h3>Images of ${brand} ${model} (${year})</h3>`;

    let imagesFound = false;
    for (const key in carData) {
        const [carBrand, carModel, carYear] = key.split('/');
        if (carBrand === brand && carModel === model && carYear === year) {
            const img = document.createElement('img');
            img.src = carData[key];
            img.style.margin = '10px';
            img.style.width = '200px';
            img.style.height = '100px';
            img.style.objectFit = 'cover';
            img.onclick = () => openImageInModal(img.src); // Open image in modal on click
            img.onload = () => {
                if (img.naturalWidth === 1 && img.naturalHeight === 1) {
                    img.style.display = 'none';
                }
            };
            img.onerror = () => img.style.display = 'none';
            imagesContainer.appendChild(img);
            imagesFound = true;
        }
    }

    if (!imagesFound) {
        const message = document.createElement('p');
        message.textContent = 'No images found for this selection.';
        imagesContainer.appendChild(message);
    }

    modelsContainer.appendChild(imagesContainer);
}