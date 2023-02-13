var dbconfig = require('./dbconfig');
var mssql = require("mssql/msnodesqlv8");

var conn = new mssql.ConnectionPool(dbconfig);

async function getAllOrders() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from Order");
        await conn.close();
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrders() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from Order where status = 0");
        await conn.close();
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUserOrders(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request
            .input('customerId', sql.Int, userId)
            .query("SELECT * from Order WHERE customerId = @customerId");
        await conn.close();
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getCarts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from Order where status = 1");
        await conn.close();
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let order = await request
            .input('input_parameter', sql.Int, orderId)
            .query("SELECT * from Order where Id = @input_parameter");
        await conn.close();
        return order.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async  function addOrder(order) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let neworder = await request
            .input('customerId', sql.Int, order.customerId)
            .input('sumValue', sql.Float, order.sumValue)
            .input('status', sql.Bit, order.status)
            .input('time', sql.DateTime, order.time)
            .query("INSERT INTO Order (customerId, sumValue, status, time) VALUES (@customerId, @sumValue, @status, @time)");
        await conn.close();
        return neworder.recordsets();
    }
    catch (err) {
        console.log(err);
    }
}

async function saveCart(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        await request
            .input('orderId', sql.Int, orderId)
            .input('time', sql.DateTime, Date.now())
            .query("Update Order SET status = 0 , time = @time WHERE Id = @orderId");
        let userId = await request
            .input('orderId', sql.Int, orderId)
            .query("SELECT consumerId FROM Order WHERE Id = @orderId")
        let neworder = addOrder({
            customerId: userId,
            sumValue: 0.0,
            status: 1
        })
        await request
            .input('Id', sql.Int, userId)
            .input('cartID', sql.Int, neworder.Id)
            .query("UPDATE User SET cartID = @cartID WHERE id = @Id");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}


async function deleteOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        await request
            .input('input_parameter', sql.Int, userId)
            .query("DELETE FROM Link WHERE orderId = @input_parameter");

        await request
            .input('input_parameter', sql.Int, userId)
            .query("DELETE FROM Order WHERE Id = @input_parameter");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllProducts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from Product");
        await conn.close();
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getVisibleProducts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from Product where status = 1");
        await conn.close();
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getProduct(productId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let product = await request
            .input('input_parameter', sql.Int, productId)
            .query("SELECT * from Product where Id = @input_parameter");
        await conn.close();
        return product.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function addProduct(product) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let product = await request
            .input('title', sql.VarChar, product.title)
            .input('description', sql.VarChar, product.description)
            .input('value', sql.Float, product.value)
            .input('image', sql.VarBinary, product.image)
            .input('status', sql.Bir, product.status)
            .query("INSERT INTO Product (title, description, value, image, status) VALUES (@title, @description, @value, @image, @status)");
        await conn.close();
        return product.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteProduct(productId) {
    try {
        let carts = await cartLink();
        await conn.connect(); var request = new mssql.Request(conn);
        await request
            .input('input_parameter', sql.Int, productId)
            .query("UPDATE Product SET status = 0 where Id = @input_parameter");
        await request
            .input('input_parameter', sql.Int, productId)
            .query("DELETE FROM Link WHERE productId = @input_parameter AND orderID IN ${carts}");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}

async function editProduct(product) {
    try {
        await deleteProduct(product.Id)
        addProduct(product)
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllUsers() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from User");
        await conn.close();
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUsers() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from User where admin = 0");
        await conn.close();
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAdmins() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from User where admin = 1");
        await conn.close();
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUser(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let user = await request
            .input('input_parameter', sql.Int, usertId)
            .query("SELECT * from User where Id = @input_parameter");
        await conn.close();
        return user.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function findUser(username) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let user = await request
            .input('input_parameter', sql.VarChar, username)
            .query("SELECT * from User where username = @input_parameter");
        await conn.close();
        return user.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function addUser(user) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let nuser = await request
            .input('username', sql.VarChar, user.username)
            .input('password', sql.VarChar, user.password)
            .input('admin', sql.Bit, user.admin)
            .input('cartID', sql.Int, user.cartID)
            .query("INSERT INTO User (username, password, admin, cartID) VALUES (@username, @password, @admin, @cartID)");
        let neworder = addOrder({
            customerId: nuser.Id,
            sumValue: 0.0,
            status: 1
        })
        await request
            .input('Id', sql.Int, nuser.Id)
            .input('cartID', sql.Int, neworder.Id)
            .query("UPDATE User SET cartID = @cartID WHERE id = @Id");
        nuser.cartID = neworder.Id;
        await conn.close();
        return nuser.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

async function editUser(user) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let insertProduct = await request
            .input('Id', sql.Int, user.Id)
            .input('username', sql.VarChar, user.username)
            .input('password', sql.VarChar, user.password)
            .input('admin', sql.Bit, user.admin)
            .input('cartID', sql.Int, user.cartID)
            .query("UPDATE User SET username = @username, password = @password, admin = @admin, cartID = @cartID WHERE id = @Id");
        await conn.close();
        return insertProduct.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteUser(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let list = await request
            .input('input_parameter', sql.Int, userId)
            .query("SELECT Id from Order WHERE customerId = @input_parameter")
        list.recordsets.forEach(order => {
                deleteOrder(order.Id)
        })

        await request
            .input('input_parameter', sql.Int, userId)
            .query("DELETE FROM User WHERE Id = @input_parameter");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}

async function cartLink() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT Id from Order where status = 1");
        await conn.close();
        return orders.recordsets;
    }
    catch (error) {
        console.log(error);
    }
}

async function addProductToOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        await request
            .input('productId', sql.Int)
            .input('orderId', sql.Int)
            .query("INSERT INTO User (productId, orderId) VALUES (@productId, @orderId)");
        await conn.close();
    }
    catch (err) {
        console.log(err);
    }
}

async function findProductInOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let Id = await request
            .input('productId', sql.Int)
            .input('orderId', sql.Int)
            .query("SELECT Id FROM Link WHERE productId = @productId AND orderId = @orderId");
        await conn.close();
        return Id.recordsets();
    }
    catch (err) {
        console.log(err);
    }
}

async function getProductsfromOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request
            .input('orderId', sql.Int)
            .query("SELECT * FROM Link WHERE orderId = @orderId");
        await conn.close();
        return products.recordsets();
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteProductFromOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        await request
            .input('productId', sql.Int)
            .input('orderId', sql.Int)
            .query("DELETE FROM Link WHERE productId = @productId AND orderId = @orderId");
        await conn.close();
    }
    catch (err) {
        console.log(err);
    }
}


module.exports = {
    getAllOrders: getAllOrders,
    getOrders: getOrders,
    getUserOrders: getUserOrders,
    getCarts: getCarts,
    getOrder: getOrder,
    addOrder: addOrder,
    deleteOrder: deleteOrder,
    saveCart: saveCart,
    getAllProducts: getAllProducts,
    getVisibleProducts: getVisibleProducts,
    getProduct: getProduct,
    addProduct: addProduct,
    deleteProduct: deleteProduct,
    editProduct: editProduct,
    getAllUsers: getAllUsers,
    getUsers: getUsers,
    getAdmins: getAdmins,
    getUser: getUser,
    findUser: findUser,
    addUser: addUser,
    editUser: editUser,
    deleteUser: deleteUser,
    cartLink: cartLink,
    addProductToOrder: addProductToOrder,
    findProductInOrder: findProductInOrder,
    getProductsfromOrder: getProductsfromOrder,
    deleteProductFromOrder: deleteProductFromOrder
}