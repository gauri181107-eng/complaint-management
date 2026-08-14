const movies=[
    {title:'GalaxyGuest',price:250},
    {title:'city light',price:250},
    {title:'code red',price:250},
]
for(const movie of movies){/* Iterates directly over the elements of an iterable (like an array).*/ 
    console.log(`${movie.title} costs rs. ${movie.price}`);
}

for (let seatNumber = 1; seatNumber <= 5; seatNumber++) {
    console.log(`creating seat ${seatNumber}`);/*Purpose: Iterates using a counter variable.*/ 
}
