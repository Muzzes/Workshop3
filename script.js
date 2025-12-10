const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = [];

// Render Movies
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('movie-item');

        const p = document.createElement('p');
        p.innerHTML = `<strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}`;
        wrapper.appendChild(p);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editMoviePrompt(movie));
        wrapper.appendChild(editBtn);

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => deleteMovie(movie.id));
        wrapper.appendChild(delBtn);

        movieListDiv.appendChild(wrapper);
    });
}

// Normalize ID
function normalizeId(id) {
    const n = Number(id);
    return Number.isFinite(n) ? n : id;
}

// Fetch Movies
function fetchMovies() {
    fetch(API_URL)
        .then(res => res.json())
        .then(movies => {
            allMovies = movies.map(m => ({
                ...m,
                id: normalizeId(m.id)
            }));
            renderMovies(allMovies);
        })
        .catch(err => console.error('Error fetching movies:', err));
}

fetchMovies();

// Search
searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = allMovies.filter(m =>
        m.title.toLowerCase().includes(term) ||
        m.genre.toLowerCase().includes(term)
    );
    renderMovies(filtered);
});

// Add Movie (POST)
form.addEventListener('submit', e => {
    e.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        year: Number(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
    })
    .then(res => res.json())
    .then(() => {
        form.reset();
        fetchMovies();
    });
});

// Edit Prompt
function editMoviePrompt(movie) {
    const title = prompt("New title:", movie.title);
    const yearStr = prompt("New year:", movie.year);
    const genre = prompt("New genre:", movie.genre);

    if (title === null || yearStr === null || genre === null) return;

    const updatedMovie = {
        title: title.trim(),
        year: Number(yearStr),
        genre: genre.trim()
    };

    updateMovie(movie.id, updatedMovie);
}

// Update Movie (PUT)
function updateMovie(id, data) {
    fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => fetchMovies());
}

// Delete Movie
function deleteMovie(id) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(() => fetchMovies());
}
