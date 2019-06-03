import RoomService from './RoomService.js';

class RoomServiceRepo {
  constructor(data) {
    this.data = data;
  }

  returnUserRoomService(id) {
    const userData = this.data.roomServices.filter(order => order.userID === id);
    return new RoomService(userData);
  }

  returnAllDailyRoomService(givenDate) {
    return this.data.roomServices.filter(day => day.date === givenDate);
  }
}
 
export default RoomServiceRepo;