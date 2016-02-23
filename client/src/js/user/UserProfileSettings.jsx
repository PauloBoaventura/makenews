/* eslint brace-style:0 */
"use strict";

import React, { Component } from "react";
import LogoutActions from "../login/LogoutActions";
import { Link } from "react-router";
import Locale from "../utils/Locale";

export default class UserProfileSettings extends Component {

    constructor(props) {
        super(props);
        this.messages = Locale.applicationStrings().messages.userProfileSettings;
        this.state = { "show": false };
    }

    _toggleDropdown() {
        this.setState({ "show": !this.state.show });
    }

    _showProfile() {
        this._toggleDropdown();
    }

    _logout() {
        this._toggleDropdown();
        LogoutActions.instance().logout();
    }

    render() {
        let userName = localStorage.getItem("UserName");
        return (
            <div className="user-settings drop-down">
                <h4 className="user-info-label" onClick={this._toggleDropdown.bind(this)}>
                    <span className="user-icon">{userName.charAt(0)}</span>
                    {userName}
                </h4>
                <div className={this.state.show ? "drop-down-wrapper anim bottom-box-shadow" : "drop-down-wrapper anim bottom-box-shadow hide"}>
                    <ul>
                        <li ref="updateProfile" onClick={this._showProfile.bind(this)}>
                            <Link to="/profile" >
                                <i className="fa fa-user"></i>
                                {this.messages.profile}
                            </Link>
                        </li>
                        <li ref="logout" onClick={this._logout.bind(this)}>
                            <i className="fa fa-sign-out"></i>
                            {this.messages.logout}
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

UserProfileSettings.displayName = "UserProfileSettings";
