import isDocker from "is-docker";
import os from "os";
import fs from "fs";
import path from "path";
import childProcess from "child_process";

function isWsl() {
    if (process.platform !== "linux") {
        return false;
    }

    if (os.release().toLowerCase().includes("microsoft")) {
        if (isDocker()) {
            return false;
        }

        return true;
    }

    try {
        return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !isDocker() : false;
    } catch (_) {
        return false;
    }
}

export function getRunningPlatform() {
    if (isWsl()) {
        return "wsl";
    }
    let platform = os.platform();
    return platform as string;
}

export function hasCommand(cmd: string) {}

export function isUnixPath(p: string) {
    return path.parse(p).root === "/";
}

export function toWSLPath(p: string) {
    let cmd = `wslpath -a '${p.replace(/\\/g, "\\\\")}'`
    return _execSync(cmd);
}

function _execSync(cmd: string) {
    return childProcess.execSync(cmd, { encoding: "utf8" }).trim();
}
