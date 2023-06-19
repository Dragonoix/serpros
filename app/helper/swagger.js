const express = require('express');

const router = express.Router();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const config = require(appRoot + '/config/index')
const { NONAME } = require('dns');

/* This is for Admin end swiagger API doc */
const optionsAdmin = {
	swaggerDefinition: {
		info: {
			title: project_name,
			version: '1.0.0',
			description: project_name + ' Frontend API Doc',
			contact: {
				email: '',
			},
		},
		tags: [
			{
				name: "User",
				description: "User API"
			},
		],
		schemes: ['https', 'http'],
		host: `serpros.dedicateddevelopers.us`,
		// host: `127.0.0.1:1597`,
		basePath: '/api',
		securityDefinitions: {
			Token: {
				type: 'apiKey',
				description: 'JWT authorization of an API',
				name: 'x-access-token',
				in: 'header',
			},
		},
	},

	apis: [path.join(__dirname, `../routes/api/*.js`)],
};



const swaggerSpec = swaggerJSDoc(optionsAdmin);
require('swagger-model-validator')(swaggerSpec);

router.get('/apidoc-json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

router.use('/apidoc', swaggerUi.serveFiles(swaggerSpec), swaggerUi.setup(swaggerSpec));


function validateModel(name, model) {
	const responseValidation = swaggerSpec.validateModel(name, model, false, true);
	if (!responseValidation.valid) {
		throw new Error('Model doesn\'t match Swagger contract');
	}
}





module.exports = {
	router,
	validateModel
};
