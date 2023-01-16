const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const Jimp = require('jimp');
const robot = require("robotjs");
const screenshot = require('screenshot-desktop');

;(async () => {
  const displays = await screenshot.listDisplays()
  await screenshot({ format: 'png', filename: './1.png', screen: displays[0].id })

  setInterval(async () => {
    await screenshot({ format: 'png', filename: './2.png', screen: displays[0].id })

    const img1 = PNG.sync.read(fs.readFileSync('1.png'))
    const img2 = PNG.sync.read(fs.readFileSync('2.png'))
    const { width, height } = img1
    const diff = new PNG({ width, height })

    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1})

    const image = await Jimp.read(diff)

    let isRed = 0
    image.scan(0, 0, width, height, function(x, y, idx) {
        var red = this.bitmap.data[idx + 0]
        var green = this.bitmap.data[idx + 1]
        var blue = this.bitmap.data[idx + 2]
        if (red === 255 && green === 0 && blue === 0) isRed++
    })
    console.log('isRed', isRed)
    if (isRed > 50000) {
      // robot.moveMouse(2600, 200)
      // robot.moveMouse(2505, 525)
      // robot.moveMouse(3777, 140)
      robot.mouseClick()
    }

    fs.writeFileSync('diff.png', PNG.sync.write(diff))
  }, 10000)
})()