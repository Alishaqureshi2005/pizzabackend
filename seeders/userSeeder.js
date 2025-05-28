const User = require('../models/User');
const bcrypt = require('bcryptjs');

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    isActive: true
  }
];

const importData = async () => {
  try {
    await User.deleteMany({});

    // Hash passwords before inserting users
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log('Users Imported!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany({});
    console.log('Users Destroyed!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  importData,
  destroyData
};
