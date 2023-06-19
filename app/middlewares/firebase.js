const admin = require('firebase-admin')

var serviceAccount = require(process.env.FIREBASE_SECRET);

// Initialize firebase admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    storageBucket: 'gs://project.appspot.com'
})

// Cloud storage and db
const bucket = admin.storage().bucket()
var db = admin.database();

module.exports = {
  bucket,
  db
}