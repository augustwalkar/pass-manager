// let blackDot = '•'
// let password = document.querySelectorAll('.password')

// let passLength;
// let plainPass;
// let arr = []
// console.log(password)

// if (password) {
//     password.forEach((password) => {
//         password.textContent.split(' ').forEach((e) => {
//             if (e.length > 1) {
//                 console.log('e = ', e)
//             }
//         })
//     })
// password.textContent.split(' ').forEach((e) => {
//     if (e.length > 1) {
//         passLength = e.length - 1
//         plainPass = e
//     }
// })
// for (let i = 0; i < passLength; i++) {
//     arr.push(blackDot)
// }
// document.addEventListener('DOMContentLoaded', () => {
//     password.forEach((password) => {
//         password.textContent = hide
//     })
// })
// let hide = arr.join('')
// password.addEventListener('mouseover', () => {
//     password.textContent = plainPass
// })
// password.addEventListener('mouseleave', () => {
//     password.textContent = hide
// })
// }
/////
let password = document.querySelectorAll('.password')
let iconClass;
let icons = document.querySelectorAll('.fa-solid')
function remakeIcon() {
    icons.forEach(all => {
        all.classList.remove('fa-eye-slash')
        all.classList.add('fa-eye')
    })
}
function remakeType() {
    password.forEach((password) => {
        password.type = 'password'
    })
}
icons.forEach((icon, iconIndex) => {
    icon.addEventListener('click', (e) => {
        iconClass = e.target.classList

        if (iconClass.contains('fa-eye')) {
            remakeIcon()
            iconClass.remove('fa-eye')
            iconClass.add('fa-eye-slash')

        } else {
            remakeIcon()
            iconClass.remove('fa-eye-slash')
            iconClass.add('fa-eye')

        }
        remakeType()
        password.forEach((password, i) => {
            if (i === iconIndex && iconClass.contains('fa-eye-slash')) {
                password.type = 'text'
            } else {
                password.type = 'password'
            }
        })
    })
})