import React from "react";

export default class Menu extends React.Component {
    getInitialState {
        return { open: false };
    },

    toggleMenu {
        this.setState({ open: !this.state.open });
    },

    render: function () {
        const linksArray = [
            { name: "home", url: "#" },
            { name: "log in", url: "#" },
            { name: "photos", url: "#" },
            { name: "contact", url: "#" },
            { name: "download", url: "#" },
        ];
        const socialArray = [
            {
                icon: "fa fa-github-square",
                url: "https://github.com/matthewvincent",
            },
            {
                icon: "fa fa-instagram",
                url: "https://www.instagram.com/middlestates/",
            },
            {
                icon: "fa fa-tumblr-square",
                url: "http://matthewvincentphotography.com/",
            },
        ];

        return (
            <div>
                <Panel
                    open={this.state.open}
                    links={linksArray}
                    socialLinks={socialArray}
                />
                <Button toggle={this.toggleMenu} open={this.state.open} />
            </div>
        );
    },
};

class Button extends React.Component({
    render: function () {
        return (
            <button
                className={
                    this.props.open
                        ? "menu-toggle close-button"
                        : "menu-toggle "
                }
                onClick={this.props.toggle}
            >
                {" "}
                <i className="fa fa-plus"></i>
            </button>
        );
    },
});

class Panel extends React.Component({
    render: function () {
        return (
            <div
                className={
                    this.props.open ? "menu-wrapper menu-open" : "menu-wrapper"
                }
            >
                <Links links={this.props.links} open={this.props.open} />
            </div>
        );
    },
});

class Links extends React.Component({
    render: function () {
        const linkList = this.props.links.map((link) => (
            <li className="link">
                <a href={link.url}>{link.name}</a>
            </li>
        ));

        return (
            <div
                className={
                    this.props.open
                        ? "links-wrapper"
                        : "links-wrapper links-wrapper-closed"
                }
            >
                {" "}
                <ul className="link-list">{linkList}</ul>
            </div>
        );
    },
});
