import express from 'express'
import reviewRouter from '../src/routes/reviews.router.js'
import commentRouter from '../src/routes/comments.router.js'

const app = express()
const PORT = 3018

app.use(express.json())
app.use('/api', [reviewRouter,commentRouter])

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
  });