export function throwError(message: string) {
    console.error("[ERROR] " + message);
    console.log("exiting...");
    process.exit(0);
}

export function warn(message: string) {
    console.warn("[WARNING] " + message);
}

export function assert(condition: boolean, errorMessage: string) {
    if (!condition) {
        throwError(errorMessage);
    }
}

export function info(message: string) {
    console.log("[INFO] "+message);
}