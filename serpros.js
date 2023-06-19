// core modules
const { join, resolve } = require('path');
const http = require('http');
// 3rd party modules
const express = require('express');
const cors = require('cors');
const engine = require('ejs-locals');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const socketio = require('socket.io');


const mime = require('mime-types')

// Import module in global scope
require('app-module-path').addPath(__dirname + '/app/modules');
require('mongoose-pagination');
require('dotenv').config();
_ = require("underscore");


// custom modules will goes here
global.appRoot = join(__dirname, '/app');
config = require(resolve(join(__dirname, 'app/config', 'index')));
utils = require(resolve(join(__dirname, 'app/helper', 'utils')));
global.auth = require(resolve(join(__dirname, 'app/middlewares', 'auth')))();
mailHelper = require(appRoot + '/helper/mailer');
// webpush_public_key = config.webPush.publicKey;

// For track log //
const Logger = require(resolve(join(__dirname, 'app/helper', 'logger')));
const logger = new Logger();

//Repositories
const chatRepo = require('chat/repositories/chat.repository');
const userRepo = require('user/repositories/user.repository');

const { default: mongoose } = require('mongoose');

const app = express();
const namedRouter = require('route-label')(app);



app.set('views', [join(__dirname, './app/views'), join(__dirname, './app/modules')]);
app.engine('ejs', engine);
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*****************************************************/
/********* Functions + variable declaration *********/
/***************************************************/

const isProd = config.app.isProd;
const getPort = config.app.port;
const getApiFolderName = config.app.getApiFolderName;

const getAdminFolderName = config.app.getAdminFolderName;
app.locals.moment = require('moment');
// Inclide main view path for (admin) //
app.locals.layout_directory = '../../../views/layouts';
app.locals.module_directory = '../../../../app/modules/';
app.locals.partial_directory = '../../../views/partials';
global.project_description = config.app.project_description;
global.project_name = config.app.project_name;
global.generateUrl = generateUrl = (route_name, route_param = {}) => namedRouter.urlFor(route_name, route_param);
global.generateUrlWithQuery = generateUrlWithQuery = (route_name, route_param = {}, route_query = {}) => namedRouter.urlFor(route_name, route_param, route_query);
adminThemeConfig = config.theme;

/***************  Swagger API DOC ***************/
const swaggerAdmin = require(resolve(join(__dirname, 'app/helper', 'swagger')));
app.use('/', swaggerAdmin.router);
/************************************************/


/***************  Schedule Cron Job Starts Here ***************/
//Import Cron Jobs
var CronJob = require('node-cron');

//At every 10th minute.(*/10 * * * *)
CronJob.schedule("*/10 * * * *", () => {
    require('./app/modules/WEBSERVICES/cronjob.controller').sendNewJobNotification();
});

/******************** Middleware registrations *******************/
app.use(cors());
app.use(flash());
app.use(session({ secret: 'delivery@&beverage@#', resave: true, saveUninitialized: true }));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
})); // get information from html forms
app.use(bodyParser.json({
    limit: "50mb"
}));

app.use(express.static('./public'));

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, max-age=3600');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.locals.messages = req.flash();
    auth = require(resolve(join(__dirname, 'app/middlewares', "auth")))(req, res, next);
    app.use(auth.initialize());
    // This is for admin end
    if (req.session.token && req.session.token != null) {
        req.headers['token'] = req.session.token;
    }
    // This is for webservice end
    if (req.headers['x-access-token'] != null) {
        req.headers['token'] = req.headers['x-access-token'];
    }
    // add this line to include winston logging
    next();
});

// For Error log 
app.use(function (err, req, res, next) {
    logger.log(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, 'error');
});


/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
    const port = getPort;
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(0);
            break;
        default:
            throw error;
    }
}

(async () => {
    try {
        // Database connection//
        await require(resolve(join(__dirname, 'app/config', 'database')))();

        /******************* Routes Api ************/
        const apiFiles = await utils._readdir(`./app/routes/${getApiFolderName}`);
        apiFiles.forEach(file => {

            if (!file && file[0] == '.') return;
            namedRouter.use('', `/${getApiFolderName}`, require(join(__dirname, file)));
        });

        /*********************** Routes Admin **********************/
        const adminApiFiles = await utils._readdir(`./app/routes/${getAdminFolderName}`);
        adminApiFiles.forEach(file => {
            if (!file && file[0] == '.') return;
            namedRouter.use('', require(join(__dirname, file)));
            // namedRouter.use('', `/${getAdminFolderName}`, require(join(__dirname, file)));
        });



        namedRouter.buildRouteTable();
        if (!isProd && process.env.SHOW_NAMED_ROUTES === 'true') {
            routeList = namedRouter.getRouteTable();
            // console.log(routeList);
        }
        /******************* Service Launch *****************/
        const server = http.createServer(app);
        const io = socketio(server, {
            cors: {
                origin: '*',
            },
            // transports: ['websocket']
        });

        server.listen(getPort);
        server.on('error', onError);
        console.log(`${config.app.project_name} is running on ${(global.BASE_URL && global.BASE_URL !== '') ? global.BASE_URL : `http://${process.env.HOST}:${getPort}`}`);

        /******************* Socket Launch *****************/


        io.on('connection', (socket) => {

            io.emit('connected', `⚡: ${socket.id} user just connected!`);

            socket.on("join", (data) => {
                try {
                    let userId = (jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET)).id;
                    if (userId) {
                        socket.join(data.room);
                    }
                } catch (err) {
                    logger.storeError({api_url: 'join event(socket)', error_msg: err});
                    console.log('ERR1', err);
                }

            })

            socket.on("message", async (data) => {
                try {
                    
                    let userId = ''
                    jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET, (err, verifiedJwt) => {
                        if (err) {
                            console.log("JWT ERROR", err.message)
                            return;
                        } else {
                            userId = verifiedJwt.id
                        }
                    })

                    // delete existing typing 
                    await chatRepo.deleteTypingChat(userId, data.room);


                    let savedChat = await chatRepo.save({
                        from_id: userId,
                        room_id: data.room,
                        text: data.text,
                        type: data.text ? 'text' : 'file'
                    });

                    if (data.files && data.files.length > 0) {

                        for (var i in data.files) {
                            let fileName = Date.now() + "@" + data.files[i].name;
                            fs.writeFile("./public/uploads/chat/" + fileName, data.files[i].file, async (err) => {
                                console.log(err);
                                let fileType = (mime.lookup(fileName)).split('/')[0];
                                await chatRepo.updateById(
                                    savedChat._id,
                                    { $push: { files: { file: fileName, type: fileType } } }
                                );
                            });
                        }
                    }


                    let updateData = await chatRepo.updateLast(data.room, {
                        last_message_text: data.text ? data.text : '📎 attachment',
                        last_message_at: new Date(), last_message_by: userId
                    });

                    if (!_.isEmpty(updateData)) {
                        // console.log(updateData);
                        updateData.unseen_count.forEach(async (item) => {
                            if (item.user_id.toString() != userId.toString()) {
                                await chatRepo.chatCount(data.room, item.user_id, (item.count + 1));
                            }
                        });

                    }

                    let chatRoom = await chatRepo.getRoomById(data.room);

                    if (!_.isEmpty(chatRoom)) {
                        chatRoom.members.forEach((ele) => {
                            let emitTo = (ele.toString()) + 'newMsg';
                            let unseenRoomCount = (ele.toString()) + 'NewChat';
                            io.emit(emitTo, savedChat); // emit to all existinc users
                            io.emit(unseenRoomCount, savedChat);
                        })
                    }
                    // io.to(data.room).emit("message", savedChat);

                } catch (err) {
                    logger.storeError({api_url: 'message event(socket)', error_msg: err});
                    console.log("ERROR: ", err);
                    io.to(data.room).emit("message", "Invalid Token!!!");
                }
            })

            socket.on('reaction', async (data) => {
                try {
                    
                    let userId = ''
                    jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET, (err, verifiedJwt) => {
                        if (err) {
                            console.log("JWT ERROR", err.message)
                            return;
                        } else {
                            userId = verifiedJwt.id
                            
                        }
                    })
                    
                    let find_reaction = await chatRepo.getByField({ _id: mongoose.Types.ObjectId(data.mssgId), reactions: { $elemMatch: { reaction: data.reactionEmoji, user_id: userId } } });
                    let updated = {};
                    if (!_.isEmpty(find_reaction)) {
                        await chatRepo.updateByField(
                            { _id: mongoose.Types.ObjectId(data.mssgId) },
                            {
                                $pullAll: {
                                    reactions: [{ reaction: data.reactionEmoji, user_id: userId }],
                                },
                            }
                        );
                        updated = find_reaction
                    } else {
                        updated = await chatRepo.updateById(
                            data.mssgId,
                            { $push: { reactions: { reaction: data.reactionEmoji, user_id: userId } } }
                        );
                    }
                    
                    let payload = {
                        _id: updated._id,
                        from_id: updated.from_id,
                        room_id: updated.room_id,
                        text: updated.text,
                        files: updated.files,
                        reactions: updated.reactions,
                        type: updated.type,
                        createdAt: updated.createdAt,
                        reaction: true
                    }
                    
                    let chatRoom = await chatRepo.getRoomById(data.room);

                    if (!_.isEmpty(chatRoom)) {
                        chatRoom.members.forEach((ele) => {
                            let emitTo = (ele.toString()) + 'newMsg';
                            // console.log(emitTo);
                            io.emit(emitTo, payload); // broadcast to all existinc users
                        })
                    }
                    // io.to(data.room).emit("message", payload);

                } catch (err) {
                    logger.storeError({api_url: 'reaction event(socket)', error_msg: err});
                    console.log("ERROR: ", err);

                }
            })


            socket.on('typing', async (data) => {
                try {
                    let userId = ''
                    jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET, (err, verifiedJwt) => {
                        if (err) {
                            console.log("JWT ERROR", err.message)
                            return;
                        } else {
                            userId = verifiedJwt.id
                        }
                    })
                    
                    var typingData = {};
                    let userData = await userRepo.getById(userId);

                    if (data.status === 'start') {
                        typingData = await chatRepo.save({
                            from_id: userId,
                            room_id: data.room,
                            type: 'typing'
                        });
                    } else if (data.status === 'end') {
                        typingData = await chatRepo.deleteTypingChat(userId, data.room);
                        
                    }

                    let chatRoom = await chatRepo.getRoomById(data.room);
                    
                    if (!_.isEmpty(chatRoom) && !_.isEmpty(typingData) ) {
                        // console.log(userData.profile_image);
                        chatRoom.members.forEach((ele) => {
                            if (userId.toString() != ele.toString()) {
                                let emitTo = (ele.toString()) + 'Typing';
                                io.emit(emitTo, {
                                    "chat_type": "typing",
                                    "files": [],
                                    "from_id": typingData.from_id || "",
                                    "profile_image": userData.profile_image || "", //add profile image here
                                    "reactions": [],
                                    "room": data.room,
                                    "text": "",
                                    "_id": typingData._id || "" ,
                                    status: data.status
                                }); // broadcast to all existinc users
                            }

                        })
                    }
                } catch (err) {
                    logger.storeError({api_url: 'typing event(socket)', error_msg: err});
                    console.log("ERROR: ", err);
                }
            })

            socket.on('seen', async (data) => {
                try {
                    let userId = ''
                    jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET, (err, verifiedJwt) => {
                        if (err) {
                            console.log("JWT ERROR", err.message)
                            return;
                        } else {
                            userId = verifiedJwt.id
                        }
                    });


                    let roomData = await chatRepo.getRoomById(data.room);

                    if (!_.isEmpty(roomData)) {
                        await roomData.unseen_count.forEach(async (item) => {
                            if (item.user_id.toString() == userId) {
                                await chatRepo.chatCount(data.room, item.user_id, 0);
                            }
                        });
                    }

                    let chatRoom = await chatRepo.getRoomById(data.room);

                    if (!_.isEmpty(chatRoom)) {
                        chatRoom.members.forEach((ele) => {
                            let emitTo = (ele.toString()) + 'newMsg';
                            let unseenRoomCount = (ele.toString()) + 'NewChat';

                            io.emit(emitTo, {'seen': true}); // broadcast to all existinc users
                            io.emit(unseenRoomCount, {'seen': true});
                        })
                    }
                    // io.to(data.room).emit("message", roomData);

                } catch (err) {
                    logger.storeError({api_url: 'seen event(socket)', error_msg: err});
                    console.log("ERROR: ", err);

                }
            })


            socket.on("disconnect", async () => {
                try {
                    let userId = ''
                    jwt.verify((socket.handshake.headers['x-access-token']), process.env.JWT_SECRET, (err, verifiedJwt) => {
                        if (err) {
                            console.log("JWT ERROR", err.message)
                            return;
                        } else {
                            userId = verifiedJwt.id
                        }
                    })
                    console.log("User has disconnected", userId);
                    await chatRepo.deleteTyping(userId);

                    let chatRoom = await chatRepo.getAllByFieldChatRoom({ isDeleted: false, members: { $in: userId } })
                    // console.log(chatRoom);
                    if (!_.isEmpty(chatRoom)) {
                        chatRoom.forEach((ele) => {
                            if (mongoose.isValidObjectId(ele.id)) {
                                let emitTo = ((ele._id).toString()) + 'newMsg';

                                io.emit(emitTo, {}); // broadcast to all existinc users
                            }

                        })
                    }
                } catch (err) {
                    logger.storeError({api_url: 'disconnect event(socket)', error_msg: err});
                    console.log("ERROR: ", err);

                }
            })


        })
        /******************* Socket Launch Ends *****************/
        const socketIoObject = io;
        module.exports.ioObject = socketIoObject;

    } catch (error) {
        console.error(error);
    }
})();

module.exports = app;