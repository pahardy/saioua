const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')
const apiKey = envContent.match(/GOOGLE_TRANSLATE_API_KEY=(.+)/)?.[1]?.trim()

if (!apiKey) {
  console.error('GOOGLE_TRANSLATE_API_KEY not found in .env')
  process.exit(1)
}

const en = require('../messages/en.json')

function flatten(obj, prefix = '') {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'string') {
      acc[fullKey] = val
    } else {
      Object.assign(acc, flatten(val, fullKey))
    }
    return acc
  }, {})
}

function unflatten(flat) {
  const result = {}
  for (const [key, val] of Object.entries(flat)) {
    const parts = key.split('.')
    let cur = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {}
      cur = cur[parts[i]]
    }
    cur[parts[parts.length - 1]] = val
  }
  return result
}

async function translate(texts, target) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: texts, source: 'en', target, format: 'text' }),
  })
  const data = await res.json()
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.data.translations.map((t) => t.translatedText)
}

async function main() {
  const flat = flatten(en)
  const keys = Object.keys(flat)
  const values = Object.values(flat)

  for (const [lang, code] of [['th', 'th'], ['lo', 'lo']]) {
    console.log(`Translating to ${lang}...`)
    const translated = await translate(values, code)
    const out = unflatten(Object.fromEntries(keys.map((k, i) => [k, translated[i]])))
    const outPath = path.join(__dirname, '..', 'messages', `${lang}.json`)
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2))
    console.log(`Written: ${outPath}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
