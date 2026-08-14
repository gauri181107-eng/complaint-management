function calaculateTotal(price, seatCount) {
    const total = price * seatCount;
    return total;
}

const amountForTwoSeats = calaculateTotal(250, 2);
console.log(`total amount : rs. ${amountForTwoSeats}`);

console.log(calaculateTotal(250,2));