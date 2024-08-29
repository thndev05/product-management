require('dotenv').config();
const express = require('express');
const path = require('path');
const database = require('./config/database');
const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const systemConfig = require('./config/system');
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');


// Connect database
database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Template engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// Tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Flash
app.use(cookieParser('KEYADJGFUQHEOD'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Public folder
app.use(express.static(`${__dirname}/public`));

// Routes
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})