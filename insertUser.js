const { User } = require('./models'); // Make sure to import your User model

async function insertUser() {
    try {
        //Insert user into database
        const user = await User.create({ balance: 10000 });
        console.log('User created successfully:', user);
    } catch (error) {
        console.error('Error inserting user:', error);
    }
}

insertUser();