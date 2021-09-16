const homeWindow = document.getElementById('block1')
const loginWindow = document.getElementById('block2')
const signupWindow = document.getElementById('block3')

window.onload = () => {
    if (fromLS('id') === null && fromSS('id') === null) {
        loginWindow.style.display = "block"
        homeWindow.style.display = "none"
    } else {
        document.getElementById('nameDisplay').innerHTML = `${JSON.parse(fromLS(fromLS('id') || fromSS('id')))['name']}`
        loginWindow.style.display = "none"
        homeWindow.style.display = "block"
    }
}

function checkIt() {
    if (!document.getElementById('checkRemember').checked) {
        document.getElementById('checkRemember').checked = true
    } else {
        document.getElementById('checkRemember').checked = false
    }
}

function dropdownToggle() {
    if (document.getElementById('dropdown').style.display == "none") {
        document.getElementById('dropdown').style.display = "block"
        document.getElementById('idDropdown').innerHTML = `<b>Id:</b> ${fromLS('id') || fromSS('id')}`
        return
    }
    if (document.getElementById('dropdown').style.display == "block") {
        document.getElementById('dropdown').style.display = "none"
        return
    }
}

function checkItSignup() {
    if (!document.getElementById('checkRememberSignup').checked) {
        document.getElementById('checkRememberSignup').chec
        ked = true
    } else {
        document.getElementById('checkRememberSignup').checked = false
    }
}

function login() {
    let userId = document.getElementById('userIdLogin')
    if (userId.value.split('').length < 4 || isNaN(userId.value)) {
        toggleToast('loginToast', '❗ Invalid Id', 2000)
        return
    }

    if (fromLS('uuids') === null || !fromLS('uuids').split(',').includes(userId.value.toString())) {
        toggleToast('loginToast', '❗ Wrong Id, <u style="cursor: pointer" onclick="register()">Create New<u>', 5000)
        return
    }

    if (document.getElementById('checkRemember').checked) {
        toLS('id', document.getElementById('userIdLogin').value)
    } else {
        toSS('id', document.getElementById('userIdLogin').value)
    }

    document.getElementById('nameDisplay').innerHTML = `${JSON.parse(fromLS(userId.value))['name']}`
    loginWindow.style.display = "none"
    homeWindow.style.display = "block"
}

function signup() {
    let username = document.getElementById('usernameInputField')
    let uniqueId = document.getElementById('uuidInputField')

    if (username.value.split('').length < 4 || !isNaN(username.value)) {
        toggleToast('signupToast', '❗ Invalid Name', 2000)
        return
    }

    if (uniqueId.value == "") {
        toggleToast('signupToast', '❗ Unique Id not generated', 3000)
        return
    }

    if (fromLS('uuids') === null) {
        toLS('uuids', [uniqueId.value])
    } else {
        let lsArray = fromLS('uuids').split(',')
        lsArray.push(uniqueId.value)
        toLS('uuids', lsArray)
    }

    const UserInformation = {
        "name": username.value,
        "uuid": uniqueId.value
    }
    toLS(uniqueId.value, JSON.stringify(UserInformation))

    if (document.getElementById('checkRememberSignup').checked) {
        toLS('id', uniqueId.value)
    } else {
        toSS('id', uniqueId.value)
    }

    let displayName = username.value
    document.getElementById('nameDisplay').innerHTML = `${displayName}`
    signupWindow.style.display = "none"
    homeWindow.style.display = "block"
}

function register() {
    loginWindow.style.display = "none"
    signupWindow.style.display = "block"
}

function uuidGenerated() {
    const generatedUuid = uuidManagement()
    document.getElementById('uuidInputField').value = generatedUuid
    document.getElementById('createNewId').style.display = "none"
    document.getElementById('alreadyAccount').style.fontSize = "normal"
}

function copyId(element) {
    let range, selection, worked;

    if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    document.execCommand('copy');
    toggleToast('homepageToast', '⠀Copied!', 1500);
}

function signout() {
    if (fromLS('id') === null) {
        sessionStorage.removeItem('id');
        location.reload()
        return
    } else {
        localStorage.removeItem('id');
        location.reload()
    }
}


// usefull functions
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

function toggleToast(elementId, text, time) {
    document.getElementById(elementId).innerHTML = text
    document.getElementById(elementId).style.display = "block"
    setTimeout(() => {
        document.getElementById(elementId).style.display = "none"
    }, time)
    return
}

function randInt(minimum, maximum) {
    min = Math.ceil(minimum);
    max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uuid() {
    let uuidArray = []
    i=0
    while (i<4) {
        let index = randInt(0, 9)
        uuidArray.push(index)
        i++
    }
    let finalUuid = uuidArray.join('')
    return finalUuid
}

function uuidManagement() {

    let firstUuid = uuid()
    if (fromLS('uuids') === null) {
        return firstUuid
    }
    let Uuid = uuid()
    let lsUuidArray = fromLS('uuids').split(',')
    while (true) {
        if (lsUuidArray.includes(Uuid)) {
            Uuid = uuid()
            continue
        } else {
            lsUuidArray.push(Uuid)
            return Uuid
        }
    }
}

function loginStyleWindow() {
    loginWindow.style.display = "block"
    homeWindow.style.display = "none"
}
