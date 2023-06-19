module.exports = {
    app: {
		port: process.env.PORT || 1111,
		appName: process.env.APP_NAME || 'BasicAdmin',
		env: process.env.NODE_ENV || 'development',
        isProd:(process.env.NODE_ENV === 'prod'),
        getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
        getApiFolderName: process.env.API_FOLDER_NAME || 'api',
		project_name: "Serpros Admin",
		project_description: "Serpros Admin"
	},
	db: {
		port: process.env.DB_PORT || 27117,
		database: process.env.DB_NAME || 'basicAdminDb',
		password: process.env.DB_PASS || 'basicAdminPassword@123',
		username: process.env.DB_USER || 'developer',
		host: process.env.DB_HOST || '104.211.217.29',
		dialect: 'mongodb'
	},
	winiston: {
		logpath: '/iLrnLogs/logs/',
	},
	auth: {
		jwtSecret: process.env.JWT_SECRET || 'MyS3cr3tK3Y',
		jwt_expiresin: process.env.JWT_EXPIRES_IN || '1d',
		saltRounds: process.env.SALT_ROUND || 10,
		refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
		refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d', // 2 days
	},
	// webPush: {
	// 	publicKey: process.env.WEBPUSH_PUBLIC_KEY?process.env.WEBPUSH_PUBLIC_KEY.toString():'',
	// 	privateKey: process.env.WEBPUSH_PRIVATE_KEY?process.env.WEBPUSH_PRIVATE_KEY.toString():''
	// },
	sendgrid: {
		api_key: process.env.SEND_GRID_API_KEY,
		from_email: process.env.FROM_EMAIL || 'nodejs_developer_wdc@yopmail.com',
	},
	other: {
        pageLimit: 10
    },
	theme: {
		// Light Mode Starts
		bgColorLight: '#f8f8f8',
		cardColorLight: '#ffffff',
		cardMutedTextColorLight: '#b9b9c3',
		menuBgColorLight: '#ffffff',
		menuBrandTextColorLight: '#7367f0',
		menuIconColorLight: '#6e6b7b',
		menuHeaderTextColorLight: '#a6a4b0',
		contentHeaderTextColorLight: '#636363',
		formLabelTextColorLight: '#5e5873',
		anchorTextColorLight: '#7367f0',
		headerTagTextColorLight: '#5e5873',
		bodyTextColorLight: '#6e6b7b',
		// Light Mode Ends
	
		// Dark Mode Starts
		bgColorDark: '#161d31',
		cardColorDark: '#283046',
		cardMutedTextColorDark: '#676d7d',
		menuBgColorDark: '#283046',
		menuBrandTextColorDark: '#7367f0',
		menuIconColorDark: '#d0d2d6',
		menuHeaderTextColorDark: '#676d7d',
		contentHeaderTextColorDark: '#d0d2d6',
		formLabelTextColorDark: '#d0d2d6',
		anchorTextColorDark: '#7367f0',
		headerTagTextColorDark: '#d0d2d6',
		bodyTextColorDark: '#b4b7bd',
		// Dark Mode Ends
	}
};
