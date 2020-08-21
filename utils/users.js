// Create users array
const users = [];

// Add user to a room - user joins chat
function userJoin(id, username, room) {
    // Set user with info
    const user = { id, username, room };
    
    // Add each user to an array
    users.push(user);

    return user;
};

// Get current user - find user by id
function getCurrentUser(id) {
    return users.find(user => user.id === id);
};

// User leaves chat - find user by id and remove user from the array
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    // Check index - if user is found, return user; otherwise returns -1
    if(index !== -1) {
        // Return the array without the user
        return users.splice(index, 1)[0];
    }
};

// Get room's users
function getRoomUsers(room) {
    // Find users in one room
    return users.filter(user => user.room === room);
};

// Export user and room info to server
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};