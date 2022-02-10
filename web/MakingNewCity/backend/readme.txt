Test with local mongoDB (port 3000). 
Dir BEFORE installing Node packages:
api (dir)
app.js
nodemon.json
package.json
readme.txt
server.js


First install node packages:

npm install

This will create "node_modules"-dir and "package-lock.json"-file.

Now we should be able to start our mongo-server:
Run the nodemon script:
D:\WWW\TimThinner\TimThinner.github.io\web\makingCity\backend>npm run start


> nodemon server.js
[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server started on port 3000



Start mongo-client:

C:\Program Files\MongoDB\Server\4.0\bin>
mongo

> show dbs
admin        0.000GB
config       0.000GB
gtfsrt       0.000GB
local        0.000GB
makingcity   0.000GB
mycustomers  0.000GB
myproducts   0.000GB
myshop       0.001GB
shop         0.000GB
shoppe       0.000GB
>

use makingcity
switched to db makingcity

show collections

feeds
users

> db.users.find()
{ "_id" : ObjectId("5e5cdec9c0bcbb0d24ef0e31"), "is_superuser" : false, "email" : "timthinner@gmail.com", "password" : "$2b$10$WTYu6WizlJRhJRoAWg3MQeXcwVQaBe/Kv6VM.yRi5EINMUGI/Jcb.", "created" : ISODate("2020-03-02T10:24:09.062Z"), "__v" : 0 }
{ "_id" : ObjectId("5e676503d337ac4294e2b2c0"), "is_superuser" : false, "email" : "timo.kinnunen@vtt.fi", "password" : "$2b$10$YJuvtYgDDkld0a0lXCXiHue75o1Aef.yyhZxZZhs3ydAQvOjUHqnS", "created" : ISODate("2020-03-10T09:59:31.950Z"), "__v" : 0 }
> db.feeds.find()
>

db.users.update({_id: ObjectId("5e676503d337ac4294e2b2c0")}, {$set:{is_superuser:true}});

Connect MongoDB with UI:
Make changes to UI code:
In UserModel.js use a DB version of:
	signup(data) and 
	login(data)
Also in FeedModel.js use a DB version of:
	fetch(token)


Q: How to delete one document from specific collection?
A: db.regcodes.remove({email:'juuso@foobar.fi'});





> use makingcity
switched to db makingcity
> db.users.find()
{ "_id" : ObjectId("5e5cdec9c0bcbb0d24ef0e31"), "is_superuser" : false, "email" : "timthinner@gmail.com", "password" : "$2b$10$WTYu6WizlJRhJRoAWg3MQeXcwVQaBe/Kv6VM.yRi5EINMUGI/Jcb.", "created" : ISODate("2020-03-02T10:24:09.062Z"), "__v" : 0 }
{ "_id" : ObjectId("5e676503d337ac4294e2b2c0"), "is_superuser" : true, "email" : "timo.kinnunen@vtt.fi", "password" : "$2b$10$YJuvtYgDDkld0a0lXCXiHue75o1Aef.yyhZxZZhs3ydAQvOjUHqnS", "created" : ISODate("2020-03-10T09:59:31.950Z"), "__v" : 0 }
{ "_id" : ObjectId("5f6c607cd483dc3bcc6885ca"), "is_superuser" : false, "email" : "dee@dee.fi", "password" : "$2b$10$eRXK6lbzJJ0kuFIc.Ompru1HJs3tv36oUQyimlhtlVmaHfAx2s6u6", "regcode" : ObjectId("5f6b3e4f589d113b9095d5f2"), "readkey" : ObjectId("5f6c607cd483dc3bcc6885c9"), "created" : ISODate("2020-09-24T09:01:48.487Z"), "__v" : 0 }
> db.regcodes.find()
... ^C

> db.regcodes.find()
{ "_id" : ObjectId("5f6b3e4f589d113b9095d5f2"), "email" : "dee@dee.fi", "apartmentId" : "1234", "code" : "gy7dvx", "startdate" : ISODate("2020-09-22T21:00:00Z"), "enddate" : ISODate("2020-10-23T21:00:00Z"), "__v" : 0 }
> db.readkeys.find()
{ "_id" : ObjectId("5f6c607cd483dc3bcc6885c9"), "startdate" : ISODate("2020-09-22T21:00:00Z"), "enddate" : ISODate("2020-10-23T21:00:00Z"), "__v" : 0 }


