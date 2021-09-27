const homeWindow = document.getElementById('block1')
const loginWindow = document.getElementById('block2')
const signupWindow = document.getElementById('block3')
const loadWindow = document.getElementById('block4')

// {'friends': [['name', 'id', 'status']]}

window.onload = () => {
    if (fromLS('id') === null && fromSS('id') === null) {
        loginWindow.style.display = "block"
        homeWindow.style.display = "none"
    } else {
        document.getElementById('nameDisplay').innerHTML = `${JSON.parse(fromLS(fromLS('id') || fromSS('id')))['name']}`
        loginWindow.style.display = "none"
        homeWindow.style.display = "block"

        if ("friends" in (JSON.parse(fromLS(fromLS('id') || fromSS('id'))))) {
            const friendsList = JSON.parse(fromLS(fromLS('id') || fromSS('id')))['friends']
            for (let i in friendsList) {
                let friend = friendsList[i]

                const friendsDetailPage = document.getElementById('friendsDetails')

                let friendTable = document.createElement('table')
                friendTable.setAttribute('class', 'table')
                friendTable.setAttribute('id', 'friendsTable')

                const friendDetails = `
                    <tbody>
                        <tr>
                            <th scope="row"><img id="friendsDpDisplay"></th>
                            <td>${friend[0]}</td>
                            <td>${friend[1]}</td>
                            <td>${friend[2]}</td>
                        </tr>
                    </tbody>
                `
                friendTable.innerHTML = friendDetails
                friendsDetailPage.appendChild(friendTable)
            }
        }
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
        document.getElementById('checkRememberSignup').checked = true
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

    loginWindow.style.display = "none";
    loadWindow.style.display = "block"
    document.getElementById('loader').style.display = "block"

    setTimeout(function() {
        document.getElementById('nameDisplay').innerHTML = `${JSON.parse(fromLS(userId.value))['name']}`
        loadWindow.style.display = "none"
        document.getElementById('loader').style.display = "none"
        homeWindow.style.display = "block"

        if ("friends" in (JSON.parse(fromLS(fromLS('id') || fromSS('id'))))) {
            const friendsList = JSON.parse(fromLS(fromLS('id') || fromSS('id')))['friends']
            for (let i in friendsList) {
                let friend = friendsList[i]

                const friendsDetailPage = document.getElementById('friendsDetails')

                let friendTable = document.createElement('table')
                friendTable.setAttribute('class', 'table')
                friendTable.setAttribute('id', 'friendsTable')

                const friendDetails = `
                    <tbody>
                        <tr>
                            <th scope="row"><img id="friendsDpDisplay"></th>
                            <td>${friend[0]}</td>
                            <td>${friend[1]}</td>
                            <td>${friend[2]}</td>
                        </tr>
                    </tbody>
                `
                friendTable.innerHTML = friendDetails
                friendsDetailPage.appendChild(friendTable)
            }
        }
    }, 1500);
}

function signup() {
    let username = document.getElementById('usernameInputField')
    let uniqueId = document.getElementById('uuidInputField')

    if (username.value.split('').length < 4 || isNaS(username.value)) {
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
        let lsArrayUuids = fromLS('uuids').split(',')
        lsArrayUuids.push(uniqueId.value)
        toLS('uuids', lsArrayUuids)
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

    signupWindow.style.display = "none";
    loadWindow.style.display = "block"
    document.getElementById('loader').style.display = "block"

    setTimeout(function() {
        let displayName = username.value
        document.getElementById('nameDisplay').innerHTML = `${displayName}`
        signupWindow.style.display = "none"
        loadWindow.style.display = "none"
        document.getElementById('loader').style.display = "none"
        homeWindow.style.display = "block"
    }, 1500);
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

function showAddFriend() {
    document.getElementById('addFriendModal').style.display = 'block'
}

function cancelAddFriend() {
    document.getElementById('addFriendModal').style.display = 'none'
    document.getElementById('friendId').value = ""
}

function addFriendEvent() {
    let friendId = document.getElementById('friendId')
    if (friendId.value.split('').length < 4 || isNaN(friendId.value)) {
        toggleToast('homepageToast', '❗ Invalid Id', 2000)
        return
    } else if (fromLS(friendId.value) == null) {
        toggleToast('homepageToast', '❗ User doesn\'t exist', 2000)
        return
    } else if (friendId.value == fromLS('id') || friendId.value == fromSS('id')) {
        toggleToast('homepageToast', "⠀You can't add yourself as your friend", 3000)
        return
    } else {
        let userIEmyDetails = JSON.parse(fromLS(fromLS('id') || fromSS('id')))
        if (userIEmyDetails['friends'] !== null) {
            userIEmyDetails = userIEmyDetails['friends']
            for (let i in userIEmyDetails) {
                if (userIEmyDetails[i][1] == friendId.value) {
                    toggleToast('homepageToast', "❗ You both are already friends", 2000)
                    return
                }
            }
        }
    }

    let nameOfFriend = JSON.parse(fromLS(friendId.value))['name']
    let id = friendId.value

    const friendInfo = [
        [nameOfFriend, id, 'status']
    ]

    let myDetails = JSON.parse(fromLS(fromLS('id') || fromSS('id')))
    const myInfoForFriend = [
        [myDetails['name'], myDetails['uuid'], 'status']
    ]

    if (!("friends" in myDetails)) {
        myDetails['friends'] = friendInfo
        myDetails = JSON.stringify(myDetails)
        toLS(fromLS('id') || fromSS('id'), myDetails)

        let temporaryFriendDetail = JSON.parse(fromLS(friendId.value))
        if (!("friends" in (JSON.parse(fromLS(friendId.value))))) {
            temporaryFriendDetail['friends'] = myInfoForFriend
            temporaryFriendDetail = JSON.stringify(temporaryFriendDetail)
            toLS(friendId.value, temporaryFriendDetail)
        } else {
            temporaryFriendDetail['friends'].push(myInfoForFriend[0])
            temporaryFriendDetail = JSON.stringify(temporaryFriendDetail)
            toLS(friendId.value, temporaryFriendDetail)
        }
    } else {
        myDetails['friends'].push(friendInfo[0])
        myDetails = JSON.stringify(myDetails)
        toLS(fromLS('id') || fromSS('id'), myDetails)

        let temporaryFriendDetail = JSON.parse(fromLS(friendId.value))
        if (!("friends" in (JSON.parse(fromLS(friendId.value))))) {
            temporaryFriendDetail['friends'] = myInfoForFriend
            temporaryFriendDetail = JSON.stringify(temporaryFriendDetail)
            toLS(friendId.value, temporaryFriendDetail)
        } else {
            temporaryFriendDetail['friends'].push(myInfoForFriend[0])
            temporaryFriendDetail = JSON.stringify(temporaryFriendDetail)
            toLS(friendId.value, temporaryFriendDetail)
        }
    }
    location.reload()
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
    i = 0
    while (i < 4) {
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

function isNaS(string) {
    string = string.split('')
    for (let i in string) {
        if (!isNaN(string[i])) {
            return true
        }
    }
    false
}

function loginStyleWindow() {
    loginWindow.style.display = "block"
    homeWindow.style.display = "none"
}
