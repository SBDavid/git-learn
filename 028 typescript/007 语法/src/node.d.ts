declare module "url1" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse1(urlStr: string, parseQueryString?: any, slashesDenoteHost?: any): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep1: string;
}