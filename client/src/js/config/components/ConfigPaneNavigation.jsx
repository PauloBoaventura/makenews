import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { connect } from "react-redux";
import R from "ramda"; //eslint-disable-line id-length
import Locale from "./../../utils/Locale";

export class ConfigPaneNavigation extends Component {
    navButtons() {
        const hasConfiguredSources = R.pipe(
            R.values,
            R.any(sources => sources.length)
        )(this.props.configuredSources);

        if(this.props.currentSourceType === "facebook") {
            if (this.props.sourcesAuthenticationInfo.facebook) {
                return (
                    <div>
                        <Link to="/configure/twitter" className="sources-nav__next btn btn-secondary">
                            <i className="fa fa-arrow-right"/> {this.configureHeaderStrings.next}
                        </Link>
                        {
                            hasConfiguredSources &&
                            <Link to="/newsBoard" className="sources-nav__next btn btn-primary">
                                <i className="fa fa-check"/> {this.configureHeaderStrings.done}
                            </Link>
                        }
                    </div>);
            }
            return (
                <div>
                    <Link to="/configure/twitter" className="sources-nav__skip btn btn-secondary">
                        Skip
                    </Link>
                    <button onClick={this.props.fbLogin} className="sources-nav__next btn btn-primary">
                        <i className="fa fa-arrow-right"/> {this.configureHeaderStrings.signIn}
                    </button>
                </div>);

        } else if(this.props.currentSourceType === "twitter") {
            if (this.props.sourcesAuthenticationInfo.twitter) {
                return (
                    <button className="sources-nav__next btn btn-primary" onClick={this.props.checkConfiguredSources}>
                        <i className="fa fa-check"/> {this.configureHeaderStrings.done}
                    </button>);
            }
            return (
                <div>
                    <button className="sources-nav__skip btn btn-secondary" onClick={this.props.checkConfiguredSources}>
                        Skip
                    </button>
                    <button onClick={this.props.twitterLogin} className="sources-nav__next btn btn-primary">
                        <i className="fa fa-arrow-right"/> {this.configureHeaderStrings.signIn}
                    </button>
                </div>);
        }
        return (
            <div>
                <Link to="/configure/facebook/pages" className="sources-nav__next btn btn-secondary">
                    <i className="fa fa-arrow-right"/> {this.configureHeaderStrings.next}
                </Link>
                {
                    hasConfiguredSources &&
                    <Link to="/newsBoard" className="sources-nav__next btn btn-primary">
                        <i className="fa fa-check"/> {this.configureHeaderStrings.done}
                    </Link>
                }
            </div>
        );
    }

    render() {
        this.configureHeaderStrings = Locale.applicationStrings().messages.configurePage.header;
        return (
            <nav className="sources-nav">
                <Link to="/configure/web" className={this.props.currentSourceType === "web" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-globe"/>
                    {this.configureHeaderStrings.web}
                </Link>
                <Link to="/configure/facebook/pages" className={this.props.currentSourceType === "facebook" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-facebook-square"/>{this.configureHeaderStrings.facebook.name}
                </Link>
                <Link to="/configure/twitter" className={this.props.currentSourceType === "twitter" ? "sources-nav__item active" : "sources-nav__item"}>
                    <i className="fa fa-twitter"/>{this.configureHeaderStrings.twitter}
                </Link>
                <nav className="secondary-nav">
                    {this.navButtons()}
                </nav>
            </nav>
        );
    }
}

ConfigPaneNavigation.propTypes = {
    "currentSourceType": PropTypes.string,
    "sourcesAuthenticationInfo": PropTypes.object,
    "fbLogin": PropTypes.func,
    "twitterLogin": PropTypes.func,
    "checkConfiguredSources": PropTypes.func,
    "configuredSources": PropTypes.object
};

const mapToStore = (store) => ({
    "sourcesAuthenticationInfo": store.sourcesAuthenticationInfo,
    "configuredSources": store.configuredSources
});

export default connect(mapToStore)(ConfigPaneNavigation);
