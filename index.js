const express = require("express")
const config = require("config")
const PORT = config.get('port')
const mongoose = require("mongoose")
const fs = require("fs")
const multer = require('multer')
const app = express()
const corsMiddleware = require('./middleware/cors.middleware')
const authRouter = require("./routes/auth.routes")
const courseRouter = require("./routes/courses.routes")
const letterRouter = require("./routes/letters.routes")
const answerRouter = require("./routes/answer.routes")
const userRouter = require("./routes/user.routes")
const photoRouter = require("./routes/photo.routes")

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})


app.use(corsMiddleware)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use("/auth", authRouter)
app.use("/courses", courseRouter)
app.use("/letters", letterRouter)
app.use("/answers", answerRouter)
app.use("/user", userRouter)
app.use("/photo", photoRouter)
app.use('/upload', express.static('uploads'))
const upload = multer({ storage })
app.use('/avatar', express.static('avatars'))
const avatar = multer({ storage })

app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    })
})
app.post('/avatar', avatar.single('image'), (req, res) => {
    res.json({
        url: `/avatar/${req.file.originalname}`,
    })
})


const start = async () => {
    try {

        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('MongoDb connected'))
            .catch((err) => console.log('MongoDb error', err))

        app.listen(PORT, () => {
            console.log('Server started on port ', PORT)
        })
    } catch (e) {
        console.log(e)
    }
}

app.get('/', (req, res) => {

    return res.json({
        message: "Привки"
    });
})



start();