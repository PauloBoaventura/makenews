import RssClient from "./RssClient";
import Logger from "../logging/Logger";

export default class RssRequestHandler {

    static instance() {
        return new RssRequestHandler();
    }

    static logger() {
        return Logger.instance();
    }

    async fetchBatchRssFeedsRequest(url) {
        try {
            const feeds = await this.rssClient().getRssData(url);
            RssRequestHandler.logger().debug("RssRequestHandler:: successfully fetched feeds for %s.", url);
            return feeds;
        } catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: %s is not a proper feed url. Error: %j.", url, error);
            throw error;
        }
    }

    rssClient() {
        return RssClient.instance();
    }

    async searchUrl(key, offSetValue) {
        try {
            const document = await this.rssClient().searchURL(key, offSetValue);
            RssRequestHandler.logger().debug("RssRequestHandler:: Successfully fetched for given selector");
            return document;
        } catch (error) {
            RssRequestHandler.logger().error("RssRequestHandler:: Error while fetching documents for selector. Error: %j", error);
            throw error;
        }
    }

    async addURL(url, accessToken) {
        const response = await this.rssClient().addURL(url, accessToken);
        RssRequestHandler.logger().debug("RssRequestHandler:: successfully added Document to database.");
        return response;
    }
}
