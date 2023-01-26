const {Builder, By, Key, util} = require("selenium-webdriver");
const mainModule = require("../modules/mainModule");
const config = require("../config.json");

describe("Login", function () {
    this.timeout(60000)
    let driver
    beforeEach(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await mainModule.setDriver(driver);
        await driver.manage().window().setRect({width: config.resolution.x, height: config.resolution.y});
    });
    afterEach(async function () {
        await driver.quit();
    });

    it("1. Login attempt - no data", async function () {
        await mainModule.login({
            fill_in_data: false,
            login_statement: true,
            verify_page: true,
            statement_text: "Error",
            full_statement_text: "Error: Username is required.",
        });
    });

    it("2. Login attempt - incorrect data", async function () {
        await mainModule.login({
            login_statement: true,
            verify_page: true,
            login: "test",
            password: "test12345678?",
            statement_text: "ERROR",
            full_statement_text: "ERROR: The password you entered for the username test is incorrect. Lost your password?",
        });
    });

    it("3. Successful login", async function () {
        await mainModule.login({
            verify_page: true,
            login: "hello1@test.pl",
            password: "test12345678?A",
        });
    });
});