var dbconfig = require('./dbconfig');
var mssql = require("mssql/msnodesqlv8");

var conn = new mssql.ConnectionPool(dbconfig);

async function getAllOrders() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from [dbo].[Order]");
        await conn.close();
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrders() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from [dbo].[Order] where [status] = 0");
        await conn.close();
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUserOrders(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('customerId', userId);
        let orders = await request.query("SELECT * from [dbo].[Order] WHERE [customerId] = @customerId");
        await conn.close();
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getCarts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT * from [dbo].[Order] where [status] = 1");
        await conn.close();
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', orderId);
        let order = await request.query("SELECT * from [dbo].[Order] where [Id] = @input_parameter");
        await conn.close();
        return order.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async  function addOrder(order) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('customerId', order.customerId);
        request.input('sumValue', order.sumValue);
        request.input('status', order.status);
        request.input('time', order.time);
        let neworder = await request.query("INSERT INTO [dbo].[Order] ([customerId], [sumValue], [status], [time]) VALUES (@customerId, @sumValue, @status, @time)");
        await conn.close();
        return neworder.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function saveCart(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);

        request.input('orderId', orderId);
        request.input('time', Date.now());
        await request.query("Update [dbo].[Order] SET [status] = 0 , [time] = @time WHERE [Id] = @orderId");
        var request = new mssql.Request(conn);
        request.input('orderId', orderId);
        let userId = await request.query("SELECT consumerId FROM [dbo].[Order] WHERE [Id] = @orderId")
        let neworder = addOrder({
            customerId: userId,
            sumValue: 0.0,
            status: 1
        })
        var request = new mssql.Request(conn);
        request.input('Id', userId);
        request.input('cartID', neworder.Id);
        await request.query("UPDATE [dbo].[User] SET [cartID] = @cartID WHERE [id] = @Id");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}


async function deleteOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', orderId);
        await request.query("DELETE FROM [dbo].[Link] WHERE [orderId] = @input_parameter");
        var request = new mssql.Request(conn);
        request.input('input_parameter', orderId);
        await request.query("DELETE FROM [dbo].[Order] WHERE [Id] = @input_parameter");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}

async function getAllProducts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from [dbo].[Product]");
        await conn.close();
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getVisibleProducts() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from [dbo].[Product] where [status] = 1");
        await conn.close();
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getProduct(productId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', productId);
        let product = await request.query("SELECT * from [dbo].[Product] where [Id] = @input_parameter");
        await conn.close();
        return product.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addProduct(product) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('title', product.title);
        request.input('description', product.description);
        request.input('value', product.value);
        request.input('image', product.image);
        request.input('status', product.status);
        let product2 = await request.query("INSERT INTO [dbo].[Product] ([title], [description], [value], [image], [status]) VALUES (@title, @description, @value, @image, @status)");
        await conn.close();
        return product2.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteProduct(productId) {
    try {
        let carts = await cartLink();
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', productId);
        await request.query("UPDATE [dbo].[Product] SET [status] = 0 where [Id] = @input_parameter");
        var request = new mssql.Request(conn);
        request.input('input_parameter', productId);
        await request.query("DELETE FROM [dbo].[Link] WHERE [productId] = @input_parameter AND [orderID] IN ${carts}");
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
        let products = await request.query("SELECT * from [dbo].[User]");
        await conn.close();
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUsers() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from [dbo].[User] where [admin] = 0");
        await conn.close();
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getAdmins() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let products = await request.query("SELECT * from [dbo].[User] where [admin] = 1");
        await conn.close();
        return products.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function getUser(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', userId);
        let user = await request.query("SELECT * from [dbo].[User] where [Id] = @input_parameter");
        await conn.close();
        return user.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function findUser(username) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', username);
        let user = await request.query("SELECT * from [dbo].[User] where [username] = @input_parameter");
        await conn.close();
        return user.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addUser(user) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        console.log(user.username);
        request.input('username', user.username);
        request.input('password', user.password);
        request.input('admin', user.admin);
        request.input('cartID', user.cartID);
        let nuser = await request.query('INSERT INTO [dbo].[User] ([username], [password], [admin], [cartID]) VALUES (@username, @password, @admin, @cartID)');
        let neworder = addOrder({
            customerId: nuser.Id,
            sumValue: 0.0,
            status: 1
        })
        var request = new mssql.Request(conn);
        request.input('Id', nuser.Id);
        request.input('cartID', neworder.Id);
        await request.query('update [dbo].[User] set [cartID] = @cartID where [Id] = @Id');
        nuser.cartID = neworder.Id;
        await conn.close();
        return nuser.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function editUser(user) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('Id', user.Id);
        request.input('username', user.username);
        request.input('password', user.password);
        request.input('admin', user.admin);
        request.input('cartID', user.cartID);
        let insertProduct = await request.query("UPDATE [dbo].[User] SET [username] = @username, [password] = @password, [admin] = @admin, [cartID] = @cartID WHERE [id] = @Id");
        await conn.close();
        return insertProduct.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteUser(userId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('input_parameter', userId);
        let list = await request.query("SELECT Id from [dbo].[Order] WHERE [customerId] = @input_parameter")
        list.recordset.forEach(order => {
                deleteOrder(order.Id)
        })
        var request = new mssql.Request(conn);
        request.input('input_parameter', userId);
        await request.query("DELETE FROM [dbo].[User] WHERE [Id] = @input_parameter");
        await conn.close();
    }
    catch (error) {
        console.log(error);
    }
}

async function cartLink() {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        let orders = await request.query("SELECT Id from [dbo].[Order] where [status] = 1");
        await conn.close();
        return orders.recordset;
    }
    catch (error) {
        console.log(error);
    }
}

async function addProductToOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('productId', productId);
        request.input('orderId', orderId);
        await request.query("INSERT INTO [dbo].[User] ([productId], [orderId]) VALUES (@productId, @orderId)");
        await conn.close();
    }
    catch (err) {
        console.log(err);
    }
}

async function findProductInOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('productId', productId);
        request.input('orderId', orderId);
        let Id = await request.query("SELECT Id FROM [dbo].[Link] WHERE [productId] = @productId AND [orderId] = @orderId");
        await conn.close();
        return Id.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function getProductsfromOrder(orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('orderId', orderId);
        let products = await request.query("SELECT * FROM [dbo].[Link] WHERE [orderId] = @orderId");
        await conn.close();
        return products.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function deleteProductFromOrder(productId, orderId) {
    try {
        await conn.connect(); var request = new mssql.Request(conn);
        request.input('productId', productId);
        request.input('orderId', orderId);
        await request.query("DELETE FROM [dbo].[Link] WHERE [productId] = @productId AND [orderId] = @orderId");
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