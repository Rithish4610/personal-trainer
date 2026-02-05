// Express backend entry point
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Personal Trainer Backend Running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
