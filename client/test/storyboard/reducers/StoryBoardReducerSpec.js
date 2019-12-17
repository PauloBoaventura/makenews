import { stories } from "../../../src/js/storyboard/reducers/StoryBoardReducer";
import { assert } from "chai";
import { ADD_STORY_TITLE, CLEAR_STORIES, REMOVE_STORY } from "../../../src/js/storyboard/actions/StoryBoardActions";

describe("StoryBoardReducers", () => {
    describe("stories", () => {
        it("should return an empty list if there is no action item", () => {
            assert.deepEqual(stories(), []);
        });

        it("should return list of stories if action type is ADD_STORY_TITLE", () => {
            const story = { "_id": "id", "title": "title" };
            const action = { "type": ADD_STORY_TITLE, story };
            assert.deepEqual([story], stories([], action));
        });

        it("should return an empty list if action type is CLEAR_STORIES", () => {
            const action = { "type": CLEAR_STORIES };
            assert.deepEqual([], stories([], action));
        });

        it("should remove story from state if action type is CLEAR_STORIES", () => {
            const action = { "type": REMOVE_STORY, "id": 2 };
            assert.deepEqual([{ "_id": 1 }, { "_id": 3 }], stories([{ "_id": 1 }, { "_id": 2 }, { "_id": 3 }], action));
        });
    });
});
