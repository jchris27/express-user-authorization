const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = usersDB.users.find(person => person.username === user);
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    //evaluate the password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        // grab the roles in the users json file
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' } // production 5m-15m
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // saving refreshToken with current user to DB
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        // set the cookie and name it 'jwt'
        // during development set secure: false for the thunder client to work
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 }); //1 day
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    };
};

module.exports = { handleLogin };