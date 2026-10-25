class APiUtils {
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayLoad
        }); // 200, 201
        if (!loginResponse.ok()) {
            throw new Error(`Login request failed with status ${loginResponse.status()}`);
        }
        const loginResponseJson = await loginResponse.json();
        const token = loginResponseJson.token;
        if (!token) {
            throw new Error("Login response did not contain an access token");
        }
        return token;
    }

    async createOrder(orderPayLoad) {
        let response = {};
        response.token = await this.getToken();
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayLoad,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        });

        if (!orderResponse.ok()) {
            throw new Error(`Order creation failed with status ${orderResponse.status()}`);
        }
        const orderResponseJson = await orderResponse.json();
        const orderId = orderResponseJson.orders[0];
        if (!orderId) {
            throw new Error("Order response did not contain an order ID");
        }
        response.orderId = orderId;

        return response;
    }
}

module.exports = { APiUtils };


