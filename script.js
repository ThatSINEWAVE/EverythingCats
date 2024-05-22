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
    const breedDetails = document.getElementById('breed-details');
    const breedName = document.getElementById('breed-name');
    const breedCountry = document.getElementById('breed-country');
    const breedOrigin = document.getElementById('breed-origin');
    const breedCoat = document.getElementById('breed-coat');
    const breedPattern = document.getElementById('breed-pattern');
    const themeToggle = document.getElementById('theme-toggle');

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
        factContainer.classList.remove('hidden', 'fade-out');
        factContainer.classList.add('fade-in');
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

    const displayBreedDetails = (breed) => {
        breedName.textContent = breed.breed;
        breedCountry.textContent = breed.country;
        breedOrigin.textContent = breed.origin;
        breedCoat.textContent = breed.coat;
        breedPattern.textContent = breed.pattern;
        breedDetails.classList.remove('hidden');
    };

    const applyTheme = (theme) => {
        document.body.classList.toggle('dark', theme === 'dark');
        document.querySelector('.container').classList.toggle('dark', theme === 'dark');
        themeToggle.checked = theme === 'dark';
    };

    const saveTheme = (theme) => {
        localStorage.setItem('theme', theme);
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    };

    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        saveTheme(theme);
    });

    randomFactButton.addEventListener('click', () => {
        lastChoice = 'random';
        displayFact(fetchRandomFact());
    });

    breedFactButton.addEventListener('click', async () => {
        await populateBreedDropdown();
        buttonContainer.classList.add('hidden');
        dropdownContainer.classList.remove('hidden');
    });

    getBreedFactButton.addEventListener('click', async () => {
        const selectedBreed = breedSelect.value;
        lastChoice = 'breed';
        lastBreed = selectedBreed;
        const breeds = await loadBreeds();
        const breed = breeds.find(b => b.breed === selectedBreed);
        displayBreedDetails(breed);
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
        factContainer.classList.add('fade-out');
        newButtons.classList.add('hidden');
        breedDetails.classList.add('hidden');
        buttonContainer.classList.remove('hidden');

        setTimeout(() => {
            factContainer.classList.add('hidden');
            factContainer.classList.remove('fade-out');
        }, 500); // Wait for the fade-out animation to complete
    });

    loadTheme();  // Load the theme when the page loads
});