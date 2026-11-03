import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const files = [
  'public/mobile1.png',
  'public/products/acai1.png',
  'public/products/acai2.png',
  'public/products/acai3.png',
  'public/products/acai4.png',
  'public/sections/site1.png',
  'public/sections/site2.png',
  'public/sections/site3.png',
]

async function run() {
  console.log('--- Iniciando Otimização de Imagens para WebP ---')
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.log(`Pular (não existe): ${file}`)
      continue
    }

    const outWebp = file.replace(/\.png$/, '.webp')
    const originalStat = fs.statSync(file)

    await sharp(file)
      .webp({ quality: 85, effort: 6 })
      .toFile(outWebp)

    const newStat = fs.statSync(outWebp)
    const savings = ((1 - newStat.size / originalStat.size) * 100).toFixed(1)
    console.log(`✓ ${file}: ${(originalStat.size / 1024 / 1024).toFixed(2)} MB -> ${(newStat.size / 1024).toFixed(1)} KB (-${savings}%)`)
  }
  console.log('--- Otimização Concluída com Sucesso ---')
}

run().catch(console.error)
