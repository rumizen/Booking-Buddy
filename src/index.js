import $ from 'jquery';
import './css/base.scss';
import './images/home.svg';
import './images/banknote.svg';
import './images/bed.svg';
import './images/user.svg';
import './images/book.svg';
import './images/suite.jpg';
import './images/junior-suite.jpg';
import './images/residential-suite.jpg';
import './images/single.jpg';
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

    function returnDateSearch(element) {
      return $(element).val().split('-');
    };

    function popOrdersList(e) {
      e.preventDefault();
      domUpdates.popOrdersList(returnDateSearch('#orders-by-date').reverse().join('/'), roomServiceRepo);
    };

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
    };

    function createNewCustomer(e) {
      e.preventDefault();
      const name = $('#new-customer-input').val();
      const newGuest = userRepo.createNewUser(name);
      const roomService = roomServiceRepo.returnUserRoomService(returnGuestId(name));
      const booking = bookingRepo.returnBooking(returnGuestId(name));
      domUpdates.popSelectedCustomer(newGuest, roomService, booking, returnToday());
      domUpdates.toggleNewCustomerSplash();
    };

    function returnGuestId(name) {
      return userRepo.returnUser(name).id;
    };

    function roomServiceButton(e) {
      e.preventDefault();
      if ($(e.target).hasClass('room-service-btn')) {
        const userId = returnGuestId($('#header-selected-customer').text());
        const roomService = roomServiceRepo.returnUserRoomService(userId);
        const parsedDate = $('#room-service-by-date').val().split('-');
        domUpdates.popRoomServiceDailyTotal(roomService, parsedDate.reverse().join('/'));
      }
    };

    function newBookButton(e) {
      e.preventDefault();
      if ($(e.target).hasClass('rooms-customer-book-btn')) {
        domUpdates.toggleRoomSplash();
        domUpdates.popAvailableRooms(returnToday(), occupancyRepo);
      }
    };

    function cancelBookButton(e) {
      e.preventDefault();
      if ($(e.target).hasClass('splash-rooms-cancel-btn')) {
        domUpdates.toggleRoomSplash();
      }
    };

    function roomDateButton(e) {
      e.preventDefault();
      if ($(e.target).hasClass('room-date-splash-btn')) {
        domUpdates.popAvailableRooms(returnDateSearch('#splash-room-date-input').reverse().join('/'), occupancyRepo);
        domUpdates.toggleElement('.splash-room-type-btn');
        domUpdates.toggleElement('#room-select');
      }
    };

    function roomTypeButton(e) {
      e.preventDefault();
      if ($(e.target).hasClass('splash-room-type-btn')) {
        domUpdates.popAvailableRoomsByType(returnDateSearch('#splash-room-date-input').reverse().join('/'), $('#room-select').val(), occupancyRepo);
      }
    };

    function cancelNewCustomer(e) {
      e.preventDefault();
      if ($(e.target).hasClass('new-customer-cancel-btn')) {
        domUpdates.toggleNewCustomerSplash();
      }
    };

    function makeBooking(e) {
      e.preventDefault();
      if ($(e.target).hasClass('book-room')) {
        const name = $('#header-selected-customer').text();
        const date = returnDateSearch('#splash-room-date-input').reverse().join('/');
        const roomNumber = $(e.target).find('.room-num').text();
        bookingRepo.createBooking(returnGuestId(name), date, roomNumber);
        const booking = bookingRepo.returnBooking(returnGuestId(name));
        domUpdates.popBookingHistory(booking);
        domUpdates.toggleRoomSplash();
      }
    }

    $('#date-search-button').click(popOrdersList);

    $('#customer-search').on('keyup', returnCustomerSearch);

    $('.customer-user-results').click(selectCustomer);

    $('#create-new-guest-btn').click(domUpdates.toggleNewCustomerSplash);

    $('#new-customer-splash-btn').click(createNewCustomer);

    $('.container').click(roomServiceButton);

    $(document).click(newBookButton);
    $(document).click(cancelBookButton);
    $(document).click(cancelNewCustomer);
    $(document).click(roomDateButton);
    $(document).click(roomTypeButton);
    $(document).click(makeBooking);

    
  }, 500);
});
