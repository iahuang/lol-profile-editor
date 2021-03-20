const encodeGetParams = (p: Record<string, any>) =>
    "?"+Object.entries(p)
        .map((kv) => kv.map(encodeURIComponent).join("="))
        .join("&");

export default class ServerInterface {
    constructor() {}

    async apiGET(endpoint: string, params: Record<string, any> = {}) {
        let resp = await fetch(window.location.origin + endpoint+encodeGetParams(params), {
            method: "GET",
        });
        return await resp.json();
    }

    async apiPOST(endpoint: string, params: Record<string, any> = {}) {
        let resp = await fetch(window.location.origin + endpoint+encodeGetParams(params), {
            method: "POST",
        });
        return await resp.json();
    }
}
