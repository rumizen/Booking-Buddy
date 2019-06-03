import $ from 'jquery';
import './css/base.scss';
import './images/home.svg';
import './images/banknote.svg';
import './images/bed.svg';
import './images/user.svg';
import './images/book.svg';
import domUpdates from './domUpdates.js';
import fetch from 'cross-fetch';
import FinanceRepo from './FinanceRepo';
import UserRepo from './UserRepo';
import BookingRepo from './BookingRepo';
import RoomServiceRepo from './RoomServiceRepo';
import OccupancyRepo from './OccupancyRepo';

let userData;
fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1903/users/users")
  .then(function (response) {
    return response.json();
  })
  .then(function (dataset) {
    userData = dataset;
  });

let roomData;
fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1903/rooms/rooms")
  .then(function (response) {
    return response.json();
  })
  .then(function (dataset) {
    roomData = dataset;
  });

let bookingData;
fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1903/bookings/bookings")
  .then(function (response) {
    return response.json();
  })
  .then(function (dataset) {
    bookingData = dataset;
  });

let roomServiceData;
fetch("https://fe-apps.herokuapp.com/api/v1/overlook/1903/room-services/roomServices")
  .then(function (response) {
    return response.json();
  })
  .then(function (dataset) {
    roomServiceData = dataset;
  });


$( document ).ready(function() {
  setTimeout(function () {
    const financeRepo = new FinanceRepo(roomData, bookingData, roomServiceData);
    const userRepo = new UserRepo(userData);
    const bookingRepo = new BookingRepo(bookingData);
    const roomServiceRepo = new RoomServiceRepo(roomServiceData);
    const occupancyRepo = new OccupancyRepo(roomData, bookingData);

    $('ul.tabs li').click(function () {
      var tab_id = $(this).attr('data-tab');

      $('ul.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');

      $(this).addClass('current');
      $("#" + tab_id).addClass('current');
    })
   
    function returnToday() {
      return new Date().toLocaleDateString('en-GB');
    }

    domUpdates.popDate(returnToday());
    domUpdates.popMainTab(returnToday(), financeRepo, occupancyRepo);
    domUpdates.popOrdersList(returnToday(), roomServiceRepo);
    domUpdates.popRoomsTab(occupancyRepo, bookingRepo);

    function returnDateSearch(e) {
      e.preventDefault();
      const dateValues = $('#orders-by-date').val().split('-');
      domUpdates.popOrdersList(dateValues.reverse().join('/'), roomServiceRepo);
    };

    $('#date-search-button').click(returnDateSearch);

    function returnCustomerSearch() {
      if ($('#customer-search').val() !== '') {
        domUpdates.popCustomerSearch(userRepo);
      } else {
        $('.customer-user-results').html('');
      };
    };

    function selectCustomer(e) {
      if ($(e.target).hasClass('append-block')) {
        const name = $(e.target).find('.append-block-left').text();
        const guest = userRepo.returnUser(name);
        const roomService = roomServiceRepo.returnUserRoomService(returnGuestId(name));
        const booking = bookingRepo.returnBooking(returnGuestId(name));
        domUpdates.popSelectedCustomer(guest, roomService, booking, returnToday());
      }
    }

    function createNewCustomer(e) {
      e.preventDefault();
      const name = $('#new-customer-input').val();
      const newGuest = userRepo.createNewUser(name);
      const roomService = roomServiceRepo.returnUserRoomService(returnGuestId(name));
      const booking = bookingRepo.returnBooking(returnGuestId(name));
      domUpdates.popSelectedCustomer(newGuest, roomService, booking, returnToday());
      domUpdates.toggleNewCustomerSplash();
    }

    function returnGuestId(name) {
      return userRepo.returnUser(name).id;
    }

    $('#customer-search').on('keyup', returnCustomerSearch);

    $('.customer-user-results').click(selectCustomer);

    $('#create-new-guest-btn').click(domUpdates.toggleNewCustomerSplash);

    $('#new-customer-splash-btn').click(createNewCustomer);

    

  }, 500);
});
