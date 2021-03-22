const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env.example') });

const app = express();
require('./lib/passport/passport');

app.locals.pretty = true;

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
	secret: 'Keyboard cat',
	resave: false,
	saveUninitialized: false,
	store: new MySQLStore({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		createDatabaseTable: true
	})
}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist/')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/fontawesome', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	app.locals.messages = req.flash();
	app.locals.user = req.user;
	next();
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/authentications'));
app.use('/tasks', require('./routes/tasks'));
app.use('/users', require('./routes/users'));
app.use('/settings', require('./routes/settings'));

app.listen(app.get('port'), () => {
	console.log(`Server running on port ${app.get('port')}`);
});
