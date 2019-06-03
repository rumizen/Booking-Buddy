import $ from 'jquery';

export default {

  popDate(today) {
    $('#header-date').text(today);
  },
  


  popMainTab(today, financeRepo, occupancyRepo) {
    this.popMainRevenue(today, financeRepo);
    this.popMainRoomsAvail(today, occupancyRepo);
    this.popMainRoomsOccupied(today, occupancyRepo);
  },

  popMainRevenue(today, financeRepo) {
    $('#main-total-money').text(financeRepo.returnTotalEarned(today));
  },

  popMainRoomsAvail(today, occupancyRepo) {
    $('#main-rooms-available').text(occupancyRepo.returnAvailableRooms(today).length);
  },

  popMainRoomsOccupied(today, occupancyRepo) {
    $('#main-rooms-percent').text(occupancyRepo.returnPercentRoomsOccupied(today));
  },



  popOrdersTab(today, roomServiceRepo) {
    // this.popOrdersTotal(today, roomServiceRepo);
    this.popOrdersList(today, roomServiceRepo);
  },

  popOrdersTotal(today, roomServiceRepo) {
    $('#orders-total').text(roomServiceRepo.returnUserRoomService(67).returnDailyTotalSpent(today))
  },

  popOrdersList(date, roomServiceRepo) {
    $('.order-history').html('');
    const ordersToday = roomServiceRepo.returnAllDailyRoomService(date);
    if (ordersToday.length > 0) {
      ordersToday.forEach(order => {
        $('.order-history').prepend(`
          <div class="orders-service">
            <p>Date: <span class="order-history-date">${order.date}</span></p>
            <p>Amount: <span class="order-history-amount">$${order.totalCost}</span></p>
          </div>
        `);
      });
    } else {
      $('.order-history').prepend('<p class="no-info-message">There have been no orders today.</p>');
    }
  },



  popRoomsTab(occupancyRepo, bookingRepo) {
    this.popPopularDate(bookingRepo);
    this.popAvailDate(occupancyRepo);
  },

  popPopularDate(bookingRepo) {
    $('#rooms-popular-date').text(bookingRepo.returnModeBookingDate());
  },

  popAvailDate(occupancyRepo) {
    $('#rooms-avail-date').text(occupancyRepo.returnMostAvailableDate());
  },



  popCustomerSearch(userRepo) {
    $('.customer-user-results').html('');
    const searchVal = $('#customer-search').val();
    userRepo.returnFilteredUsers(searchVal).forEach(user => {
      $('.customer-user-results').prepend(`
        <div class="orders-service append-block">
          <p>Name: <span class="order-history-date append-block-left">${user.name}</span></p>
          <p>Id: <span class="order-history-amount append-block-right">${user.id}</span></p>
        </div>
      `);
    });
  },



  popSelectedCustomer(newGuest, roomService, booking, date) {
    $('#header-selected-customer').text(newGuest.name);
    $('.customer-user-results').html('');
    $('#customer-search').val('');
    this.customerAnimation();
    this.toggleCustomerTabs(roomService, booking, date);
  },

  toggleCustomerTabs(roomService, booking, date) {
    $('.rooms').replaceWith(`
    <section id="tab-3" class="tab-content rooms-customer">
      <div class="rooms-customer-div">
        <article class="rooms-customer-article">
          <h3>Guest booking history</h3>
          <p hidden id="no-booking-message">No booking history</p>
          <div class="rooms-customer-booking-history">
          </div>
          <div class="rooms-customer-book-btn">
            <p hidden id="rooms-customer-booked-message">Guest has a booking today!</p>
            <button id="rooms-customer-book-btn">New Booking</button>
          </div>
        </article>
      <div>
    </section>
    `);
    $('.orders').replaceWith(`
    <section id="tab-2" class="tab-content orders-customer">
      <div class="orders-customer-div">
        <article class="orders-customer-history">
          <h3>Order History</h3>
        </article>  
        <article class="order-history-box">
          <p hidden id="no-room-service-message">No room service history</p>
        </article>
        <article class="orders-customer-alltime-total">
          <h3>Guest Total</h3>
          <p>$${roomService.returnAllTimeTotalSpent()}</p>
        </article>  
        <article class="orders-customer-daily-total">
          <form>
            <label for="room-service-by-date">Total spent for:</label>
            <input type="date" id="room-service-by-date"/>
            <button>Go</button>
          </form>
        </article>  
      </div>
    </section>
    `);
    this.popRoomServiceHistory(roomService);
    this.popBookingHistory(booking);
    this.checkNewBookingBtn(booking, date);
  },

  popBookingHistory(booking) {
    $('.rooms-customer-booking-history').html('');
    const bookingHist = booking.returnAllBookings();
    if (bookingHist.length > 0) {
      bookingHist.forEach(booking => {
        $('.rooms-customer-booking-history').prepend(`
          <div class="guest-booking append-block">
            <p>Room: <span class="append-block-left">${booking.roomNumber}</span></p>
            <p>Date: <span class="append-block-right">${booking.date}</span></p>
          </div>
        `);
      });
    } else {
      $('#no-booking-message').toggle();
    }
  },

  popRoomServiceHistory(roomService) {
    $('.order-history-box').html('');
    const roomServiceHist = roomService.returnAllRoomServices();
    if (roomServiceHist.length > 0) {
      roomServiceHist.forEach(roomService => {
        $('.order-history-box').prepend(`
          <div class="guest-room-service append-block">
            <p>Date: <span class="append-block-left">${roomService.date}</span></p>
            <p>Cost: <span class="append-block-right">${roomService.totalCost}</span></p>
          </div>
        `);
      });
    } else {
      $('#no-room-service-message').toggle();
    }
  },

  checkNewBookingBtn(booking, date) {
    const bookedToday = booking.returnBookingforDate(date);
    if (bookedToday !== undefined) {
      $('#rooms-customer-booked-message').toggle();
      $('#rooms-customer-book-btn').prop('disabled', true);
    } else {
      $('#rooms-customer-book-btn').prop('disabled', false);
    }
  },

  customerAnimation() {
    $('#header-customer-box').addClass('scale-animation');
    setTimeout(() => $('#header-customer-box').removeClass('scale-animation'), 2000);
  },

  toggleNewCustomerSplash() {
    $('#new-customer-splash').toggle('fast');
    $('#new-customer-input').val('');
  },




}