const homeWindow = document.getElementById('block1')
const loginWindow = document.getElementById('block2')
const signupWindow = document.getElementById('block3')

window.onload = () => {
    if (fromLS('id') === null && fromSS('id') === null) {
        loginWindow.style.display = "block"
        homeWindow.style.display = "none"
    } else {
        loginWindow.style.display = "none"
        homeWindow.style.display = "block"
    }
}

function login() {
    if (document.getElementById('checkRemember').checked) {
        toLS('id', document.getElementById('userIdLogin').value)
    } else {
        toSS('id', document.getElementById('userIdLogin').value)
    }
    loginWindow.style.display = "none"
    homeWindow.style.display = "block"
}

function signup() {
    loginWindow.style.display = "none"
    signupWindow = "block"
}


// use full functions
function toLS(key, value) {
    localStorage.setItem(key, value)
}

function toSS(key, value) {
    sessionStorage.setItem(key, value)
}

function fromLS(key) {
    return localStorage.getItem(key)
}

function fromSS(key) {
    return sessionStorage.getItem(key)
}
