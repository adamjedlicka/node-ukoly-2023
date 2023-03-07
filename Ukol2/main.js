import http from 'http'
import fs from 'fs/promises'

const server = http.createServer(async (req, res) => {
  try {
    // .slice uřízne první znak, který je lomítko
    // .split rozdělí cestu na části podle lomítka
    const parts = req.url.slice(1).split('/')
    // .shift odstraní první část cesty a vrátí ji
    const operation = parts.shift()
    // .pop odstraní poslední část cesty a vrátí ji
    const content = operation === 'write' ? parts.pop() : ''
    const filename = parts.pop()
    // .join spojí části cesty dohromad
    // pokud žádná cesta není, použijeme tečku reprezentující aktuální adresář
    const path = parts.join('/') || '.'

    if (operation === 'write') {
      if (path !== '.') {
        // Musíme vytvořit adresáře, pokud neexistují
        await fs.mkdir(path, { recursive: true })
      }

      await fs.writeFile(`${path}/${filename}`, content, { encoding: 'utf-8' })

      res.write('OK')
      res.end()
    } else if (operation === 'read') {
      const buffer = await fs.readFile(`${path}/${filename}`, { encoding: 'utf-8' })
      const string = buffer.toString()

      res.write(string)
      res.end()
    } else {
      throw new Error('Neplatná operace')
    }
  } catch (error) {
    res.write(error.message)
    res.end()
  }
})

server.listen(3000, () => {
  console.log('Server is running on  http://localhost:3000')
})
