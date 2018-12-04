var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var cors = require('cors');
var path = require('path');
var exphbs = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(cors());

// database setup
mongoose.connect('MONGODB URI', { useNewUrlParser: true }).then(() => {
    console.log('Connected to database')
}).catch(err => {
    console.log(err);
})



var Company = require('./models/Company');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.originalname +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
    }
});

var fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

var upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

app.get('/', (req, res) => {
    Company.find({}, (err, docs) => {
        if (err) {
            res.render('error', { data: { err } })
        } else {
            res.render('home', { docs })
        }
    })
})

app.post('/upload', upload.single('logo'), (req, res) => {
    let company = new Company({
        name: req.body.name,
        logo: req.file.path
    })

    company.save(() => {
        res.render('success', { data: { name: company.name, logo: company.logo } })
    });
})

app.get('*', (req, res) => {
    res.redirect('/')
});


let PORT = 4000 || process.env.PORT;

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT)
})
