document.addEventListener('DOMContentLoaded', () => {
    const randomFactButton = document.getElementById('random-fact');
    const breedFactButton = document.getElementById('breed-fact');
    const factContainer = document.getElementById('fact-container');
    const factText = document.getElementById('fact');
    const newButtons = document.getElementById('new-buttons');
    const newFactButton = document.getElementById('new-fact');
    const chooseDifferentButton = document.getElementById('choose-different');
    const buttonContainer = document.getElementById('button-container');
    const dropdownContainer = document.getElementById('dropdown-container');
    const breedSelect = document.getElementById('breed-select');
    const getBreedFactButton = document.getElementById('get-breed-fact');

    let lastChoice = '';  // Variable to store the last choice ('random' or 'breed')
    let lastBreed = '';   // Variable to store the last selected breed

    const fetchRandomFact = async () => {
        const response = await fetch('https://catfact.ninja/fact');
        const data = await response.json();
        return data.fact;
    };

    const fetchBreedFact = async (breed) => {
        // If there's an API that supports breed-specific facts, use it here
        // For now, we'll use the same random fact API
        return fetchRandomFact();
    };

    const displayFact = async (factPromise) => {
        const fact = await factPromise;
        factText.textContent = fact;
        buttonContainer.classList.add('hidden');
        dropdownContainer.classList.add('hidden');
        factContainer.classList.remove('hidden');
        newButtons.classList.remove('hidden');
    };

    const loadBreeds = async () => {
        const response = await fetch('breeds.json');
        const data = await response.json();
        return data.breeds;
    };

    const populateBreedDropdown = async () => {
        const breeds = await loadBreeds();
        breedSelect.innerHTML = breeds.map(breed => `<option value="${breed.breed}">${breed.breed}</option>`).join('');
    };

    randomFactButton.addEventListener('click', () => {
        lastChoice = 'random';
        displayFact(fetchRandomFact());
    });

    breedFactButton.addEventListener('click', async () => {
        await populateBreedDropdown();
        buttonContainer.classList.add('hidden');
        dropdownContainer.classList.remove('hidden');
    });

    getBreedFactButton.addEventListener('click', () => {
        const selectedBreed = breedSelect.value;
        lastChoice = 'breed';
        lastBreed = selectedBreed;
        displayFact(fetchBreedFact(selectedBreed));
    });

    newFactButton.addEventListener('click', () => {
        if (lastChoice === 'random') {
            displayFact(fetchRandomFact());
        } else if (lastChoice === 'breed') {
            displayFact(fetchBreedFact(lastBreed));
        }
    });

    chooseDifferentButton.addEventListener('click', () => {
        factContainer.classList.add('hidden');
        newButtons.classList.add('hidden');
        buttonContainer.classList.remove('hidden');
    });
});