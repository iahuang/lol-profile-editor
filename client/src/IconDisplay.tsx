import React, { Component } from "react";
import { IconSelectable } from "./IconSelectable";
import { SummonerIcon } from "./types";

interface IProps {
    icons: SummonerIcon[];
}

interface IState {}

export class IconDisplay extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    makeIcon(icon: SummonerIcon) {
        return <IconSelectable icon={icon} key={icon.id}></IconSelectable>;
    }
    render() {
        return (
            <div>
                <h2>Choose a Profile Picture</h2>
                <div className="profile-selector-display">{this.props.icons.map((icon) => this.makeIcon(icon))}</div>
            </div>
        );
    }
}
