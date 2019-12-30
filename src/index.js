const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let users = [{Name: "Tarek", password: "123", Role: "LNPR_Operator"},
{Name: "Tarek2", password: "123", Role: "AC_Operator"},
{Name: "Tarek3", password: "123", Role: "admin"}]

io.on('connection', (socket) => {
    socket.on('join', (userInfo, callback) => {
      var res = users.filter(user => user.Name == userInfo.username 
            && user.password == userInfo.password)[0]
            if(!res) {
                callback({error: "user information isn't correct"})
                socket.disconnect()
            }
            socket.join(res.Role)
            io.to(res.Role).emit('message', `Welcome ${res.Name}`)
    })

    //for Later
    socket.on('setup', (users, callback) => {
        users = JSON.parse(users) 
        if (!users){
           return callback({error: "missing data"})
        }
    })

    socket.on('alarm', (alarmStr, callback) => {
        let alarm = JSON.parse(alarmStr)
        if(!alarm.roles || !alarm.roles.length) return
        alarm.roles.forEach(element => {
            //io.emit('newAlarm', alarm.caelumAlarm.AlarmID)
            //io.emit('newAlarm', alarm.caelumAlarm.AlarmID)
            
            console.log(io.to(element).sockets)
            io.to(element).emit('newAlarm', alarm.caelumAlarm.AlarmID)
            //io.to("LNPR_Operator").emit('newAlarm', "helloBaby")
        });
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})