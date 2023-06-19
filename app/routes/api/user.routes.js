const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const fs = require('fs');
const userController = require('WEBSERVICES/user.controller');

const multer = require('multer');

const request_param = multer();

const Storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (!fs.existsSync("./public/uploads/user")) {
            fs.mkdirSync("./public/uploads/user");
        }
        if (!fs.existsSync("./public/uploads/user/profile_pic")) {
            fs.mkdirSync("./public/uploads/user/profile_pic");
        }
        if (!fs.existsSync("./public/uploads/user/cover_pic")) {
            fs.mkdirSync("./public/uploads/user/cover_pic");
        }
        if(file.fieldname === 'profile_image') {
            callback(null, "./public/uploads/user/profile_pic");
        } else if(file.fieldname === 'cover_image') {
            callback(null, "./public/uploads/user/cover_pic");
        } else if(file.fieldname === 'company_logo') {
            callback(null, "./public/uploads/user/profile_pic");
        } else {
            callback(null, "./public/uploads/user")
        }
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
    }
});

const uploadFile = multer({
    storage: Storage
});




/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Signup/ Register
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Signup
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - first_name
 *                 - last_name
 *                 - email
 *                 - company_name
 *                 - company_users
 *                 - company_logo
 *                 - company_details
 *                 - servicing_region
 *                 - servicing_city
 *                 - servicing_suburbs
 *                 - password
 *                 - user_type
 *                 - scope_type
 *             properties:
 *                 first_name:
 *                      type: string
 *                 last_name:
 *                      type: string
 *                 email:
 *                      type: string
 *                 company_name:
 *                      type: string
 *                 company_users:
 *                      type: string
 *                 company_logo:
 *                      type: string
 *                 company_details:
 *                      type: string
 *                 servicing_region:
 *                      type: string
 *                 servicing_city:
 *                      type: string
 *                 servicing_suburbs:
 *                      type: array
 *                      items:
 *                         type: string
 *                 password:
 *                      type: string
 *                 user_type:
 *                      type: string
 *                      enum: ['client', 'service_provider']
 *                 scope_type:
 *                      type: string
 *                      enum: ['individual', 'business']
 *                 
 *     responses:
 *        200:
 *          description: Account created successfully!
 *        403:
 *          description: Account already exist
 *        400:
 *          description: Bad Request
 *        500:
 *          description: Server Error
 *        
 */

namedRouter.post('api.user.signup', '/user/signup', uploadFile.any(), userController.userSignup);



/**
* @swagger
* /user/social-signup:
*   post:
*     summary: Social Signup
*     tags:
*       - User
*     produces:
*       - application/json
*     parameters:
*         - name: body
*           in: body
*           description: Signup User Using Social Account
*           required: true
*           schema:
*             type: object
*             required:
*                 - first_name
*                 - last_name
*                 - socialId
*                 - registerType
*                 - email
*                 - user_type
*                 - scope_type
*             properties:
*                 first_name:
*                     type: string
*                 last_name:
*                     type: string
*                 socialId:
*                     type: string
*                 registerType:
*                     type: string
*                     enum: [Facebook, Google]
*                 email:
*                     type: string
*                 user_type:
*                      type: string
*                      enum: ['client', 'service_provider']
*                 scope_type:
 *                      type: string
 *                      enum: ['individual', 'business']
*     responses:
*        200:
*          description: Logged in successfully!
*        400:
*          description: Bad Request
*        500:
*          description: Server Error
*/

namedRouter.post('api.user.social-signup', '/user/social-signup', uploadFile.any(), userController.userSocialSignup);


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Signin
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: Login
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - email
 *                 - password
 *                 - remember_me
 *             properties:
 *                 email:
 *                      type: string
 *                 password:
 *                      type: string
 *                 remember_me:
 *                      type: boolean
 *                 
 *     responses:
 *        200:
 *          description: You have successfully logged in.
 *        
 */
namedRouter.post('api.user.login', '/user/login', userController.login);


/**
 * @swagger
 * /user/service-provider:
 *   get:
 *     summary: List of service provider
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     responses:
 *        200:
 *          description: Service provider listing fetched successfully.
 *        
 */

namedRouter.get('api.user.service-provider', '/user/service-provider', userController.getAllServiceProvider);


/**
 * @swagger
 * /user/portfolio-detail/{id}:
 *   get:
 *     summary: Get  user portfolio details
 *     tags:
 *       - User
 *     parameters:
 *         - in: path
 *           name: id
 *           type: string
 *     produces:
 *       - application/json          
 *     responses:
 *        200:
 *          description: All portfolio details fetched successfully.
 *        400:
 *          description: Bad Request.
 *        500:
 *          description: Athentication Error. 
 */

namedRouter.get('api.user.portfolio-detail', '/user/portfolio-detail/:id', userController.portfolio)



//////////////////////////// authentication starts ////////////////////////////////////
namedRouter.all('/user*', auth.authenticateAPI);


/**
  * @swagger
  * /user/logout:
  *   get:
  *     summary: User Logout
  *     tags:
  *       - User
  *     security:
  *       - Token: []
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: User Logged Out Successfully
  *       400:
  *         description: Bad Request
  *       500:
  *         description: Server Error
*/
// User Account Logout route
namedRouter.get('api.user.logout', '/user/logout', userController.logout);


/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: User Change Password
 *     security:
 *       - Token: []
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           description: User Change Password
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - old_password
 *                 - password
 *             properties:
 *                 old_password:
 *                      type: string
 *                 password:
 *                      type: string
 *                 
 *     responses:
 *        200:
 *          description: Your password has been changed successfully.
 *        
 */

namedRouter.post('api.user.change-password', '/user/change-password', uploadFile.any(), userController.userChangePassword);

/**
 * @swagger
 * /user/update-profile:
 *   post:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - Token: []
 *     produces:
 *       - application/json
 *     consumes:
 *         - multipart/form-data
 *     parameters:
 *         - in: formData
 *           name: profile_image
 *           type: file
 *           description: The profile picture file to upload
 *         - in: formData
 *           name: cover_image
 *           type: file
 *           description: Cover image
 *         - name: body
 *           in: body
 *           description: Update user profile
 *           required: true
 *           schema:
 *             type: object
 *             properties:
 *                 first_name:
 *                     type: string
 *                 last_name:
 *                     type: string
 *                 location:
 *                     type: string
 *                 bio:
 *                     type: string
 *                 job_title:
 *                     type: string
 *                 email:
 *                     type: string
 *                 website_link:
 *                     type: string
 *                 skills:
 *                     type: array
 *                     items:
 *                        type: string
 *                 rate_per_hr:
 *                      type: number
 *                 phone:
 *                       type: string
 *                 currency:
 *                       type: string
 *                 geo_loc:
 *                       type: object
 *                       example: {"type": "Point", "coordinates": [ lng, lat ]}
 *                 curr_symbol:
 *                       type: string
 *     responses:
 *        200:
 *          description: User profile data updated successfully.
 *        400:
 *          description: Bad Request
 */

// User Profile Update Route
namedRouter.post('api.user.updateProfile', '/user/update-profile', uploadFile.any(), userController.updateProfile);


/**
 * @swagger
 * /user/details:
 *   get:
 *     summary: User Details
 *     security:
 *       - Token: []
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *                 
 *     responses:
 *        200:
 *          description: Profile details fetched successfully.
 *        
 */
namedRouter.get('api.user.details', '/user/details', userController.profileDetails);




/**
 * @swagger
 * /user/update-availability:
 *   post:
 *     summary: Update Availability
 *     security:
 *       - Token: []
 *     tags:
 *       - User
 *     produces:
 *       - application/json
 *     parameters:
 *         - name: body
 *           in: body
 *           descrip tion: Update Availability
 *           required: true
 *           schema:
 *             type: object
 *             required:
 *                 - availability
 *             properties:
 *                 availability:
 *                      type: array
 *                      example: ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday']
 *                 
 *     responses:
 *        200:
 *          description: Availability updated successfully.
 *        
 */

namedRouter.post('api.user.update-availability', '/user/update-availability', userController.UpdateAvailability);



module.exports = router;