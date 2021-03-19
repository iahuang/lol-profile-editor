import { DataDragon } from "./data_dragon";

async function main() {
    let dataDragon = new DataDragon();
    await dataDragon.useLatestGameVersion();
    console.log(await dataDragon.getSummonerIcons())
}

main();