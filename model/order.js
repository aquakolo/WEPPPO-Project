class Order {
    constructor(Id, customerId, sumValue, status, time) {
        this.Id = Id;
        this.customerId = customerId;
        this.sumValue = sumValue;
        this.status = status;
        this.time = time;
    }
}

module.exports = Order;