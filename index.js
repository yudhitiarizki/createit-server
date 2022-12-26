const sqlite3 = require('sqlite3').verbose();

// Membuat file database baru
const db = new sqlite3.Database('./database/database.db');
db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT)');

// Menutup koneksi ke database setelah semua operasi selesai
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Koneksi ke database berhasil ditutup.');
});