import { expect } from "chai";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import * as sourceConfigActions from "./../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { REMOVE_SOURCE } from "./../../../src/js/newsboard/filter/FilterActions";
import * as WebConfigActions from "./../../../src/js/config/actions/WebConfigureActions";
import * as FbActions from "./../../../src/js/config/actions/FacebookConfigureActions";
import * as TwitterConfigureActions from "./../../../src/js/config/actions/TwitterConfigureActions";
import sinon from "sinon";
import AppWindow from "../../../src/js/utils/AppWindow";
import HttpResponseHandler from "../../../../common/src/HttpResponseHandler";
import nock from "nock";
import Toast from "../../../src/js/utils/custom_templates/Toast";
import Locale from "./../../../src/js/utils/Locale";

describe("SourceConfigurationActions", () => {
    describe("configured sources", () => {
        let sandbox = null;

        beforeEach("configured sources", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("configured sources", () => {
            sandbox.restore();
        });

        it(`should return ${sourceConfigActions.GOT_CONFIGURED_SOURCES} action when it receives configured sources`, () => {
            let sources = [{ "name": "Profile1" }, { "name": "Profile2" }];
            let action = sourceConfigActions.configuredSourcesReceived(sources);
            expect(action.type).to.equal(sourceConfigActions.GOT_CONFIGURED_SOURCES);
            expect(action.sources).to.deep.equal(sources);
        });

        it(`should dispatch ${sourceConfigActions.GOT_CONFIGURED_SOURCES} once it gets the configured sources from server`, (done) => {
            let sources = { "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };

            let ajaxClient = AjaxClient.instance("/configure-sources");
            sandbox.mock(AjaxClient).expects("instance").withArgs("/configure-sources").returns(ajaxClient);
            sandbox.stub(ajaxClient, "get").withArgs().returns(Promise.resolve(sources));

            let store = mockStore({}, [{ "type": sourceConfigActions.GOT_CONFIGURED_SOURCES, "sources": sources }], done);
            store.dispatch(sourceConfigActions.getConfiguredSources());
        });
    });

    describe("source results", () => {
        it(`should return ${sourceConfigActions.CLEAR_SOURCES} when request for clearSources action`, () => {
            expect(sourceConfigActions.clearSources).to.deep.equal({ "type": sourceConfigActions.CLEAR_SOURCES });
        });
    });

    describe("switch current Tab", () => {
        it("should return the FACEBOOK_CHANGE_CURRENT_TAB action", () => {
            let currentTab = "Pages";
            let facebookSourceTabSwitch = sourceConfigActions.switchSourceTab(currentTab);
            expect(facebookSourceTabSwitch.type).to.equal(sourceConfigActions.CHANGE_CURRENT_SOURCE_TAB);
            expect(facebookSourceTabSwitch.currentTab).to.equal(currentTab);
        });
    });

    describe("getSources", () => {
        let sandbox = null, twitterPreFirstId = null;
        let keyword = "bla";
        beforeEach("", () => {
            sandbox = sinon.sandbox.create();
            twitterPreFirstId = 0; //eslint-disable-line no-magic-numbers
        });

        afterEach("", () => {
            sandbox.restore();
        });

        it("should delegate to fetchFacebookSources for pages if sourceType is pages", () => {
            let fetchFacebookPagesMock = sandbox.mock(FbActions).expects("fetchFacebookSources")
                .withExactArgs(keyword, "page", FbActions.PAGES, {});
            sourceConfigActions.getSources(FbActions.PAGES, keyword, {}, twitterPreFirstId);
            fetchFacebookPagesMock.verify();
        });

        it("should delegate to fetchFacebookSources for groups if sourceType is groups", () => {
            let fetchFacebookPagesMock = sandbox.mock(FbActions).expects("fetchFacebookSources")
                .withExactArgs(keyword, "group", FbActions.GROUPS, {});
            sourceConfigActions.getSources(FbActions.GROUPS, keyword, {}, twitterPreFirstId);
            fetchFacebookPagesMock.verify();
        });

        it("should delegate to fetchFacebookSources for profiles if sourceType is profiles", () => {
            let fetchFacebookPagesMock = sandbox.mock(FbActions).expects("fetchFacebookSources")
                .withExactArgs(keyword, "profile", FbActions.PROFILES, {});
            sourceConfigActions.getSources(FbActions.PROFILES, keyword, {}, twitterPreFirstId);
            fetchFacebookPagesMock.verify();
        });

        it("should delegate to fetchTwitterSources", () => {
            let fetchTwitterSourcesMock = sandbox.mock(TwitterConfigureActions).expects("fetchTwitterSources")
                .withExactArgs(keyword, {}, twitterPreFirstId);
            sourceConfigActions.getSources("twitter", keyword, {}, twitterPreFirstId);
            fetchTwitterSourcesMock.verify();
        });
    });

    describe("add source to configured list", () => {
        let sandbox = null, sources = null, configuredSources = null, ajaxClient = null;

        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        beforeEach("add source to configured list", () => {
            sources = [{ "name": "something", "id": "432455", "url": "432455" }];
            configuredSources = [{ "name": "something", "id": "432455", "url": "432455" }];
            sandbox = sinon.sandbox.create();
            ajaxClient = AjaxClient.instance("/configure-sources");
            sandbox.mock(AjaxClient).expects("instance")
                .withExactArgs("/configure-sources").returns(ajaxClient);
        });

        afterEach("add source to configred list", () => {
            sandbox.restore();
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_PROFILE} when requested for adding profile`, (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClient).expects("put")
                .withExactArgs(headers, { "sources": configuredSources, "type": "fb_profile" }).returns({ "ok": true });

            let store = mockStore({}, [{ "type": FbActions.FACEBOOK_ADD_PROFILE, "sources": configuredSources }], done);
            store.dispatch(sourceConfigActions.addSourceToConfigureList(FbActions.PROFILES, ...sources));

            ajaxPutMock.verify();
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_PAGE} when requested for adding page`, (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClient).expects("put")
                .withExactArgs(headers, { "sources": configuredSources, "type": "fb_page" }).returns({ "ok": true });

            let store = mockStore({}, [{ "type": FbActions.FACEBOOK_ADD_PAGE, "sources": configuredSources }], done);
            store.dispatch(sourceConfigActions.addSourceToConfigureList(FbActions.PAGES, ...sources));

            ajaxPutMock.verify();
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_GROUP} when requested for adding group`, (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClient).expects("put")
                .withExactArgs(headers, { "sources": configuredSources, "type": "fb_group" }).returns({ "ok": true });

            let store = mockStore({}, [{ "type": FbActions.FACEBOOK_ADD_GROUP, "sources": configuredSources }], done);
            store.dispatch(sourceConfigActions.addSourceToConfigureList(FbActions.GROUPS, ...sources));

            ajaxPutMock.verify();
        });

        it(`should dispatch ${WebConfigActions.WEB_ADD_SOURCE} when requested for adding group`, (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClient).expects("put")
                .withExactArgs(headers, { sources, "type": "web" }).returns({ "ok": true });

            let store = mockStore({}, [{ "type": WebConfigActions.WEB_ADD_SOURCE, "sources": sources }], done);
            store.dispatch(sourceConfigActions.addSourceToConfigureList(sourceConfigActions.WEB, ...sources));

            ajaxPutMock.verify();
        });

        it(`should dispatch ${TwitterConfigureActions.TWITTER_ADD_SOURCE} when requested for adding group`, (done) => {
            const ajaxPutMock = sandbox.mock(ajaxClient).expects("put")
                .withExactArgs(headers, { "sources": configuredSources, "type": "twitter" }).returns({ "ok": true });

            let store = mockStore({}, [{ "type": TwitterConfigureActions.TWITTER_ADD_SOURCE, "sources": configuredSources }], done);
            store.dispatch(sourceConfigActions.addSourceToConfigureList(sourceConfigActions.TWITTER, ...sources));

            ajaxPutMock.verify();
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_PROFILE} by default`, () => {
            let event = sourceConfigActions.addSourceToConfigureList("", { "name": "something" });
            expect(event.type).to.equal(FbActions.FACEBOOK_ADD_PROFILE);
            expect(event.sources).to.deep.equal([{ "name": "something" }]);
        });
    });

    describe("add all sources", () => {
        let sandbox = null, appWindow = null, configuredSources = null, sources = null;
        beforeEach("add all sources", () => {
            appWindow = new AppWindow();
            sandbox = sinon.sandbox.create();
            sandbox.mock(AppWindow).expects("instance").returns(appWindow);
            sandbox.stub(appWindow, "get").withArgs("serverUrl").returns("http://localhost");

            nock("http://localhost")
                .put("/configure-sources")
                .reply(HttpResponseHandler.codes.OK, { "ok": true });
            configuredSources = [{ "name": "something", "url": "432455", "id": "432455" }];
            sources = [{ "name": "something", "id": "432455", "url": "432455" }];
        });

        afterEach("add all sources", () => {
            sandbox.restore();
        });

        it(`should dispatch ${WebConfigActions.WEB_ADD_SOURCE} for add all in web`, (done) => {
            let actions = [
                { "type": WebConfigActions.WEB_ADD_SOURCE, "sources": sources }
            ];
            let getStore = {
                "sourceResults": {
                    "data": sources
                },
                "currentSourceTab": "web"
            };
            let store = mockStore(getStore, actions, done);
            store.dispatch(sourceConfigActions.addAllSources());

        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_PROFILE} for add all in facebook profile`, (done) => {
            let actions = [
                { "type": FbActions.FACEBOOK_ADD_PROFILE, "sources": configuredSources }
            ];
            let getStore = {
                "sourceResults": {
                    "data": sources
                },
                "currentSourceTab": "profiles"
            };
            let store = mockStore(getStore, actions, done);
            store.dispatch(sourceConfigActions.addAllSources());
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_PAGE} for add all in facebook page`, (done) => {
            let actions = [
                { "type": FbActions.FACEBOOK_ADD_PAGE, "sources": configuredSources }
            ];
            let getStore = {
                "sourceResults": {
                    "data": sources
                },
                "currentSourceTab": "pages"
            };
            let store = mockStore(getStore, actions, done);
            store.dispatch(sourceConfigActions.addAllSources());
        });

        it(`should dispatch ${FbActions.FACEBOOK_ADD_GROUP} for add all in facebook group`, (done) => {
            let actions = [
                { "type": FbActions.FACEBOOK_ADD_GROUP, "sources": configuredSources }
            ];
            let getStore = {
                "sourceResults": {
                    "data": sources
                },
                "currentSourceTab": "groups"
            };
            let store = mockStore(getStore, actions, done);
            store.dispatch(sourceConfigActions.addAllSources());
        });
    });

    describe("deleteSource", () => {
        let ajaxInstance = null, sandbox = null, configuredSources = null,
            sourceToDelete = null, getStore = null;

        beforeEach("deleteSource", () => {
            sandbox = sinon.sandbox.create();
            ajaxInstance = AjaxClient.instance("/delete-sources");
            sandbox.stub(AjaxClient, "instance").returns(ajaxInstance);

            configuredSources = { "profiles": [], "pages": [], "groups": [], "web": [{ "_id": "wid1" }],
                "twitter": [{ "_id": "tid1" }, { "_id": "tid2" }] };
            sourceToDelete = { "_id": "tid2", "sourceType": "twitter" };

            getStore = {
                "sourceResults": {
                    "data": configuredSources
                },
                "currentSourceTab": "groups"
            };
        });

        afterEach("deleteSource", () => {
            sandbox.restore();
        });

        it("should dispatch unmarkSources, deletedSource for the success response", (done) => {
            sandbox.mock(ajaxInstance).expects("post").returns(Promise.resolve({ "ok": true }));
            const event = { "target": { "dataset": { "sourceId": sourceToDelete._id, "sourceType": sourceToDelete.sourceType } } };

            const actions = [{ "type": sourceConfigActions.UNMARK_DELETED_SOURCE, "source": sourceToDelete._id },
                { "type": sourceConfigActions.SOURCE_DELETED, "source": "tid2", "sourceType": "twitter" },
                { "type": REMOVE_SOURCE, "sourceId": "tid2", "sourceType": "twitter" }];

            const store = mockStore(getStore, actions, done);
            store.dispatch(sourceConfigActions.deleteSource(event.target));
        });

        it("should show a Toast message when the source could not be deleted", async() => {
            const event = { "target": { "dataset": { "sourceId": sourceToDelete._id, "sourceType": sourceToDelete.sourceType } } };

            const configurePage = {
                "errorMessages": {
                    "sourceDeletedFailed": "Could not delete source"
                }
            };
            sandbox.stub(Locale, "applicationStrings").returns({
                "messages": {
                    "configurePage": configurePage
                }
            });
            sandbox.mock(ajaxInstance).expects("post").returns(Promise.resolve({ "ok": false }));

            const toastMock = sandbox.mock(Toast).expects("show")
                .withExactArgs("Could not delete source");
            const fn = sourceConfigActions.deleteSource(event.target);
            await fn();
            expect(event.target.className).to.equal("delete-source");
            expect(event.target.innerHTML).to.equal("&times");
            toastMock.verify();
        });
    });
});
