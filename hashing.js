let str = 'abcd'

//encrypt variables
let encryptCharArr;
let encryptCharCodeArr = []
let encryptFinalArr = []
let newStr = ''
let encryptNewArr = []
//decrypt variables
let decryptCharArr;
let decryptCharCodeArr = []
let decryptFinalArr = []
let decryptNewArr = []
function encrypt(str) {
    encryptCharArr = str.split('')
    encryptCharArr.forEach((char) => {
        encryptCharCodeArr.push(char.charCodeAt() + 1)
    })
    encryptCharCodeArr.forEach((code) => {
        encryptFinalArr.push(String.fromCharCode(code))
    })
    encryptNewStr = encryptFinalArr.join('')

}
function decrypt(str) {
    decryptCharArr = str.split('')
    decryptCharArr.forEach((char) => {
        decryptCharCodeArr.push(char.charCodeAt() - 1)
    })
    decryptCharCodeArr.forEach((code) => {
        decryptFinalArr.push(String.fromCharCode(code))
    })
    decryptNewStr = decryptFinalArr.join('')
}
encrypt(str)
decrypt(newStr)
console.log('plain text:', str)
console.log('encrypted:', encryptNewStr)
console.log('decrypted:', decryptNewStr)

// let arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', ' ',]
