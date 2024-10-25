const express = require('express');

const bodyParser = require('body-parser');

const i18nextMiddleware = require('i18next-http-middleware');

const i18next = require('./util/i18n/config');

const { sequelize } = require('./models');

const { globalErrorHandler, notFoundHandler, changeLanguage } = require('./util/errorHandler');

const app = express();

app.get('/test', (req, res) => {
    return res.json("welcome to repair app!");
});

app.use(i18nextMiddleware.handle(i18next));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(changeLanguage);

app.use('/test/api', require('./routes'));

app.use(notFoundHandler);

app.use(globalErrorHandler);

app.listen(process.env.PORT, async () => {
    await sequelize.sync({alter: true});
    await sequelize.authenticate();

    console.log(`Server started on port ${process.env.PORT}`);
});