import Route from "./Route";
import RouteLogger from "../RouteLogger";
import FeedsRequestHandler from "./../../fetchAllFeeds/FeedsRequestHandler";

export default class FetchAllConfiguredFeeds extends Route {
    constructor(request, response, next) {
        super(request, response, next);
        this.authSession = this.request.cookies.AuthSession;
        this.offset = this.validateNumber(this.request.query.offset);
        if(this.request.query.filter) {
            this.filter = JSON.parse(this.request.query.filter);
        }
    }

    async fetchFeeds() {
        try {
            const feedsRequestHandler = FeedsRequestHandler.instance();
            const feeds = await feedsRequestHandler.fetchFeeds(this.authSession, this.offset, this.filter);
            RouteLogger.instance().debug("FeedsRequestHandler:: successfully fetched the feeds");
            this._handleSuccess(feeds);
        } catch (error) {
            RouteLogger.instance().debug(`FeedsRequestHandler:: failed to fetch the feeds . Error: ${JSON.stringify(error)}`);
            this._handleBadRequest();
        }
    }
}
