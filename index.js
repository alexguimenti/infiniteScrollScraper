const puppeteer = require("puppeteer");

function extractItems() {
  const extractedItems = Array.from(
    // função dentro do browser para criar uma node list
    document.querySelectorAll("#boxes > div.box")
  );

  // transformar em array
  const items = extractedItems.map(element => element.innerText);
  return items;
}

// delay padrao de 1000 ms
async function scrapeInfiniteScrollItems(
  page,
  extractItems,
  targetItemCount,
  scrollDelay = 1000
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < targetItemCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForFunction(
        `document.body.scrollHeight > ${previousHeight}`
      );
      // se tiver num site real variar o delay para não ser banido
      await page.waitFor(scrollDelay);
    }
  } catch (error) {
    console.log(error);
  }
  return items;
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto("https://intoli.com/blog/scrape-infinite-scroll/demo.html");

  const targetItemCount = 100;

  const result = await page.evaluate(extractItems);

  // console.log(result);

  const items = await scrapeInfiniteScrollItems(
    page,
    extractItems,
    targetItemCount
  );
  console.log(items);
}

main();
