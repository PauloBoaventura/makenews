import {
    FACEBOOK_ADD_PROFILE,
    FACEBOOK_ADD_PAGE,
    FACEBOOK_ADD_GROUP,
    FACEBOOK_GOT_SOURCES,
    PAGES
} from "../../../src/js/config/actions/FacebookConfigureActions";
import {
    sourceResults,
    configuredSources,
    currentSourceTab,
    searchInConfiguredSources
} from "../../../src/js/sourceConfig/reducers/SourceConfigurationReducers";
import {
    GOT_CONFIGURED_SOURCES,
    CHANGE_CURRENT_SOURCE_TAB,
    WEB,
    CLEAR_SOURCES,
    FETCHING_SOURCE_RESULTS,
    FETCHING_SOURCE_RESULTS_FAILED,
    SOURCE_DELETED,
    UNMARK_DELETED_SOURCE,
    TWITTER
} from "../../../src/js/sourceConfig/actions/SourceConfigurationActions";
import { WEB_GOT_SOURCE_RESULTS, WEB_ADD_SOURCE } from "./../../../src/js/config/actions/WebConfigureActions";
import { TWITTER_GOT_SOURCE_RESULTS, TWITTER_ADD_SOURCE } from "./../../../src/js/config/actions/TwitterConfigureActions";
import { expect, assert } from "chai";

describe("SourceConfigurationReducers", () => {

    describe("configuredSourcesReceived", () => {
        it("should return an empty list by default when there are no configured sources", () => {
            expect(configuredSources().profiles).to.deep.equal([]);
            expect(configuredSources().groups).to.deep.equal([]);
            expect(configuredSources().pages).to.deep.equal([]);
            expect(configuredSources().web).to.deep.equal([]);
            expect(configuredSources().twitter).to.deep.equal([]);
        });
    });

    describe("configuredSources", () => {
        let state = null;
        beforeEach("configuredSources", () => {
            state = { "profiles": [], "pages": [], "groups": [], "twitter": [], "web": [] };
        });
        it("should add a profile to the state when asked for adding a profile", () => {
            const action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "name": "Profile1", "id": "12345" }] };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a page to the state when asked for adding a page", () => {
            const action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "name": "Page1", "id": "12345" }] };
            expect(configuredSources(state, action).pages).to.deep.equal([{ "name": "Page1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a group to the state when asked for adding a group", () => {
            const action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "name": "Group1", "id": "12345" }] };
            expect(configuredSources(state, action).groups).to.deep.equal([{ "name": "Group1", "id": "12345", "_id": "12345" }]);
        });

        it("should add a web url to the state when asked for adding a web source", () => {
            const action = { "type": WEB_ADD_SOURCE, "sources": [{ "name": "website", "id": "http://website.url" }] };
            expect(configuredSources(state, action).web).to.deep.equal([{ "name": "website", "id": "http://website.url", "_id": "http://website.url" }]);
        });

        it("should add a twitter handle to the state when asked for adding a twitter source", () => {
            const action = { "type": TWITTER_ADD_SOURCE, "sources": [{ "name": "twitter handle", "id": "123" }] };
            expect(configuredSources(state, action).twitter).to.deep.equal([{ "name": "twitter handle", "_id": "123", "id": "123" }]);
        });

        it("should return updated state with configured profiles", () => {
            const sources = { "profiles": [{ "name": "Profile1" }, { "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };
            const action = { "type": GOT_CONFIGURED_SOURCES, "sources": sources };
            expect(configuredSources(state, action).profiles).to.deep.equal([{ "name": "Profile1" }, { "name": "Profile2" }]);
        });

        it("should return updated configured sources with deleted sources", () => {
            state = { "profiles": [{ "_id": 1, "name": "Profile1" }, { "_id": 2, "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };
            const sources = { "profiles": [{ "_id": 2, "name": "Profile2" }],
                "pages": [], "groups": [], "twitter": [], "web": [] };
            const action = { "type": SOURCE_DELETED, "source": 1, "sourceType": "profiles" };

            expect(configuredSources(state, action)).to.deep.equal(sources);
        });
    });

    describe("current source Tab", () => {
        it("should return Web as current tab by default", () => {
            expect(currentSourceTab()).to.equal(WEB);
        });

        it(`should return given currentTab when ${CHANGE_CURRENT_SOURCE_TAB} is dispatched`, () => {
            const action = { "type": CHANGE_CURRENT_SOURCE_TAB, "currentTab": PAGES };
            expect(currentSourceTab("", action)).to.equal(PAGES);
        });
    });

    describe("Sources Results", () => {
        const sourceResultsInitialState = {
            "data": [],
            "nextPage": {},
            "isFetchingSources": false,
            "twitterPreFirstId": 0,
            "keyword": "",
            "hasMoreSourceResults": true
        };
        it("should return an empty list by default when asked sources", () => {
            expect({ "data": [], "nextPage": {}, "twitterPreFirstId": 0, "isFetchingSources": false, "keyword": "", "hasMoreSourceResults": true }).to.deep.equal(sourceResults());
        });

        it("should return the list of sources when it got the FACEBOOK sources", () => {
            const sources = {
                "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }],
                "paging": {},
                "keyword": "key"
            };
            const currentTab = PAGES;
            currentSourceTab("", { "type": CHANGE_CURRENT_SOURCE_TAB, currentTab });
            const action = { "type": FACEBOOK_GOT_SOURCES, "sources": sources, currentTab };
            const state = sourceResults(sourceResultsInitialState, action);

            const expectedResults = {
                "data": sources.data,
                "nextPage": sources.paging,
                "isFetchingSources": false,
                "keyword": sources.keyword,
                "twitterPreFirstId": undefined, //eslint-disable-line no-undefined
                "hasMoreSourceResults": true
            };

            expect(state).to.deep.equal(expectedResults);
        });

        it("should return the list of sources when it got the WEB sources", () => {
            const sources = {
                "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }],
                "paging": {},
                "keyword": "key"
            };
            const currentTab = WEB;
            currentSourceTab("", { "type": CHANGE_CURRENT_SOURCE_TAB, currentTab });
            const action = { "type": WEB_GOT_SOURCE_RESULTS, "sources": sources, currentTab };
            const state = sourceResults(sourceResultsInitialState, action);

            const expectedResults = {
                "data": sources.data,
                "nextPage": sources.paging,
                "isFetchingSources": false,
                "keyword": sources.keyword,
                "twitterPreFirstId": undefined, //eslint-disable-line no-undefined
                "hasMoreSourceResults": true
            };

            expect(state).to.deep.equal(expectedResults);
        });

        it("should return the list of sources when it got the TWITTER sources", () => {
            const sources = {
                "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }],
                "paging": {},
                "keyword": "key",
                "twitterPreFirstId": 12345
            };
            const currentTab = TWITTER;
            currentSourceTab("", { "type": CHANGE_CURRENT_SOURCE_TAB, currentTab });
            const action = { "type": TWITTER_GOT_SOURCE_RESULTS, "sources": sources, currentTab };
            const state = sourceResults(sourceResultsInitialState, action);
            const expectedResuls = {
                "data": sources.data,
                "nextPage": sources.paging,
                "isFetchingSources": false,
                "keyword": sources.keyword,
                "twitterPreFirstId": sources.twitterPreFirstId,
                "hasMoreSourceResults": true
            };

            expect(state).to.deep.equal(expectedResuls);
        });

        it("should add the added=true property to the configured facebook profile", () => {
            const state = { "data": [{ "id": 1, "name": "Profile" }, { "id": 2, "name": "Profile2" }], "paging": {} };
            const action = { "type": FACEBOOK_ADD_PROFILE, "sources": [{ "id": 1, "name": "Profile" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Profile" }, { "id": 2, "name": "Profile2" }]);
        });

        it("should add the added=true property to the configured facebook page", () => {
            const state = { "data": [{ "id": 1, "name": "Page" }, { "id": 2, "name": "Page2" }], "paging": {} };
            const action = { "type": FACEBOOK_ADD_PAGE, "sources": [{ "id": 1, "name": "Page" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Page" }, { "id": 2, "name": "Page2" }]);
        });

        it("should add the added=true property to the configured facebook group", () => {
            const state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            const action = { "type": FACEBOOK_ADD_GROUP, "sources": [{ "id": 1, "name": "Group" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 1, "id": 1, "added": true, "name": "Group" }, { "id": 2, "name": "Group2" }]);
        });

        it("should add the added=true property to multiple FACEBOOK_GROUPS when requested with multiple sources", () => {
            const state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": {} };
            const action = {
                "type": FACEBOOK_ADD_GROUP,
                "sources": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }]
            };
            expect(sourceResults(state, action).data).to.deep.equal([
                { "_id": 1, "id": 1, "added": true, "name": "Group" },
                { "_id": 2, "id": 2, "added": true, "name": "Group2" }
            ]);
        });

        it("should add the added=true property to the configured web url", () => {
            const state = { "data": [{ "id": "http://web.url", "name": "Group" }, { "id": "http://web2.url", "name": "Group2" }], "paging": {} };
            const action = { "type": WEB_ADD_SOURCE, "sources": [{ "id": "http://web.url", "name": "Group" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": "http://web.url", "added": true, "id": "http://web.url", "name": "Group" },
                    { "id": "http://web2.url", "name": "Group2" }]);
        });

        it("should add the added=true property to the configured twitter handle", () => {
            const state = { "data": [{ "id": 123, "name": "india" }, { "id": 456, "name": "mera bharath" }],
                "paging": {},
                "twitterPreFirstId": 123
            };
            const action = { "type": TWITTER_ADD_SOURCE, "sources": [{ "id": 123, "name": "india" }] };
            expect(sourceResults(state, action).data).to.deep.equal(
                [{ "_id": 123, "added": true, "id": 123, "name": "india" },
                    { "id": 456, "name": "mera bharath" }]);
        });

        it(`should clear the sources, next page and hasMoreSourceResults should be true when ${CLEAR_SOURCES} is action is performed`, () => {
            const state = { "data": [{ "id": 1, "name": "Group" }, { "id": 2, "name": "Group2" }], "paging": { "offset": 50 } };
            const action = {
                "type": CLEAR_SOURCES
            };
            const sources = sourceResults(state, action);
            expect(sources.data).to.deep.equal([]);
            expect(sources.nextPage).to.deep.equal({});
            expect(sources.hasMoreSourceResults).to.be.true; //eslint-disable-line no-unused-expressions
        });

        it(`should return the isFetchingSources as true when ${FETCHING_SOURCE_RESULTS} action is performed`, () => {
            const isFetching = sourceResults({}, { "type": FETCHING_SOURCE_RESULTS }).isFetchingSources;
            expect(isFetching).to.be.true; // eslint-disable-line no-unused-expressions
        });

        it(`should return the isFetchingSources as false when ${FETCHING_SOURCE_RESULTS_FAILED} action is performed`, () => {
            const isFetching = sourceResults({}, { "type": FETCHING_SOURCE_RESULTS_FAILED }).isFetchingSources;
            expect(isFetching).to.be.false; // eslint-disable-line no-unused-expressions
        });

        it("should change added to false for the source to be delete", () => {
            const state = { "data": [{ "id": 1, "_id": 1, "name": "Profile", "added": true }, { "id": 2, "name": "Profile2" }], "paging": {} };
            const action = { "type": UNMARK_DELETED_SOURCE, "source": 1 };
            const result = { "data": [{ "id": 1, "_id": 1, "name": "Profile", "added": false }, { "id": 2, "name": "Profile2" }], "paging": {} };
            expect(sourceResults(state, action)).to.deep.equal(result);

        });
    });

    describe("searchInConfiguredSources", () => {
        it("should return empty string when action type is not CONFIGURED_SOURCE_SEARCH_KEYWORD", () =>{
            assert.equal(searchInConfiguredSources("key"), "key");
        });

        it("should return action keyword when action type is  CONFIGURED_SOURCE_SEARCH_KEYWORD", () =>{
            assert.equal(searchInConfiguredSources("key", { "type": "CONFIGURED_SOURCE_SEARCH_KEYWORD", "keyword": "search" }), "search");
        });
    });
});
