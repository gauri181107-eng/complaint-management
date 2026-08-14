// ===============================
// 1. Movie Data
// ===============================
const movies = [
  { id: 1, title: 'Galaxy Quest', genre: 'Science Fiction', language: 'English', price: 250, poster: 'galaxy quest.jpeg' },
  { id: 2, title: 'City Lights', genre: 'Drama', language: 'Hindi', price: 200, poster: 'city light.jpeg' },
  { id: 3, title: 'Code Red', genre: 'Thriller', language: 'Telugu', price: 220, poster: 'code red.jpeg' }
];

// ===============================
// 2. State
// ===============================
const state = {
  selectedMovieId: null,
  selectedSeats: []
};

// ===============================
// 3. DOM References
// ===============================
const movieGrid = document.querySelector('#movieGrid');
const seatGrid = document.querySelector('#seatGrid');
const clearSeatsButton = document.querySelector('#clearSeatsButton');
const bookingForm = document.querySelector('#bookingForm');
const formMessage = document.querySelector('#formMessage');
const summaryMovie = document.querySelector('#summaryMovie');
const summarySeats = document.querySelector('#summarySeats');
const summaryTotal = document.querySelector('#summaryTotal');
const bookingResult = document.querySelector('#bookingResult');

// ===============================
// 4. Helpers
// ===============================
function getSelectedMovie() {
  return movies.find(movie => movie.id === state.selectedMovieId);
}

// ===============================
// 5. Render Movies
// ===============================
function renderMovies() {
  movieGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('article');
    card.className = 'movie-card';
    if (movie.id === state.selectedMovieId) card.classList.add('is-selected');

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title} poster">
      <div class="movie-card-content">
        <h3>${movie.title}</h3>
        <p>${movie.genre} | ${movie.language}</p>
        <p><strong>Rs. ${movie.price}</strong> per seat</p>
        <button class="movie-select-button" type="button" data-movie-id="${movie.id}">
          Select ${movie.title}
        </button>
      </div>
    `;
    movieGrid.append(card);
  });
}

// ===============================
// 6. Render Seats
// ===============================
const seatNames = [];
['A', 'B', 'C', 'D'].forEach(row => {
  for (let num = 1; num <= 8; num++) {
    seatNames.push(`${row}${num}`);
  }
});

function renderSeats() {
  seatGrid.innerHTML = '';
  seatNames.forEach(seatName => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'seat';
    button.textContent = seatName;
    button.dataset.seatName = seatName;
    if (state.selectedSeats.includes(seatName)) button.classList.add('is-selected');
    seatGrid.append(button);
  });
}

// ===============================
// 7. Update Summary
// ===============================
function updateSummary() {
  const movie = getSelectedMovie();
  const total = movie ? movie.price * state.selectedSeats.length : 0;
  summaryMovie.textContent = movie ? movie.title : 'Not selected';
  summarySeats.textContent = state.selectedSeats.length ? state.selectedSeats.join(', ') : 'None';
  summaryTotal.textContent = `Rs. ${total}`;
}

// ===============================
// 8. Event Listeners
// ===============================

// Movie selection
movieGrid.addEventListener('click', e => {
  const button = e.target.closest('[data-movie-id]');
  if (!button) return;
  state.selectedMovieId = Number(button.dataset.movieId);
  state.selectedSeats = [];
  formMessage.textContent = '';
  bookingResult.textContent = '';
  renderMovies();
  renderSeats();
  updateSummary();
});

// Seat selection
seatGrid.addEventListener('click', e => {
  const button = e.target.closest('[data-seat-name]');
  if (!button) return;
  if (!state.selectedMovieId) {
    formMessage.textContent = 'Select a movie before choosing seats.';
    return;
  }
  const seatName = button.dataset.seatName;
  const index = state.selectedSeats.indexOf(seatName);
  if (index === -1) state.selectedSeats.push(seatName);
  else state.selectedSeats.splice(index, 1);
  formMessage.textContent = '';
  renderSeats();
  updateSummary();
});

// Clear seats
clearSeatsButton.addEventListener('click', () => {
  state.selectedSeats = [];
  formMessage.textContent = '';
  bookingResult.textContent = '';
  renderSeats();
  updateSummary();
});

// Booking form
bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const movie = getSelectedMovie();
  const name = document.querySelector('#customerName').value.trim();
  const email = document.querySelector('#customerEmail').value.trim();
  const showTime = document.querySelector('#showTime').value;

  if (!movie || !state.selectedSeats.length) {
    formMessage.textContent = 'Select one movie and at least one seat.';
    return;
  }

  const total = movie.price * state.selectedSeats.length;
  formMessage.textContent = '';
  bookingResult.innerHTML = `
    <div class="booking-confirmation">
      <img src="${movie.poster}" alt="${movie.title} poster" class="booking-poster">
      <div class="booking-details">
        <h3>Booking confirmed for ${name}</h3>
        <p><strong>Movie:</strong> ${movie.title}</p>
        <p><strong>Show time:</strong> ${showTime}</p>
        <p><strong>Seats:</strong> ${state.selectedSeats.join(', ')}</p>
        <p><strong>Total:</strong> Rs. ${total}</p>
        <p>Confirmation sent to ${email}</p>
      </div>
    </div>
  `;

  bookingForm.reset();
  state.selectedSeats = [];
  renderSeats();
  updateSummary();
});

// ===============================
// 9. Initial Render
// ===============================
renderMovies();
renderSeats();
updateSummary();
