import express from 'express';
import config from '@/config';

const app = express();

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World',
  });
});

app.listen(config.PORT, () => {
  console.log(`Server is running: http://localhost:${config.PORT}`);
});
