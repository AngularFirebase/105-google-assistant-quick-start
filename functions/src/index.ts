import * as functions from 'firebase-functions';

// Web scraping deps
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Google Assistant deps
import { dialogflow, SimpleResponse, BasicCard, Button, Image } from 'actions-on-google';
const app = dialogflow({ debug: true });

// Capture Intent
app.intent('Get Latest Episode', async (conv) => {
    const data = await scrapePage();
    conv.close(new SimpleResponse({ 
        text: `Last episode was ${data.title}`,
        speech: `The last video was episode ${data.episode}. ${data.title}. It's description goes like this: ${data.description}`,
    }));
    conv.close(new BasicCard({
        title: 'Watch the latest Episode',
        image: new Image({ 
            url: 'https://goo.gl/Fz9nrQ',
            alt: 'AngularFirebase Logo' 
        }),
        buttons: new Button({
            title: 'Watch',
            url: 'https://angularfirebase.com/lessons',
        }),
    }));
});



// Helper Function for scraping a webpage
async function scrapePage() {
  const page = await fetch('https://angularfirebase.com/lessons')
  const html = await page.text();

  const $ = cheerio.load(html)

  const lesson = $('.preview-content').first()

  return {
    title: lesson.find('h2').text(),
    description: lesson.find('p') .text(),
    episode: lesson.find('.ep-label').text()
  }
}


// Export the Cloud Functions
export const fulfillment = functions.https.onRequest(app);
