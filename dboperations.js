var dbconfig = require('./dbconfig');
var mssql = require("mssql/msnodesqlv8");
var moment=require('moment');

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
        console.log(orders)
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
        request.input('time', moment().format('YYYY-MM-DD HH:mm:ss'));
        await request.query("Update [dbo].[Order] SET [status] = 0 , [time] = @time WHERE [Id] = @orderId");
        var request = new mssql.Request(conn);
        request.input('orderId', orderId);
        let userId = await request.query("SELECT [customerId] FROM [dbo].[Order] WHERE [Id] = @orderId");
        let neworder = await addOrder({
            customerId: userId.recordset[0].customerId,
            sumValue: 0.0,
            status: 1,
            time: null
        });
        var request = new mssql.Request(conn);
        request.input('Id', userId.recordset[0].customerId);
        request.input('cartID', neworder[0].Id);
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
        let products = await request.query("SELECT * from [dbo].[Products]");
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
        let products = await request.query("SELECT * from [dbo].[Products] where [status] = 1");
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
        let product = await request.query("SELECT * from [dbo].[Products] where [Id] = @input_parameter");
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
        let product2 = await request.query("INSERT INTO [dbo].[Products] ([title], [description], [value], [image], [status]) VALUES (@title, @description, @value, @image, @status)");
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
        await request.query("UPDATE [dbo].[Products] SET [status] = 0 where [Id] = @input_parameter");
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
        let order = {
            customerId: nuser.recordset.Id,
            sumValue: 0.0,
            status: 1
        };
        let neworder = await addOrder(order)
        var request = new mssql.Request(conn);
        request.input('Id', nuser.recordset.Id);
        request.input('cartID', neworder.recordset.Id);
        await request.query('update [dbo].[User] set [cartID] = @cartID where [Id] = @Id');
        nuser.cartID = neworder.recordset.Id;
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
        var product = await request.query("Select [count] from [dbo].[Link] WHERE [productId] = @productId AND [orderId] = @orderId");
        if (product.recordset.length == 0) {
            console.log("insert")
            var request = new mssql.Request(conn);
            request.input('productId', productId);
            request.input('orderId', orderId);
            request.input('count', 1)
            await request.query("INSERT INTO [dbo].[Link] ([productId], [orderId], [count]) VALUES (@productId, @orderId, @count)");
        }
        else {
            console.log("update")
            var request = new mssql.Request(conn);
            request.input('productId', productId);
            request.input('orderId', orderId);
            request.input('count', product.recordset[0].count + 1);
            await request.query("UPDATE [dbo].[Link] SET [count] = @count WHERE [productId] = @productId AND [orderId] = @orderId");
        }

        var request = new mssql.Request(conn);
        request.input('orderId', orderId);
        var order = await request.query("Select [sumValue] from [dbo].[Order] WHERE [Id] = @orderId");
        var request = new mssql.Request(conn);
        request.input('productId', productId);
        var pvalue = await request.query("Select [value] from [dbo].[Products] WHERE [Id] = @productId");
        request.input('orderId', orderId);
        request.input('sumValue', order.recordset[0].sumValue + pvalue.recordset[0].value);
        await request.query("UPDATE [dbo].[Order] SET [sumValue] = @sumValue WHERE [Id] = @orderId");

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
        let products = await request.query("SELECT * FROM [dbo].[Products] where [Id] IN (SELECT [productId] FROM [dbo].[Link] WHERE [orderId] = @orderId)");
        var request = new mssql.Request(conn);
        request.input('orderId', orderId);
        const map = new Map();
        await request.query("SELECT * FROM [dbo].[Link] WHERE [orderId] = @orderId").then(links => {
            links.recordset.forEach(link => {
                map.set(link.productId, link.count == null ? 1 : link.count);
            });
        })
        await conn.close();

        product2 = [];

        products.recordset.forEach(product => {
            product.count = map.get(product.Id);
            product.sumValue = product.value * product.count;
            product2.push(product)
        });


        return product2;
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
        var product = await request.query("Select [count] from [dbo].[Link] WHERE [productId] = @productId AND [orderId] = @orderId");
        console.log(product);
        if (product.recordset.length > 0) {
            if (product.recordset[0].count == 1) {
                console.log("delete");
                var request = new mssql.Request(conn);
                request.input('productId', productId);
                request.input('orderId', orderId);
                await request.query("DELETE FROM [dbo].[Link] WHERE [productId] = @productId AND [orderId] = @orderId");
            }
            else {
                console.log("decrese");
                var request = new mssql.Request(conn);
                request.input('productId', productId);
                request.input('orderId', orderId);
                request.input('count', parseInt(product.recordset[0].count) - 1)
                await request.query("UPDATE [dbo].[Link] SET [count] = @count WHERE [productId] = @productId AND [orderId] = @orderId");
            }
            var request = new mssql.Request(conn);
            request.input('orderId', orderId);
            var order = await request.query("Select [sumValue] from [dbo].[Order] WHERE [Id] = @orderId");
            var request = new mssql.Request(conn);
            request.input('productId', productId);
            var pvalue = await request.query("Select [value] from [dbo].[Products] WHERE [Id] = @productId");
            request.input('orderId', orderId);
            request.input('sumValue', parseInt(order.recordset[0].sumValue) - parseInt(pvalue.recordset[0].value));
            await request.query("UPDATE [dbo].[Order] SET [sumValue] = @sumValue WHERE [Id] = @orderId");
        }
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