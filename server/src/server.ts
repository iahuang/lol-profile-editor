import express from "express";
import path from "path";
import fs from "fs";
import { DataDragon } from "./data_dragon";
import { LCUInterface } from "./lcu_api";
import { info, warn } from "./logging";

class ServerConfig {
    installPath = "league_install_path_goes_here";
    port = 8080;
}

const CONFIG_PATH = "./config.json";
(process.env["NODE_TLS_REJECT_UNAUTHORIZED"] as any) = 0;
export default class LPEServer {
    app: express.Application;
    dataDragon: DataDragon;
    lcu: LCUInterface;
    config: ServerConfig;

    constructor() {
        this.app = express();
        this.dataDragon = new DataDragon();
        this.initRoutes();

        // init config
        if (!fs.existsSync(CONFIG_PATH)) {
            warn(`Config file does not exist! Creating template...`);
            fs.writeFileSync(CONFIG_PATH, JSON.stringify(new ServerConfig()));
            warn(`Please fill out the config file (located at ${path.resolve(CONFIG_PATH)}) and restart the server.`);
            info("Exiting...");
            process.exit(0);
        }
        this.config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

        this.lcu = new LCUInterface(this.config.installPath);
    }

    async start() {
        await this.dataDragon.useLatestGameVersion();
        info(`Starting server on port ${this.config.port}...`);
        this.app.listen(this.config.port);
    }

    private initRoutes() {
        this.app.use(express.static("client/public"));
        this.app.get("/bundle.js", (req, res) => {
            res.sendFile("build/client/bundle.js", { root: "." });
        });

        // init api routes

        let requireClientOpen = (res: express.Response) => {
            if (!this.lcu.isClientOpen()) {
                res.status(405).json({ error: "Client is not open" });
                return false;
            }
            return true;
        };

        this.app.use("/api/summoner-icons", async (req, res) => {
            let icons = await this.dataDragon.getSummonerIcons();

            res.json({
                length: icons.length,
                urls: icons.map((icon) => ({
                    id: icon.id,
                    riotUrl: this.dataDragon.getSummonerIconURL(icon.id),
                })),
            });
        });

        this.app.use("/api/is-logged-in", async (req, res) => {
            res.json({
                loggedIn: this.lcu.isClientOpen(),
            });
        });

        this.app.use("/api/summoner-info", async (req, res) => {
            if (!requireClientOpen(res)) return;
            res.json(await this.lcu.apiGET("/lol-summoner/v1/current-summoner"));
        });

        this.app.post("/api/change-icon", async (req, res) => {
            let id = req.query["id"];
            if (!id) {
                return;
            }
            console.log("changing icon to", id, "...");
            let resp = await this.lcu.apiPUT("/lol-summoner/v1/current-summoner/icon", {
                profileIconId: Number.parseInt(id as string)
            });
            // /lol-chat/v1/me/

            resp = await this.lcu.apiPUT("/lol-chat/v1/me", {
                icon: Number.parseInt(id as string),
            });
            res.json(resp);
        });

        this.app.use("/api/summoner-icon-url", async (req, res) => {
            res.json({ url: this.dataDragon.getSummonerIconURL(req.query.id as string) });
        });
    }
}
