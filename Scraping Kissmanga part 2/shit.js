const puppeteer = require('puppeteer-extra')
const pluginStealth = require('puppeteer-extra-plugin-stealth')

const solve = require('special/weird.js')

async function run () {
  puppeteer.use(pluginStealth())

  const browser1 = await puppeteer.launch({
    headless: false,
    args: ['--window-size=360,500', '--window-position=000,000', '--no-sandbox', '--disable-dev-shm-usage']
  })

  const page1 = await browser1.newPage()

  await page1.setDefaultNavigationTimeout(0)

  page1.goto('https://www.google.com/recaptcha/api2/demo')

  solve(page1)
}

console.log('`ctrl + c` to exit')
process.on('SIGINT', () => {
  console.log('bye!')
  process.exit()
})

run()
