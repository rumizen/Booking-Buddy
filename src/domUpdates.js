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
}