import React from "react";
import { Link } from "react-router-dom";
import "../sidebar.css";

class MenuLinks extends React.Component {
    constructor(props) {
        super(props);
        // Any number of links can be added here
        this.state = {
            links: [
                {
                    text: "Home",
                    link: "/",
                    icon: "fa-pencil-square-o",
                },
                {
                    text: "Find People",
                    link: "/find/users",
                    icon: "fa-pencil-square-o",
                },
                {
                    text: "Friends-List",
                    link: "/friends",
                    icon: "fa-github",
                },
                {
                    text: "Message",
                    link: "/chat",
                    icon: "fa-twitter",
                },
                {
                    text: "Logout",
                    link: "/logout",
                    icon: "fa-twitter",
                },
            ],
        };
    }
    render() {
        let links = this.state.links.map((link, i) => (
            <li ref={i + 1} key={i + 1}>
                <Link to={link.link}>{link.text}</Link>
            </li>
        ));

        return (
            <div className={this.props.menuStatus} id="menu">
                <ul>{links}</ul>
            </div>
        );
    }
}

export default class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
        this._menuToggle = this._menuToggle.bind(this);
        this._handleDocumentClick = this._handleDocumentClick.bind(this);
    }
    componentDidMount() {
        document.addEventListener("click", this._handleDocumentClick, false);
    }
    componentWillUnmount() {
        document.removeEventListener("click", this._handleDocumentClick, false);
    }
    _handleDocumentClick(e) {
        if (!this.refs.root.contains(e.target) && this.state.isOpen === true) {
            this.setState({
                isOpen: false,
            });
        }
    }
    _menuToggle(e) {
        e.stopPropagation();
        console.log("button clicked");
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }
    render() {
        let menuStatus = this.state.isOpen ? "isopen" : "";

        return (
            <div ref="root">
                <div className="menubar">
                    {/*<div
                        className="hambclicker"
                        onClick={this._menuToggle}
                    ></div>*/}
                    <button
                        id="hambmenu"
                        className="{menuStatus} close-btn"
                        onClick={this._menuToggle}
                    >
                        X
                    </button>
                    {/*<div id="hambmenu" className={menuStatus}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                </div>*/}
                    <div className="title">
                        <span>{this.props.title}</span>
                    </div>
                </div>
                <MenuLinks menuStatus={menuStatus} />
            </div>
        );
    }
}
