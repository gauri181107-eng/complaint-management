 const seatCount = 4;
const pricePerSeat = 250;
let total = seatCount * pricePerSeat;

if (seatCount >= 4) {
    total = total - 100;
    console.log('discount applied');
} else {
    console.log('no discount');
}

console.log(`final amount: rs. ${total}`);
