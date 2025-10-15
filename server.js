const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.static('public'));
app.use('/music', express.static('music'));
app.use(express.json());

app.post('/validate', (req, res) => {
  const { code } = req.body;
  if (code === '1109') {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

app.get('/letter', async (req, res) => {
  try {
    const letterContent = await fs.readFile('letter.txt', 'utf-8');
    res.json({ content: letterContent });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membaca surat' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});