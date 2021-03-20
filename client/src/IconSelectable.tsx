import React, { Component } from "react";
import { Globals } from "./globals";
import { SummonerIcon } from "./types";

interface IProps {
    icon: SummonerIcon;
}

interface IState {}

export class IconSelectable extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <img
                className="sr-icon-sel"
                onClick={async () => {
                    let resp = await Globals.server.apiPOST("/api/change-icon", { id: this.props.icon.id });
                    console.log(resp);
                }}
                src={this.props.icon.riotUrl}
            ></img>
        );
    }
}
