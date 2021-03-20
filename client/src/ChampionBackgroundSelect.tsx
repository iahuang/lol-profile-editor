import React, { Component } from "react";
import { Globals } from "./globals";

interface IProps {
    championData: any[];
}

interface IState {
    championSearch: string;
    selectingSkinFor: any | null;
    skins: any[];
}

export class ChampionBackgroundSelector extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            championSearch: "",
            selectingSkinFor: null,
            skins: [],
        };
    }

    makeChampSelectDisplay() {
        return (
            <div>
                <input
                    type="search"
                    placeholder="Search"
                    value={this.state.championSearch}
                    onChange={(ev) => {
                        this.setState({ championSearch: ev.target.value });
                    }}
                ></input>
                <br></br>
                {this.props.championData
                    .filter((champion) => champion.name.toLowerCase().includes(this.state.championSearch.toLowerCase()))
                    .map((champion) => {
                        return (
                            <img
                                key={champion.name}
                                src={champion.squareURL}
                                className="champ-square"
                                onClick={() => {
                                    this.setState({
                                        selectingSkinFor: champion.id,
                                    });

                                    Globals.server.apiGET("/api/skins-for-champ", { id: champion.id }).then((data) => {
                                        this.setState({
                                            skins: data,
                                        });
                                    });
                                }}
                            ></img>
                        );
                    })}
            </div>
        );
    }

    makeSkinSelectDisplay() {
        if (this.state.skins.length === 0) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                {this.state.skins.map((skin: any) => {
                    return (
                        <div key={skin.skinId}>
                            <div className="skp-container">
                                <img
                                    className="skin-splash"
                                    src={skin.splashURL}
                                    onClick={(ev) => {
                                        Globals.server.apiPOST("/api/change-background", { skinId: skin.skinId });
                                        this.setState({
                                            selectingSkinFor: null,
                                        });
                                    }}
                                ></img>
                                <span>{skin.name === "default" ? "Default Skin" : skin.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <div>
                <h2>Choose a Profile Background</h2>
                <div className="sr-champ-display">
                    {this.state.selectingSkinFor === null
                        ? this.makeChampSelectDisplay()
                        : this.makeSkinSelectDisplay()}
                </div>
            </div>
        );
    }
}
