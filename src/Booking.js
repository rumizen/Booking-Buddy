class Booking {
  constructor(data) {
    this.data = data;
  }

  returnAllBookings() {
    return this.data;
  }

  returnBookingforDate(givenDate) {
    return this.data.find(booking => booking.date === givenDate);
  }
}

export default Booking; 