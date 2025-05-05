document.addEventListener('DOMContentLoaded', function() {
    // Handle text input submission
    document.getElementById('submitButton').addEventListener('click', () => {
        const textInput = document.getElementById('textInput').value.trim().toLowerCase();
        fetch('js/sample.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const outputArea = document.getElementById('outputArea');
                outputArea.innerHTML = ''; // Clear previous content

                // Filter and display data based on the entered model
                let found = false;
                for (const [key, url] of Object.entries(data)) {
                    const [brand, model, year] = key.split('/'); // Extract brand, model, and year
                    if (model.toLowerCase() === textInput) {
                        found = true;

                        // Create a container for each entry
                        const carDiv = document.createElement('div');
                        carDiv.className = 'car-entry';
                        carDiv.innerHTML = `
                            <p><strong>Brand:</strong> ${brand}</p>
                            <p><strong>Model:</strong> ${model}</p>
                            <p><strong>Year:</strong> ${year}</p>
                            <img src="${url}" alt="${model}" style="width: 200px; margin: 10px 0;">
                        `;
                        outputArea.appendChild(carDiv);
                    }
                }

                if (!found) {
                    outputArea.innerHTML = '<p>No results found for the entered model.</p>';
                }
            })
            .catch(error => {
                document.getElementById('outputArea').innerText = 'Error: ' + error.message;
            });
    });

    // Handle fetching JSON file and displaying images grouped by car models
    document.getElementById('fetchJsonButton').addEventListener('click', () => {
        fetch('js/sample.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const outputArea = document.getElementById('outputArea');
                outputArea.innerHTML = ''; // Clear previous content

                // Group images by car models
                const groupedData = {};
                for (const [key, url] of Object.entries(data)) {
                    const model = key.split('/')[1]; // Extract the model name
                    if (!groupedData[model]) {
                        groupedData[model] = [];
                    }
                    groupedData[model].push({ key, url });
                }

                // Display images grouped by models
                for (const [model, images] of Object.entries(groupedData)) {
                    const modelDiv = document.createElement('div');
                    modelDiv.className = 'model-group';
                    modelDiv.innerHTML = `<h3>${model}</h3>`;
                    images.forEach(image => {
                        const img = document.createElement('img');
                        img.src = image.url;
                        img.alt = image.key;
                        img.style.width = '150px'; // Adjust image size
                        img.style.margin = '5px';
                        modelDiv.appendChild(img);
                    });
                    outputArea.appendChild(modelDiv);
                }
            })
            .catch(error => {
                document.getElementById('outputArea').innerText = 'Error: ' + error.message;
            });
    });
});