import getHtmlContent from "../../src/js/utils/HtmContent";
import { assert } from "chai";

describe("HTMLContent", ()=> {

    it("should return only text content without any html tags", ()=> {
        const htmlString = "<p>My Test Content</p><img src='test.jpg'/> after content";
        assert.strictEqual("My Test Content after content", getHtmlContent(htmlString));
    });

});
