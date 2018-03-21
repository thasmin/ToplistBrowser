'use strict';

import XmlParser from 'react-xml-parser';

var toplist = null;
var podcasts = {
    "https://itunes.apple.com/us/podcast/invisibilia/id953290300?mt=2&uo=2": "https://www.npr.org/rss/podcast.php?id=510307"
};

function loadToplist() {
    if (toplist != null)
        return Promise.resolve(toplist);

    const iTunesUrl = "https://itunes.apple.com/us/rss/topaudiopodcasts/genre=26/json"
    return new Promise((resolve, reject) => {
        fetch(iTunesUrl)
            .then(response => response.json())
            .then(json => {
                toplist = json.feed;
                resolve(toplist);
            })
            .catch(reject);
    });
}

function loadPodcast(url) {
    if (podcasts[url] != null)
        return Promise.resolve(podcasts[url]);
    
    const iTunesRequest = (url) => new Request(url, {
        redirect: 'follow',
        headers: new Headers({
            'User-Agent': 'iTunes/10.2.1'
        })
    });

    function extractRssUrlFromPlist(text, resolve, reject) {
        // got a plist
        const keyAt = text.indexOf("<key>url</key>");
        if (keyAt == -1)
            return reject("Invalid plist");
        const nextUrlStart = keyAt + "<key>url</key><string>".length;
        const nextUrlEnd = text.indexOf('</string', nextUrlStart);
        // turn &amp; into & and hope there are no more HTML entities in there
        const nextUrl = text.substring(nextUrlStart, nextUrlEnd).replace(/&amp;/g, "&");
        fetch(iTunesRequest(nextUrl))
            .then(response => response.text())
            .then(html => extractRssUrlFromHtml(html, resolve, reject))
            .catch(reject)
    }

    function extractRssUrlFromHtml(html, resolve, reject) {
        const feedAtStart = html.indexOf('feed-url="') + 'feed-url="'.length;
        const feedAtEnd = html.indexOf('"', feedAtStart);
        const rssUrl = html.substring(feedAtStart, feedAtEnd);
        podcasts[url] = rssUrl;
        resolve(rssUrl);
    }

    return new Promise((resolve, reject) => {
        fetch(iTunesRequest(url))
            .then(response => response.text())
            .then(text => {
                if (text.trimLeft().startsWith("<?xml "))
                    extractRssUrlFromPlist(text, resolve, reject);
                else
                    extractRssUrlFromHtml(text, resolve, reject);
            })
            .catch(reject)
    });
}

function loadEpisodes(rssUrl) {
    return new Promise((resolve, reject) => {
        fetch(rssUrl)
            .then(response => response.text())
            .then(text => {
                resolve(new XmlParser().parseFromString(text));
            })
            .catch(reject);
    });
}

export default {
    loadToplist,
    loadPodcast,
    loadEpisodes,
};

