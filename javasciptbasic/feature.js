const selectMovies={
    title:'Galazy Guest',
    price:250
}
const selectseats=['A1','A2','A3'];

function createBookingSummary(movie,seats){
    const total=movie.price*seats.length;
    return `${movie.title} | seats:${seats.join(', ')} | rs. ${total}`;
} 

const summary=createBookingSummary(selectMovies,selectseats);
console.log(summary);