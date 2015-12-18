/*eslint no-nested-ternary:0 */
"use strict";
import React, { Component, PropTypes } from "react";
import Paragraph from "./Paragraph.jsx";
import ImageGallery from "./ImageGallery.jsx";
import ImageContent from "./ImageContent.jsx";

export default class AllFeeds extends Component {

    render() {

        let categories = this.props.feeds.map((category, index)=>
                category.type === "description" ? <Paragraph key={index} category={category} dispatch={this.props.dispatch}/>
                    : category.type === "gallery" ? <ImageGallery key={index} category={category} dispatch={this.props.dispatch}/>
                        : category.type === "imagecontent" ? <ImageContent key={index} category={category} dispatch={this.props.dispatch}/> : null

        );

        return (
            <div className="all-feeds max-width">
                {categories}
            </div>
        );
    }
}

AllFeeds.displayName = "AllFeeds";

AllFeeds.propTypes = {
    "dispatch": PropTypes.func,
    "feeds": PropTypes.array
};

AllFeeds.defaultProps = {
    "feeds": []
};
