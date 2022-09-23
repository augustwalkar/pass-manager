let title = document.querySelector('.title-input')
let dynamic;
let timer = 1;
setInterval(() => {
    if (timer > 3) {
        timer = 1
    }
    if (timer === 1) {
        dynamic = 'App name'
    } else if (timer === 2) {
        dynamic = 'Website Name'
    } else if (timer === 3) {
        dynamic = 'Software name'
    }
    timer += 1
    title.setAttribute("placeholder", dynamic)

}, 2000)


