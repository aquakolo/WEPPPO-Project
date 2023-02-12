class User {
    constructor(Id, username, password, admin, cartID) {
        this.Id = Id;
        this.username = username;
        this.password = password;
        this.admin = admin;
        this.cartID = cartID;
    }
}

module.exports = User;