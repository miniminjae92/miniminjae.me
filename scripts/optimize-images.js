const sharp = require("sharp");
const { glob } = require("glob");
const fs = require("fs");
const path = require("path");

const TARGET_DIR = "src/content/**/*.+(png|jpg|jpeg)";

async function optimizeImages() {
  const files = await glob(TARGET_DIR);
  console.log(`🔍 ${files.length}개의 이미지를 발견했습니다.`);

  let count = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();

    try {
      const buffer = await fs.promises.readFile(file);

      if (ext === ".png") {
        await sharp(buffer)
          .png({ quality: 80, compressionLevel: 9 })
          .toFile(file);
      } else {
        await sharp(buffer).jpeg({ quality: 80, mozjpeg: true }).toFile(file);
      }

      console.log(`✅ Optimized: ${file}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed: ${file}`, err);
    }
  }

  console.log(`🎉 총 ${count}개의 이미지를 최적화했습니다!`);
}

optimizeImages();
