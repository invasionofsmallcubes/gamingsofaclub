import cheerio from "cheerio"
import slug from "slug"
import { HowLongToBeatService } from 'howlongtobeat'
import { Readable } from "node:stream"
import wiki from 'wikijs'
import * as fs from 'fs'
import { JsonProperty, JsonClassType, ObjectMapper } from 'jackson-js';
import { BeatInfo } from "../domain/BeatInfo"
import { Game } from "../domain/Game"

const url = 'https://www.ign.com/articles/the-best-100-video-games-of-all-time';

const w = wiki()

const om = new ObjectMapper()

const hltbService = new HowLongToBeatService();

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const http = require('https')

function syncReadFile(filename: string) {
    const result = fs.readFileSync(filename, 'utf-8');
    return result;
}


const responseToReadable = (response: any) => {
    const reader = response.body.getReader();
    const rs = new Readable();
    rs._read = async () => {
        const result = await reader.read();
        if (!result.done) {
            rs.push(Buffer.from(result.value));
        } else {
            rs.push(null);
            return;
        }
    };
    return rs;
};

const content = syncReadFile('games.json')
const games: Game[] = []

const download = async (url: any, dest: any, cb: any) => {
    const file = fs.createWriteStream(dest)

    const response = await fetch("https://howlongtobeat.com" + url, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "If-Modified-Since": "Thu, 11 Feb 2021 22:38:55 GMT",
            "If-None-Match": "\"a30f48e5fba93e87b0f5ca5fb9ed15af\""
        },
        "method": "GET",
        "mode": "cors"
    });

    if (!response.ok) {
        return cb('Response status was ' + response.status);
    }

    const request = await responseToReadable(response)

    request.pipe(file);

    // close() is async, call cb after close completes
    file.on('finish', () => file.close(cb))

    // check for request error too
    request.on('error', (err: any) => {
        fs.unlink(dest, () => cb(err.message)); // delete the (partial) file and then return the error
    });

    file.on('error', (err: any) => { // Handle errors
        fs.unlink(dest, () => cb(err.message)) // delete the (partial) file and then return the error
    })
}


fetch(url, {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1"
    },
    "method": "GET",
    "mode": "cors"
}).then(response => response.text())
    .then(response => {
        // const games = new Map<string, Game>();
        const $ = cheerio.load(response);
        const tableElements = $(
            ".article-page > h2 > strong"
        )
        tableElements.each((idx, elem) => {
            const title = $(elem).text()
            const dot = title.indexOf('.')
            const rank = title.substring(0, dot)
            const name = title.substring(dot + 2, title.length)
            const slugId = slug(name)
            games.push(new Game(
                +rank,
                name,
                slugId,
                new BeatInfo(0, 0, 0),
                "", "", [], []
            ))
        })
        return games
    })
    .then(async games => {
        for (let i = 0; i < games.length; i++) {
            let game = games[i]
            try {
                let name = game.name
                if (name === 'Resident Evil 2 (Remake)') {
                    name = 'Resident Evil 2'
                } else if (name === 'GoldenEye 007') {
                    name = 'GoldenEye 007 (1997 video game)'
                } else if (name === 'Inside') {
                    name = 'Inside (video game)'
                } else if (name === 'Doom') {
                    name = 'Doom (1993 video game)'
                }
                const page = await w.page(name)
                const summary = await page.summary()
                const fullInfo = await page.fullInfo()
                type ObjectKey1 = keyof typeof fullInfo;
                const general = 'general' as ObjectKey1;
                const actual = fullInfo[general]
                type ObjectKey2 = keyof typeof actual;
                const platforms = 'platforms' as ObjectKey2;
                const genre = 'genre' as ObjectKey2;

                if (!Array.isArray(actual[platforms])) {
                    game.platforms = [actual[platforms]]
                } else {
                    game.platforms = actual[platforms]
                }
                if (!Array.isArray(actual[genre])) {
                    game.genres = [actual[genre]]
                } else {
                    game.genres = actual[genre]
                }
                game.summary = summary
                delay(1500)
            } catch (e) {
                console.log("page not found for " + game.name)
            }
        }
        return games
    })
    .then(async games => {
        for (let i = 0; i < games.length; i++) {
            let name = games[i].name
            if (name === 'Resident Evil 2 (Remake)') {
                name = 'Resident Evil 2'
            } else if (name === 'Counter-Strike 1.6') {
                name = 'Counter-Strike'
            } else if (name === 'The Last of Us Part 2') {
                name = 'The Last of Us Part II'
            }

            const r = await hltbService.search(name)
            if (r.length > 0) {
                games[i].beatInfo = new BeatInfo(
                    r[0].gameplayMain,
                    r[0].gameplayMainExtra,
                    r[0].gameplayCompletionist,
                )
                games[i].imageUrl = r[0].imageUrl
                const p = 'public/' + r[0].imageUrl.substring(1)
                if (!fs.existsSync(p)) {
                    download(
                        r[0].imageUrl,
                        p,
                        function (err: any) {
                            if (!err) {
                                console.log("Done with " + games[i].name)
                            } else {
                                console.log(err)
                            }
                        })
                }
            } else {
                console.log("r less than zero for " + games[i].name)
            }
            delay(1500)
        }
        return games
    })
    .then(games => {
        fs.writeFileSync("games.json", om.stringify<Game[]>(games))
    }).catch(err => {
        console.log(err)
    });