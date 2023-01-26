const {Builder, By, Key} = require("selenium-webdriver");
const config = require("../config.json");
const {assert, expect} = require("chai");

async function setDriver(browser) {
    driver = browser;
}

async function waitUntilFindElement(selector) {
    let elementVisible = false;
    while (elementVisible === false) {
        elementVisible = await isVisible(selector);
    }
}

async function isVisible(selector) {
    return await driver.findElement(selector).then(async function (visible) {
        return true;
    }, async function (err) {
        if (err.name && err.name === 'NoSuchElementError') {
            return false;
        } else {
            return 'something go wrong';
        }
    });
}

async function waitForText(text) {
    let page;
    while (true) {
        page = await driver.findElement(By.xpath('//*[contains(.,\'\')]')).getText();
        if (page.includes(text)) {
            break;
        }
    }
}

async function login({
                         fill_in_data = true,
                         login_statement,
                         verify_page,
                         login,
                         password,
                         statement_text,
                         full_statement_text,
                     }) {
    await driver.get(config.webAddress);
    await waitUntilFindElement(By.xpath("//a[contains(text(),'Account')]"));
    await driver.findElement(By.xpath("//a[contains(text(),'Account')]")).click();
    await waitUntilFindElement(By.name("login"));
    if (fill_in_data) {
        await driver.findElement(By.id("username")).sendKeys(login);
        await driver.findElement(By.id("password")).sendKeys(password);
    }
    await driver.findElement(By.name("login")).click();
    if (login_statement) {
        await waitForText(statement_text);
        let page = await driver.findElement(By.xpath("//*[@id=\"post-8\"]/div[2]/ul/li")).getText()
        expect(page).equal(full_statement_text);
    }
    if (verify_page) {
        let url = await driver.getCurrentUrl()
        assert.equal(url, config.webAddress + "/my-account/");
    }
}

module.exports = {
    setDriver,
    waitUntilFindElement,
    isVisible,
    waitForText,
    login,
}