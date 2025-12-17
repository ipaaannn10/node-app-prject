const express = require('express');
const app = express();

// Gunakan port dari environment Hostinger atau 3000
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Node.js Server OK');
});

app.listen(port, () => {
  console.log(`Server nyala di port ${port}`);
});
