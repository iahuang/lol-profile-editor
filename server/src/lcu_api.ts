import path from "path";
import fs from "fs";
import { getRunningPlatform, isUnixPath, toWSLPath } from "./shell";
import { throwError, assert, warn, info } from "./logging";
import fetch, { Headers } from "node-fetch";
import https from "https";

export interface LCUCreds {
    processId: string;
    port: string;
    username: string;
    password: string;
    protocol: string;
}

export class LCUInterface {
    usingWSL = false;
    installDir: string;
    _lockfilePath: string;
    _lcuCreds?: LCUCreds;

    constructor(installDir: string) {
        // verify operating platform
        let platform = getRunningPlatform();
        if (platform === "wsl") {
            this.usingWSL = true;
        } else if (platform === "win32") {
            this.usingWSL = false;
        } else if (platform === "darwin") {
            throwError("Currently Mac is not supported");
        } else {
            throwError(`Unsupported platform type ${platform}`);
        }

        if (this.usingWSL) {
            warn(
                "Windows WSL detected, WSL2 has been known to cause problems. If this is the case, try downgrading to WSL1 temporarily."
            );
        }

        // normalize path
        if (isUnixPath(installDir)) {
            throwError("League install location should use Windows paths, even if running in WSL");
        }

        if (this.usingWSL) installDir = toWSLPath(installDir);
        installDir = path.resolve(installDir);
        // verify league installation path
        assert(fs.existsSync(path.join(installDir, "LeagueClient.db")), "Incorrect League install location");

        // find lockfile
        this._lockfilePath = path.join(installDir, "lockfile");

        // finish init
        this.installDir = installDir;
    }

    getLockfileData() {
        if (!fs.existsSync(this._lockfilePath)) {
            return null;
        } else {
            return fs.readFileSync(this._lockfilePath);
        }
    }

    getClientCreds() {
        if (!this.isClientOpen()) {
            throw new Error("Cannot get League Client Credentials - Client is not open!");
        }
        this._readClientCreds();
        return this._lcuCreds!;
    }

    _readClientCreds() {
        let lfData = fs.readFileSync(this._lockfilePath, "utf8");
        let [procName, procID, port, pwd, pcl] = lfData.split(":");

        this._lcuCreds = {
            processId: procID,
            port: port,
            password: pwd,
            protocol: pcl,
            username: "riot",
        };
    }

    isClientOpen() {
        return Boolean(this.getLockfileData());
    }

    getAPIHost() {
        let creds = this.getClientCreds();
        return `${creds.protocol}://127.0.0.1:${creds.port}`;
    }

    _makeAuthString() {
        let creds = this.getClientCreds();
        let s = creds.username + ":" + creds.password;
        return "Basic " + Buffer.from(s, "utf8").toString("base64");
    }

    async apiGET(endpoint: string) {
        try {
            let resp = await fetch(this.getAPIHost() + endpoint, {
                method: "GET",
                headers: { Authorization: this._makeAuthString() },
            });
            return await resp.json();
        } catch (err) {
            console.log(err);
        }
    }

    async apiPUT(endpoint: string, data: any) {
        let resp = await fetch(this.getAPIHost() + endpoint, {
            method: "PUT",
            headers: { Authorization: this._makeAuthString(), "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        console.log(JSON.stringify(data));
        return await resp.json();
    }

    async apiPOST(endpoint: string, data: any) {
        let resp = await fetch(this.getAPIHost() + endpoint, {
            method: "POST",
            headers: { Authorization: this._makeAuthString(), "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        console.log(JSON.stringify(data));
        return await resp.json();
    }
}
