const bcrypt = require('bcrypt');

// const newPassword = 'AdminReza19';
const newPassword = 'mahamaha';
const hashedPassword = bcrypt.hashSync(newPassword, 8);

console.log('Hashed Password:', hashedPassword);
