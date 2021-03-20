/*
From the Riot Games developer page:

"Data Dragon is our way of centralizing League of Legends
game data and assets, including champions, items, runes,
summoner spells, and profile icons. All of which can be
used by third-party developers."
*/

import fetch from "node-fetch";

async function loadJSON(url: string) {
    let resp = await fetch(url);
    return await resp.json();
}

export interface SummonerIcon {
    id: string;
    width: number;
    height: number
}

export class DataDragon {
    gameVersion: string;

    constructor() {
        // by default, use the current league patch at the time of writing,
        // you know, the one where they buffed AD katarina for some reason
        this.gameVersion = "11.4.1";
    }

    useGameVersion(path: string) {
        this.gameVersion = path;
    }

    async useLatestGameVersion() {
        let versions = await loadJSON("https://ddragon.leagueoflegends.com/api/versions.json");
        this.useGameVersion(versions[0]);
        console.log(`[DataDragon] Using game assets from League of Legends version ${this.gameVersion}`);
    }

    private getVersionedCDN() {
        return `http://ddragon.leagueoflegends.com/cdn/${this.gameVersion}/`;
    }

    championSquareURL(championName: string) {
        return this.getVersionedCDN()+"img/champion/"+championName+".png";
    }

    itemIconURL(id: string) {
        return this.getVersionedCDN()+"img/item/"+id+".png";
    }

    async getSummonerIcons() {
        let dataRaw = (await loadJSON(this.getVersionedCDN()+"data/en_US/profileicon.json")).data;
        let icons: SummonerIcon[] = [];

        for (let [id, _iconData] of Object.entries(dataRaw)) {
            let iconData: any = _iconData;
            icons.push({
                id: id,
                width: iconData.image.w,
                height: iconData.image.h
            });
        }

        return icons;
    }

    getSummonerIconURL(iconId: number | string) {
        return this.getVersionedCDN()+`img/profileicon/${iconId}.png`
    }
}
