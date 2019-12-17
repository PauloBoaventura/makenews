/* eslint no-process-env:0, no-sync:0 */

import EnvironmentReader from "../../../common/src/environment/EnvironmentReader";
import StringUtil from "../../../common/src/util/StringUtil";
import fs from "fs";

export default class EnvironmentFileLoader {
    static instance(fullPath, environmentParam) {
        if(StringUtil.isEmptyString(fullPath)) {
            throw new Error("invalid path while reading configuration file");
        }
        if(this.config && this.config[fullPath]) {
            return this.config[fullPath];
        }
        const environment = environmentParam || process.env.NODE_ENV || "development";
        const environmentConfigJson = JSON.parse(fs.readFileSync(fullPath, "utf8"));
        this.config = this.config || {};
        this.config[fullPath] = new EnvironmentReader(environmentConfigJson, environment);
        return this.config[fullPath];
    }
}
