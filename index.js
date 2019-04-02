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

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });

  await page.goto("https://intoli.com/blog/scrape-infinite-scroll/demo.html");

  const targetItemCount = 100;

  const result = await page.evaluate(extractItems);

  console.log(result);

  // const items = await scrapeInfiniteScrollItems(
  //   page,
  //   extractItems,
  //   targetItemCount
  // );
  //  console.log(items);
}

main();
