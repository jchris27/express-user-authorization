const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};
const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// define handler for user information
const handleNewUser = async (req, res) => {
    // deconsturct from the body
    const { user, pwd } = req.body;
    console.log(user, pwd)

    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate username in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    console.log('duplicate = ', duplicate)
    if (duplicate) return res.sendStatus(409); // conflict error
    try {
        // encrypt the password using bcrypt
        const hashedPwd = await bcrypt.hash(pwd, 10); // add salt for additional protection
        // store the new user
        const newUser = {
            "username": user,
            "roles": { "User": 2001 },
            "password": hashedPwd
        }
        // create a new array and adding the new user
        usersDB.setUsers([...usersDB.users, newUser])
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        res.status(201).json({ 'message': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    };
};

module.exports = { handleNewUser };