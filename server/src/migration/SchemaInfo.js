import HttpResponseHandler from "../../../common/src/HttpResponseHandler";
import ApplicationConfig from "../config/ApplicationConfig";
import CouchClient from "../CouchClient";
import NodeErrorHandler from "../NodeErrorHandler";
import Migration from "./Migration";
import request from "request";

export default class SchemaInfo {
    static instance(dbName, accessToken) {
        return new SchemaInfo(dbName, accessToken);
    }

    constructor(dbName, accessToken) {
        this.dbName = dbName;
        this.accessToken = accessToken;
    }


    save(schemaVersion) {
        return new Promise((resolve, reject) => {
            const couchClient = CouchClient.instance(this.accessToken, this.dbName);
            this.getSchemaInfoDocument().then(schemaInfoDocument => {
                couchClient.saveDocument("schema_info", this._getDocument(schemaVersion, schemaInfoDocument)).then(response => { //eslint-disable-line no-unused-vars
                    Migration.logger(this.dbName).info("SchemaInfo::save - success. %j", this.dbName, response);
                    resolve(true);
                }).catch(error => { //eslint-disable-line no-unused-vars
                    Migration.logger(this.dbName).error("SchemaInfo::save - error. %j", this.dbName, error);
                    reject(false);
                });
            }).catch(error => { //eslint-disable-line no-unused-vars
                Migration.logger(this.dbName).error("SchemaInfo::save - error. %j", error);
                reject(false);
            });
        });
    }

    getSchemaInfoDocument() {
        return new Promise((resolve, reject) => {
            request.get({
                "uri": ApplicationConfig.instance().dbUrl() + "/" + this.dbName + "/schema_info",
                "headers": { "Cookie": "AuthSession=" + this.accessToken, "Accept": "application/json" }
            },
            (error, response) => {
                if(NodeErrorHandler.noError(error)) {
                    if(new HttpResponseHandler(response.statusCode).success()) {
                        resolve(JSON.parse(response.body));
                    } else if(response.statusCode === HttpResponseHandler.codes.NOT_FOUND) {
                        Migration.logger(this.dbName).debug("SchemaInfo::getSchemaInfoDocument - no schema info record found.");
                        resolve(null);
                    } else {
                        Migration.logger(this.dbName).error("SchemaInfo::getSchemaInfoDocument - error = %j", response.body);
                        reject(response.body);
                    }
                } else {
                    Migration.logger(this.dbName).error("SchemaInfo::getSchemaInfoDocument - error = %j", error);
                    reject("unexpected response from the couchdb");
                }
            });
        });
    }

    _getDocument(schemaVersion, schemaInfoDocument) {
        if(!schemaInfoDocument) {
            return { "lastMigratedDocumentTimeStamp": schemaVersion };
        }
        schemaInfoDocument.lastMigratedDocumentTimeStamp = schemaVersion;
        return schemaInfoDocument;
    }
}
