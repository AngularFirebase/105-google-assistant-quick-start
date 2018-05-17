"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const node_fetch_1 = require("node-fetch");
const cheerio = require("cheerio");
admin.initializeApp();
const actions_on_google_1 = require("actions-on-google");
const app = actions_on_google_1.dialogflow({ debug: true });
app.intent('Get Latest Episode', (conv) => __awaiter(this, void 0, void 0, function* () {
    const data = yield getPage();
    conv.close(new actions_on_google_1.SimpleResponse({
        text: `Last episode was ${data.title}`,
        speech: `The last video was episode ${data.episode}. ${data.title}. It's description goes like this: ${data.description}`,
    }));
    conv.close(new actions_on_google_1.BasicCard({
        title: 'Watch the latest Episode',
        image: new actions_on_google_1.Image({
            url: 'https://goo.gl/Fz9nrQ',
            alt: 'AngularFirebase Logo'
        }),
        buttons: new actions_on_google_1.Button({
            title: 'Watch',
            url: 'https://angularfirebase.com/lessons',
        }),
    }));
}));
// helper Function for scraping a webpage
function getPage() {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield node_fetch_1.default('https://angularfirebase.com/lessons');
        const html = yield page.text();
        const $ = cheerio.load(html);
        console.log($('.preview-content').first().html());
        const lesson = $('.preview-content').first();
        return {
            title: lesson.find('h2').text(),
            description: lesson.find('p').text(),
            episode: lesson.find('.ep-label').text()
        };
    });
}
exports.fulfillment = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map