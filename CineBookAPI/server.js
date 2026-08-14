const express =require('express');
const { message } = require('statuses');
const app=express()
const PORT=3000
app.use(express.json())


const movies=[
    {id:1,
    title: 'Galaxy Quest',
    language:'English',
    price:250},
    {id:2,
    title: 'City Lights',
    language:'Hindi',
    price:200}
    ];

let bookings=[]
let next_booking_id=1

function find_movie(movie_id){
    return movies.find(function(movie){
        return movie.id==Number(movie_id)                    //strings are converted to number in the Number
    });
}

app.get('/',function(request,response){
    response.send('CineBook API is running')
});

app.get('/api/movies',function(request,response){
     response.json(movies)
});

app.get('/api/movies/:id',function(request,response){
    const movie=find_movie(request.params.id)
    if(!movie){
        return response.status(404).json({message:'Movie not found'})
    }
    response.json(movie)
});

app.get('/api/bookings',function(request,response){
    response.json(bookings)
});

app.post('/api/bookings/',function(request,response){
    const{customer_name,customer_email,movie_id,show_time,seats}=request.body
    const movie=find_movie(movie_id)

    if(!customer_name || !customer_email || !movie || !show_time || !Array.isArray(seats)){
        return response.status(404).json({message:'Complete every booking field.' });
    }
    if(seats.length==0){
        return response.status(400).json({message:'Choose at least one seat'});
    }

    const new_booking={
        id:next_booking_id,
        customer_name,
        customer_email,
        movie_id:movie.id,
        movie_title:movie.title,
        show_time,
        seats,
        total_amount:movie.price*seats.length,
        status:'Confirmed'
    };

    bookings.push(new_booking)
    next_booking_id+=1

    response.status(201).json({
        message:'Booking created successfully.',
        booking:new_booking
    });
});

app.put('/api/bookings/:id',function(request, response){
    const booking_id=Number(request.params.id);
    const booking =bookings.find(function(item){
        return item.id==booking_id;
    });
    if(!booking){
        return response.status(404).json({message: 'Booking not found'});
    }
    const { customer_name, customer_email, show_time, seats}=request.body;
    if(customer_name){
        booking.customer_name=customer_name;
    }
    if(customer_email){
        booking.customer_email=customer_email;
    }
    if(show_time){
        booking.show_time=show_time;
    }
    if(Array.isArray(seats) && seats.length >0){
        booking.seats=seats;
        const movie =find_movie(booking.movie_id);
        booking.total_amount= movie.price*seats.length;
    }
    response.json({message: 'Booking updated successfully.',booking});
});

app.delete('/api/bookings/:id', function(request, response){
    const booking_id=Number(request.params.id);
    const booking_index=bookings.findIndex(function(item){
        return item.id===booking_id;
    });
    if(booking_index=== -1){
        return response.status(404).json({message: 'Booking not found.'});
    }
    const delete_booking=bookings.splice(booking_index,1)[0];
    response.json({message: 'Booking deleted successfully.',booking: delete_booking});
});

app.use(function(request, response){
    response.status(401).json({message: 'Route not found'});
});

app.listen(PORT,function(){
    console.log(`CineBook api is running at http://localhost:${PORT}`)
});