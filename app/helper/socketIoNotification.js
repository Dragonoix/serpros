const socket = require("../../serpros");
const notificationRepo = require("../modules/notification/repositories/notification.repository");


class Notification {
    constructor() { }


    async Notify(id, payload) {
        try {

            socket.ioObject.sockets.emit('notify' + id, payload);
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    };


    async SendNotification(data) {
        try {
            await notificationRepo.save(data.data);
            socket.ioObject.sockets.emit('notify' + data.id, data.payload);
            return true;

        } catch (error) {
            // console.log(error);
            return false;
        }
    };


    async SendCronNotification(data) {
        try {
            await notificationRepo.save(data.data);
            // socket.ioObject.sockets.emit('notify' + data.id, data.payload);
            return true;

        } catch (error) {
            // console.log(error);
            return false;
        }
    };

}
module.exports = new Notification();