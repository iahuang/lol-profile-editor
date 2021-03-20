import React, { Component } from "react";
import { ChampionBackgroundSelector } from "./ChampionBackgroundSelect";
import { Globals } from "./globals";
import { IconDisplay } from "./IconDisplay";
import { SummonerIcon } from "./types";

interface IState {
    loggedIn: boolean;
    loading: boolean;
    pfp: string;
    icons: SummonerIcon[];
    champs: any[];
}

interface IProps {}

class AppMain extends Component<IProps, IState> {
    summonerInfo: any;
    constructor(props: IState) {
        super(props);
        this.state = {
            loggedIn: false,
            loading: true,
            pfp: "",
            icons: [],
            champs: [],
        };

        Globals.server.apiGET("/api/is-logged-in").then((data) => {
            this.setState({
                loggedIn: data.loggedIn,
            });

            if (data.loggedIn) {
                Globals.server.apiGET("/api/summoner-info").then((data) => {
                    console.log(data);
                    this.summonerInfo = data;

                    this.setState({
                        loading: false,
                    });

                    Globals.server
                        .apiGET("/api/summoner-icon-url", { id: this.summonerInfo.profileIconId })
                        .then((data) => {
                            this.setState({
                                pfp: data.url,
                            });
                        });
                });

                Globals.server.apiGET("/api/summoner-icons").then((data) => {
                    this.setState({
                        icons: data.urls,
                    });
                });

                Globals.server.apiGET("/api/champions-list").then((data) => {
                    this.setState({
                        champs: data,
                    });
                });
            } else {
                this.setState({
                    loading: false
                })
            }
        });
    }

    makeHeader() {
        return (
            <div className="header">
                <h1>League of Legends Profile Editor</h1>
                <span>by OldPepper12</span>
            </div>
        );
    }
    makeMain() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        }

        if (this.state.loggedIn) {
            return (
                <div>
                    <div className="profile">
                        <img className="pfp" src={this.state.pfp}></img>
                        <div>
                            <span className="display-name">{this.summonerInfo.displayName}</span>
                            <br></br>
                            <span className="sr-level">Level {this.summonerInfo.summonerLevel}</span>
                        </div>
                    </div>
                    <span className="selectors">
                        <IconDisplay icons={this.state.icons}></IconDisplay>
                        <ChampionBackgroundSelector championData={this.state.champs}></ChampionBackgroundSelector>
                    </span>
                </div>
            );
        } else {
            return <h2>You are not currently logged into the client!</h2>;
        }
    }
    render() {
        return (
            <div>
                {this.makeHeader()}
                <div className="main">{this.makeMain()}</div>
                <span className="disclaimer">This site is not affiliated with or endorsed by Riot Games or any of its subsidaries. League of Legends is a registered trademark of Riot Games Inc. Use at your own risk.</span>
            </div>
        );
    }
}

export function App() {
    return <AppMain></AppMain>;
}
