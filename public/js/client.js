const socket = io.connect('http://localhost:3000')

const $messageForm = document.querySelector('.centered-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#alarm-template').innerHTML
let username, password;

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

     username = e.target.elements.username.value
     password = e.target.elements.password.value
     join()
})
function join (){
    socket.emit('join', { username, password }, (error) => {
        if (error) {
            alert(error)
        }
    })
}
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        alarm: message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('newAlarm', (alarm) => {
    console.log(alarm)
    const html = Mustache.render(messageTemplate, {
        alarm: alarm
    })
    $messages.insertAdjacentHTML('beforeend', html)
})
socket.on('reconnect', function () {
    console.log('you have been reconnected');
    join()
});

