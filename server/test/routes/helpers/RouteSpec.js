/* eslint no-unused-expressions:0, max-nested-callbacks: [2, 5] */


import Route from "../../../src/routes/helpers/Route";
import { mockResponse } from "../../helpers/MockResponse";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import { assert } from "chai";

describe("Route", () => {
    describe("isValidRequestData", () => {
        let response = null, next = null;
        before("Route", () => {
            response = {};
            next = {};
        });
        it("should validate the invalid request data and throw error", () => {
            let route = new Route({}, response);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should return false if id is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds" }
                ]
            };
            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should return false if url is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "timestamp": "12345", "url": "", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should return false if timestamp is not present in the request body", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(false, route.isValidRequestData());
        });

        it("should not return false if request body is valid", () => {
            let requestBody = {
                "data": [
                    { "url": "http://www.twitter.com/testuser", "id": "1", "timestamp": "12556" },
                    { "timestamp": "12556", "url": "http://www.test.com/testfeeds", "id": "2" }
                ]
            };

            let route = new Route({ "body": requestBody }, response, next);
            assert.strictEqual(true, route.isValidRequestData());
        });
    });

    describe("validate Number", () => {
        let route = null;
        beforeEach("validate Number", () => {
            route = new Route({}, {});
        });
        it("should return zero if the input string can not be parsed to Integer", () => {
            assert.strictEqual(route.validateNumber("a"), 0); //eslint-disable-line no-magic-numbers
        });

        it("should return zero if the input is a negative number", () => {
            assert.strictEqual(route.validateNumber("-1"), 0); //eslint-disable-line no-magic-numbers
        });

        it("should return the converted integer if it's a valid integer", () => {
            assert.strictEqual(route.validateNumber("4"), 4); //eslint-disable-line no-magic-numbers
        });

        it("should return the converted floor of the integer if it's a valid float", () => {
            assert.strictEqual(route.validateNumber("4.9"), 4); //eslint-disable-line no-magic-numbers
        });
    });

    describe("process", () => {
        it("call handle invalid request if validate gives message", () => {

            let MyRoute = class MyRoute extends Route {
                constructor(request, response, next) {
                    super(request, response, next);
                }
                validate() {
                    return "invalid request";
                }
            };
            let response = mockResponse();
            new MyRoute({}, response).process();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
            assert.deepEqual(response.json(), { "message": "invalid request" });
        });

        it("call handle invalid request if default validate gives message", () => {

            let MyRoute = class MyRoute extends Route {
                constructor(request, response, next) {
                    super(request, response, next);
                }
                validate() {
                    let id = "test", name = "";
                    return super.validate(id, name) || "invalid custom parameters";
                }
            };
            let response = mockResponse();
            new MyRoute({}, response).process();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.UNPROCESSABLE_ENTITY);
            assert.deepEqual(response.json(), { "message": "missing parameters" });
        });

        it("call handle failure if handle throws error", () => {

            let MyRoute = class MyRoute extends Route {
                constructor(request, response, next) {
                    super(request, response, next);
                }
                validate() {
                    return false;
                }
                handle() {
                    let error = "processing failed";
                    throw error;
                }
            };
            let response = mockResponse();
            new MyRoute({}, response).process();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.BAD_REQUEST);
            assert.deepEqual(response.json(), { "message": "processing failed" });
        });

        it("update response if handle success", async() => {

            let MyRoute = class MyRoute extends Route {
                constructor(request, response, next) {
                    super(request, response, next);
                }
                validate() {
                    return false;
                }
                async handle() {
                    return { "feeds": [] };
                }
            };
            let response = mockResponse();
            await new MyRoute({}, response).process();
            assert.strictEqual(response.status(), HttpResponseHandler.codes.OK);
            assert.deepEqual(response.json(), { "feeds": [] });
        });
    });
});

