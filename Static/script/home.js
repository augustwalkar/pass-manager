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