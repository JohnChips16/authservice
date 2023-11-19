const addon = require('./build/Release/hash');

// Hash a password
const password = 'mypass';
console.log(password)
const hashedPassword = addon(password);
console.log('Hashed Password:', hashedPassword.toString('hex'));


const password1 = 'mypass'
console.log(password1)
const hashedPassword1 = addon(password1);
console.log('Hashed Password:', hashedPassword1.toString('hex'));

//    compare

const input = 'mypass'
console.log(input)
const hashpwd = addon(input).toString('hex')
console.log('hashed', hashpwd)
const isMatch = addon(input).toString('hex') === hashpwd
console.log(isMatch)


const dsb = 'mypass'
const dsbf = 'falsepass'
console.log(dsb)
const hashdsb = addon(dsb).toString('hex')
console.log('hashed', hashdsb)
const match = addon(dsb).toString('hex') === hashdsb
console.log(match)









// Verify a password
// const inputPassword = 'mypass';
// const isMatch = addon.verifyPassword(hashedPassword, inputPassword);

// if (isMatch) {
//     console.log('Password is correct.');
// } else {
//     console.log('Password is incorrect.');
// }
