import express from 'express'
import pg from 'pg'

const app = express()
const { Pool } = pg

// 1. TAMBAHKAN DEKLARASI PORT EXPRESS DI SINI
const port = 3000

app.use(express.json())
app.use(
    express.urlencoded({ 
        extended: true,
    })
)

// Konfigurasi Database PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: '',
    port: 5432, // Port khusus database PostgreSQL
})

// Endpoint GET
app.get('/', (req, res, next) => {
    console.log("TEST DATA :");
    pool.query('SELECT * FROM biodata')
        .then(testData => {
            console.log(testData);
            res.send(testData.rows);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})  

// Jalankan Web Server Express
app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
})
//

app.post('/biodata', (req, res) => {
  const { id, nama, nim, kelas } = req.body;

  pool.query(
    'INSERT INTO biodata (id, nama, nim, kelas) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, nama, nim, kelas]
  )
    .then(result => res.json(result.rows[0]))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});