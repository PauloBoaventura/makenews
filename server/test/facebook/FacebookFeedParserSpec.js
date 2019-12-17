import { parseFacebookPosts } from "./../../src/facebook/FacebookFeedParser";
import { expect } from "chai";

describe("FacebookFeedParser", () => {

    it("should parse the facebook feeds", () => {
        const data = [
            {
                "message": "Latest Feed 1.0",
                "privacy": {
                    "value": "EVERYONE",
                    "description": "Public",
                    "friends": "",
                    "allow": "",
                    "deny": ""
                },
                "created_time": "2016-05-06T07:11:43+0000",
                "from": { "name": "some" },
                "id": "952680454818870_1019161978170717"
            },
            {
                "message": "hello world",
                "privacy": {
                    "value": "EVERYONE",
                    "description": "Public",
                    "friends": "",
                    "allow": "",
                    "deny": ""
                },
                "created_time": "2016-05-06T06:33:49+0000",
                "from": { "name": "some" },
                "id": "952680454818870_1019152051505043"
            }
        ];
        
        const parsedData = [{
            "_id": "952680454818870_1019161978170717",
            "docType": "feed",
            "type": "description",
            "title": "",
            "sourceType": "facebook",
            "link": "https://www.facebook.com/952680454818870/posts/1019161978170717",
            "description": "Latest Feed 1.0",
            "pubDate": "2016-05-06T07:11:43.000Z",
            "tags": ["some"],
            "images": [],
            "videos": [],
            "sourceId": "source"
        }, {
            "_id": "952680454818870_1019152051505043",
            "docType": "feed",
            "type": "description",
            "title": "",
            "sourceType": "facebook",
            "link": "https://www.facebook.com/952680454818870/posts/1019152051505043",
            "description": "hello world",
            "pubDate": "2016-05-06T06:33:49.000Z",
            "tags": ["some"],
            "images": [],
            "videos": [],
            "sourceId": "source"
        }];
        expect(parseFacebookPosts("source", data)).to.deep.equals(parsedData);
    });

    it("should add the image link to image url property", () => {
        const data = [
            {
                "link": "https://www.facebook.com/DisneyPixar/photos/a.127437064077.102676.35245929077/10154988680249078/?type=3",
                "message": "Destination: everywhere.",
                "picture": "https://scontent.xx.fbcdn.net/v/t1.0-0/s130x130/15826130_10154988680249078_436498272897924830_n.jpg?oh=eb979257835ed17a5a0668dda02417c2&oe=591AE0D9",
                "full_picture": "https://fullpicture.url/fullpicture.jpg",
                "name": "Timeline Photos",
                "privacy": {
                    "value": "",
                    "description": "",
                    "friends": "",
                    "allow": "",
                    "deny": ""
                },
                "created_time": "2017-01-05T02:30:02+0000",
                "from": { "name": "some" },
                "id": "35245929077_10154988680249078"
            }
        ];

        const parsedFeeds = [{
            "_id": "35245929077_10154988680249078",
            "docType": "feed",
            "type": "image",
            "title": "Timeline Photos",
            "sourceType": "facebook",
            "link": "https://www.facebook.com/DisneyPixar/photos/a.127437064077.102676.35245929077/10154988680249078/?type=3",
            "description": "Destination: everywhere.",
            "pubDate": "2017-01-05T02:30:02.000Z",
            "tags": ["some"],
            "images": [{
                "url": "https://fullpicture.url/fullpicture.jpg",
                "thumbnail": "https://scontent.xx.fbcdn.net/v/t1.0-0/s130x130/15826130_10154988680249078_436498272897924830_n.jpg?oh=eb979257835ed17a5a0668dda02417c2&oe=591AE0D9"
            }],
            "videos": [],
            "sourceId": "source"
        }];

        expect(parseFacebookPosts("source", data)).to.deep.equals(parsedFeeds);
    });

    it("should add the thumbnail link to video url property", () => {
        const data = [{
            "link": "https://www.facebook.com/DisneyPixar/videos/10154988196624078/",
            "message": "Dive into a sea of Easter eggs. It's National Trivia Day!",
            "picture": "https://scontent.xx.fbcdn.net/v/t15.0-10/s130x130/15816214_10154988202144078_6654347227177156608_n.jpg?oh=282550634a2909f97bfab6d498bf6bdd&oe=58E29742",
            "full_picture": "https://full.picture/url.jpg",
            "name": "Disney•Pixar Easter Eggs",
            "privacy": {
                "value": "",
                "description": "",
                "friends": "",
                "allow": "",
                "deny": ""
            },
            "created_time": "2017-01-04T23:01:54+0000",
            "from": { "name": "some" },
            "id": "35245929077_10154988196624078"
        }];

        const parsedFeeds = [{
            "_id": "35245929077_10154988196624078",
            "docType": "feed",
            "type": "video",
            "title": "Disney•Pixar Easter Eggs",
            "sourceType": "facebook",
            "link": "https://www.facebook.com/DisneyPixar/videos/10154988196624078/",
            "description": "Dive into a sea of Easter eggs. It's National Trivia Day!",
            "pubDate": "2017-01-04T23:01:54.000Z",
            "tags": ["some"],
            "images": [{
                "url": "https://full.picture/url.jpg",
                "thumbnail": "https://scontent.xx.fbcdn.net/v/t15.0-10/s130x130/15816214_10154988202144078_6654347227177156608_n.jpg?oh=282550634a2909f97bfab6d498bf6bdd&oe=58E29742"
            }],
            "videos": [{ "id": "10154988196624078", "thumbnail": "https://scontent.xx.fbcdn.net/v/t15.0-10/s130x130/15816214_10154988202144078_6654347227177156608_n.jpg?oh=282550634a2909f97bfab6d498bf6bdd&oe=58E29742" }],
            "sourceId": "source"
        }];

        expect(parseFacebookPosts("source", data)).to.deep.equals(parsedFeeds);
    });
});
