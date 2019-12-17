import {
    paginatedFeeds,
    clearFeeds,
    displayFeedsByPage,
    newsBoardTabSwitch,
    displayArticle,
    fetchFeedsFromSources,
    searchFeeds,
    CLEAR_NEWS_BOARD_FEEDS,
    PAGINATED_FETCHED_FEEDS,
    NEWS_BOARD_CURRENT_TAB,
    DISPLAY_ARTICLE,
    FETCHING_FEEDS,
    SEARCHED_FEEDS
} from "../../../src/js/newsboard/actions/DisplayFeedActions";
import AjaxClient from "../../../src/js/utils/AjaxClient";
import mockStore from "../../helper/ActionHelper";
import { assert } from "chai";
import sinon from "sinon";
import Toast from "../../../src/js/utils/custom_templates/Toast";
import Locale from "./../../../src/js/utils/Locale";

describe("DisplayFeedActions", () => {
    describe("paginatedFeeds", () => {
        it("should return type DISPLAY_FETCHED_FEEDS action ", () => {
            const feeds = [
                { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed" },
                { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed" }
            ];
            const paginatedFeedsAction = { "type": PAGINATED_FETCHED_FEEDS, "feeds": feeds };
            assert.deepEqual(paginatedFeeds(feeds), paginatedFeedsAction);
        });
    });

    describe("newsBoardTabSwitch", () => {
        it("should return type NEWSBOARD_CURRENT_TAB action ", () => {
            const newsBoardTabSwitchAction = { "type": NEWS_BOARD_CURRENT_TAB, "currentTab": "web" };
            assert.deepEqual(newsBoardTabSwitch("web"), newsBoardTabSwitchAction);
        });
    });

    describe("clearFeeds", () => {
        it("should return type CLEAR_NEWS_BOARD_FEEDS action ", () => {
            const clearFeedsAction = { "type": CLEAR_NEWS_BOARD_FEEDS };
            assert.deepEqual(clearFeeds(), clearFeedsAction);
        });
    });

    describe("displayFeedsByPage", () => {
        let sandbox = null;
        const offset = 0;
        beforeEach("displayFeedsByPage", () => {
            sandbox = sinon.sandbox.create();
        });

        afterEach("displayFeedsByPage", () => {
            sandbox.restore();
        });

        it("dispatch displayFetchedFeedAction action with feeds on successful fetch", (done) => {
            const feeds = {
                "docs": [
                    { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed", "sourceType": "twitter" },
                    { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed", "sourceType": "twitter" }
                ]
            };
            const ajaxClientInstance = AjaxClient.instance("/feeds", true);
            const ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
                .withArgs("/feeds").returns(ajaxClientInstance);
            const postMock = sandbox.mock(ajaxClientInstance).expects("get")
                .withArgs({ offset, "filter": "{}" }).returns(Promise.resolve(feeds));
            const store = mockStore({}, [{ "type": PAGINATED_FETCHED_FEEDS, "feeds": feeds.docs }, { "type": FETCHING_FEEDS, "isFetching": false }], done);
            store.dispatch(displayFeedsByPage(offset, {}, (result) => {
                try {
                    ajaxClientMock.verify();
                    postMock.verify();
                    assert.strictEqual(result.docsLength, 2); //eslint-disable-line no-magic-numbers
                    assert.isFalse(result.hasMoreFeeds);
                } catch (err) {
                    done(err);
                }
            }));
        });

        it("dispatch displayFetchedFeedAction action with no feeds on successful fetch", (done) => {
            const ajaxClientInstance = AjaxClient.instance("/get-feeds", true);
            const ajaxClientMock = sinon.mock(AjaxClient);
            ajaxClientMock.expects("instance").returns(ajaxClientInstance);
            const postMock = sandbox.mock(ajaxClientInstance);
            postMock.expects("get").returns(Promise.reject("error"));

            const store = mockStore([], [{ "type": PAGINATED_FETCHED_FEEDS, "feeds": [] }, { "type": FETCHING_FEEDS, "isFetching": false }], done);
            store.dispatch(displayFeedsByPage(offset, "twitter"));

            ajaxClientMock.verify();
            postMock.verify();
        });

        describe("searchFeeds", ()=> {
            sandbox = sinon.sandbox.create();
            const newsBoardStrings = {
                "search": {
                    "validateKey": "Please enter a keyword minimum of 3 characters",
                    "errorMessage": "No Search results found for this keyword"
                }
            };

            beforeEach("searchFeeds", () => {
                sandbox.stub(Locale, "applicationStrings").returns({
                    "messages": {
                        "newsBoard": newsBoardStrings
                    }
                });
            });

            afterEach("DisplayFeedActions", () => {
                sandbox.restore();
            });

            it("should return feeds for searched keyword", (done) => {
                const sourceType = "web";
                const keyword = "test key";
                const feeds = {
                    "docs": [
                        { "_id": 1234, "sourceUrl": "http://www.test.com", "docType": "feed", "sourceType": "twitter" },
                        { "_id": 12345, "sourceUrl": "http://www.test2.com", "docType": "feed", "sourceType": "twitter" }
                    ]
                };

                const ajaxClientInstance = AjaxClient.instance("/search-feeds");
                sandbox.mock(AjaxClient).expects("instance").returns(ajaxClientInstance);
                const getMock = sandbox.mock(ajaxClientInstance).expects("get").returns(Promise.resolve(feeds));

                const store = mockStore([], [{ "type": SEARCHED_FEEDS, "feeds": feeds.docs }, { "type": FETCHING_FEEDS, "isFetching": false }], done);
                store.dispatch(searchFeeds(sourceType, keyword, offset, (result) => {
                    try {
                        assert.strictEqual(result.docsLength, 2); //eslint-disable-line no-magic-numbers
                        assert.isFalse(result.hasMoreFeeds);
                    } catch (err) {
                        done(err);
                    }

                }));
                getMock.verify();
            });

            it("should show message when no search results found", async() => {
                const sourceType = "web";
                const searchKey = "test_key";

                const ajaxClientInstance = AjaxClient.instance("/search-feeds");
                sandbox.stub(AjaxClient, "instance").returns(ajaxClientInstance);
                const getMock = sandbox.mock(ajaxClientInstance).expects("get").withArgs({ sourceType, searchKey, offset })
                    .returns(Promise.reject({ "message": `${newsBoardStrings.search.errorMessage} "${searchKey}"` }));
                const toastMock = sandbox.mock(Toast).expects("show")
                    .withExactArgs(`${newsBoardStrings.search.errorMessage} "${searchKey}"`, "search-warning");

                await searchFeeds(sourceType, searchKey, offset, () => {})(()=>{});

                toastMock.verify();
                getMock.verify();
            });
        });
    });

    describe("displayArticle", () => {
        it("should dispatch the current selected article", () => {
            const displayArticleAction = { "type": DISPLAY_ARTICLE, "article": { "_id": "id", "title": "title" } };
            assert.deepEqual(displayArticle({ "_id": "id", "title": "title" }), displayArticleAction);
        });
    });

    describe("fetchFeedsFromSources", () => {
        const sandbox = sinon.sandbox.create();

        afterEach("fetchFeedsFromSources", () => {
            sandbox.restore();
        });

        it("should call /fetch-feeds", async() => {
            const ajaxClient = new AjaxClient("/fetch-feeds", true);
            const ajaxClientMock = sandbox.mock(AjaxClient).expects("instance")
                .withExactArgs("/fetch-feeds", true).returns(ajaxClient);
            const postMock = sandbox.mock(ajaxClient).expects("post");

            await fetchFeedsFromSources();

            ajaxClientMock.verify();
            postMock.verify();
        });

        it("should return status true after fetching the sources", async() => {
            const ajaxClient = new AjaxClient("/fetch-feeds", false);
            sandbox.stub(AjaxClient, "instance")
                .withArgs("/fetch-feeds", true).returns(ajaxClient);
            sandbox.stub(ajaxClient, "post").returns(Promise.resolve({ "status": true }));

            const response = await fetchFeedsFromSources();

            assert.isTrue(response);
        });

        it("should return status false after fetching the sources", async() => {
            const ajaxClient = new AjaxClient("/fetch-feeds", true);
            sandbox.stub(AjaxClient, "instance")
                .withArgs("/fetch-feeds", true).returns(ajaxClient);
            sandbox.stub(ajaxClient, "post").returns(Promise.reject({ "status": false }));

            const response = await fetchFeedsFromSources();

            assert.isFalse(response);
        });
    });
});
