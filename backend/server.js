require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

// mysql connection
var connection = mysql.createConnection({
	host: process.env.MYSQL_CLOUD_HOST,
	user: process.env.MYSQL_CLOUD_USER,
	password: process.env.MYSQL_CLOUD_PASS,
	port: process.env.MYSQL_PORT,
	database: 'PonyList',
});

// set up some configs for express.
const config = {
	name: 'sample-express-app',
	port: 8000,
	host: '0.0.0.0',
};

// create the express.js object
const app = express();

// connecting the express object to listen on a particular port as defined in the config object.
var server = app.listen(config.port, config.host, e => {
	if (e) {
		throw new Error('Internal Server Error');
	}
	logger.info(`${config.name} running on ${config.host}:${config.port}`);
});

// create sockets server
const options = {
	cors: true,
	origins: ['http://127.0.0.1:5347'],
};
const io = require('socket.io')(server, options);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

io.on('connection', socket => {
	socket.on('join', ({ name, room }, callback) => {
		console.log('hello there');
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) return callback(error);

		socket.join(user.room);

		callback();
	});

	socket.on('sendMessage', (message, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit('message', { user: user.name, text: message });

		callback();
	});

	socket.on('disconnect', () => {
		console.log('User has left');
	});
});

// create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(
	cors({
		origin: '*',
	})
);
app.use(ExpressAPILogMiddleware(logger, { request: true }));

// Attempting to connect to the database.
connection.connect(function (err) {
	if (err) {
		logger.error('Cannot connect to DB!');
	} else {
		logger.info('Connected to the DB!');
	}
});

// GET /
app.get('/', (req, res) => {
	res.status(200).send('Go to 0.0.0.0:3000.');
});

//LOGIN AND REGISTER
app.post('/registerUser', (req, res) => {
	connection.query(
		'INSERT INTO Users (Username, Password, OnCampus, Dorm, IsStudent, Location) VALUES (?, ?, ?, ?, ?, ?)',
		[
			req.body.Username,
			req.body.Password,
			req.body.OnCampus,
			req.body.Dorm,
			req.body.IsStudent,
			req.body.Location,
		],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			}
			else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.post('/loginUser', (req, res) => {
	connection.query(
		'SELECT EXISTS(SELECT * FROM Users WHERE Username = ? AND Password = ?), (SELECT UserID AS result FROM Users WHERE Username = ? AND Password = ?) AS result',
		[
			req.body.Username,
			req.body.Password,
			req.body.Username,
			req.body.Password,
		],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else if (!rows[0].result) {
				res.send('false');
			} else {
				res.status(200).send(rows[0].result.toString());
			}
		}
	);
});

//USERS CALLS
app.get('/users', function (req, res) {
	connection.query('SELECT * FROM Users', function (err, result, fields) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.get('/user/:UserID', (req, res) => {
	connection.query(
		'SELECT * FROM Users WHERE UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/userRating/:UserID', (req, res) => {
	connection.query(
		'SELECT AVG(r.Rating) as Rating from Reviews r INNER JOIN Users u ON r.SellerID = u.UserID WHERE u.UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/reviews/:UserID', (req, res) => {
	connection.query(
		'SELECT ReviewID, SellerID, ItemID, BuyerID, Username, ReviewText, r.Rating, Date FROM Reviews r INNER JOIN Users u ON r.BuyerID = u.UserID WHERE SellerID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/addReview', (req, res) => {
	connection.query(
		'INSERT INTO PonyList.Reviews (SellerID, ItemID, BuyerID, ReviewText, Rating) VALUES(?, ?, ?, ?, ?)',
		[
			req.body.SellerID,
			req.body.ItemID,
			req.body.BuyerID,
			req.body.ReviewText,
			req.body.Rating,
		],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.get('/userItems/:ID', (req, res) => {
	connection.query(
		'SELECT ItemID, ItemName, ItemCost, ItemDetails, `Condition`, IsSold, DatePosted, ImageURL FROM Items i INNER JOIN Users u on i.SellerID = u.UserID WHERE u.UserID = ?',
		[req.params.ID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/soldItems/:UserID', (req, res) => {
	connection.query(
		'SELECT Items.ItemID, ItemName, ItemCost, ItemDetails, ImageURL FROM Items INNER JOIN Transactions on Items.ItemID = Transactions.ItemID WHERE Transactions.SellerID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/boughtItems/:UserID', (req, res) => {
	connection.query(
		'SELECT Items.ItemID, ItemName, ItemCost, ItemDetails, ImageURL FROM Items INNER JOIN Transactions on Items.ItemID = Transactions.ItemID WHERE Transactions.BuyerID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/sharedProducts/:UserID', (req, res) => {
	connection.query(
		'SELECT * FROM SharedProducts WHERE UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/favorites/:UserID', (req, res) => {
	connection.query(
		'SELECT Distinct Items.ItemID, ItemName, ItemCost, ItemDetails, ImageURL, DatePosted FROM Items INNER JOIN Favorites on Favorites.ItemID = Items.ItemID WHERE Favorites.UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.delete('/deleteFavorite/:ItemID', async (req, res) => {
	var ItemID = req.body.ItemID;

	connection.query(
		'DELETE FROM Favorites WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) return console.error(error.message);
			res.end(JSON.stringify(result));
		}
	);
});

//delete favorite by UserID and ItemID
app.delete('/deleteFavorite/:UserID/:ItemID', async (req, res) => {
	var UserID = req.body.UserID;
	var ItemID = req.body.ItemID;
	connection.query(
		`DELETE FROM Favorites WHERE (UserID = ${req.params.UserID} and ItemID = ${req.params.ItemID})`,

		function (err, result, fields) {
			if (err) return console.error(error.message);
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/addFavorite', (req, res) => {
	connection.query(
		'INSERT INTO PonyList.Favorites (UserID, ItemID) VALUES(?, ?)',
		[req.body.UserID, req.body.ItemID],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.delete('/deleteShared/:ItemID', async (req, res) => {
	var ItemID = req.body.ItemID;

	connection.query(
		'DELETE FROM SharedProducts WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) return console.error(error.message);
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/shareProduct', (req, res) => {
	connection.query(
		'INSERT INTO PonyList.SharedProducts (UserID, ItemID) VALUES(?, ?)',
		[req.body.UserID, req.body.ItemID],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.get('/availableTimes/:UserID', (req, res) => {
	connection.query(
		'SELECT Day, Time FROM AvailableTimes WHERE UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/addTime', (req, res) => {
	connection.query(
		'INSERT INTO PonyList.AvailableTimes (UserID, Day, Time) VALUES(?, ?, ?)',
		[req.body.UserID, req.body.Day, req.body.Time],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

//app.patch('/:UserID/:ProfilePicture', async (req, res) => {
//    var ProfilePicture = req.body.ProfilePicture;
//    var UserID = req.body.UserID;
//    connection.query("UPDATE PonyList.Users SET ProfilePicture = ? WHERE UserID=?;", [ProfilePicture, UserID],function (err, result, fields) {
//    if (err) throw err;
//    console.log(result);
//    res.end(JSON.stringify(result));
//    });
//});

app.patch('/updateMilesAway/:UserID/:MilesAway', async (req, res) => {
	connection.query(
		'UPDATE PonyList.Users SET MilesAway = ? WHERE UserID=?;',
		[req.params.MilesAway, req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.end(JSON.stringify(result));
		}
	);
});

app.patch('/updateProfilePicture', (req, res) => {
	var UserID = req.body.UserID;
	var ProfilePicture = req.body.ProfilePicture;
	connection.query(
		'UPDATE Users SET ProfilePicture = ? WHERE UserID = ?',
		[ProfilePicture, UserID],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

//ITEMS CALLS
app.get('/items', function (req, res) {
	connection.query(
		'SELECT Items.ItemID, Items.SellerID, Username, AVG(Reviews.Rating) as Rating, OnCampus, ItemName, ItemCost, ItemDetails, `Condition`, IsSold, ImageURL, DatePosted FROM Items Inner Join Users on Items.SellerID = Users.UserID Left Outer Join Reviews on Items.SellerID = Reviews.SellerID group by ItemID;',
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/item/:ItemID', (req, res) => {
	connection.query(
		'SELECT Items.ItemID, Items.SellerID, Username, AVG(Reviews.Rating) as Rating, OnCampus, ItemName, ItemCost, ItemDetails, `Condition`, IsSold, ImageURL, DatePosted FROM Items Inner Join Users on Items.SellerID = Users.UserID Left Outer Join Reviews on Items.SellerID = Reviews.SellerID WHERE Items.ItemID = ?;',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/images/:ItemID', (req, res) => {
	connection.query(
		'SELECT ImageURL FROM Images WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/addImage', (req, res) => {
	connection.query(
		'INSERT INTO Images (ItemID, ImageURL) VALUES (?, ?)',
		[req.body.ImageID, req.body.ImageURL],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.post('/addItem', (req, res) => {
	connection.query(
		'INSERT INTO Items (SellerID, ItemName, ItemCost, ItemDetails, `Condition`, ImageURL) VALUES (?, ?, ?, ?, ?, ?)',
		[
			req.body.SellerID,
			req.body.ItemName,
			req.body.ItemCost,
			req.body.ItemDetails,
			req.body.Condition,
			req.body.ImageURL,
		],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.delete('/deleteItem/:ItemID', async (req, res) => {
	var ItemID = req.body.ItemID;

	connection.query(
		'DELETE FROM Items WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) return console.error(error.message);
			res.end(JSON.stringify(result));
		}
	);
});

app.put('/updateItem', async (req, res) => {
	var SellerID = req.body.SellerID;
	var ItemName = req.body.ItemName;
	var ItemCost = req.body.ItemCost;
	var ItemDetails = req.body.ItemDetails;
	var Condition = req.body.Condition;
	var ImageURL = req.body.ImageURL;
	var ItemID = req.body.ItemID;

	connection.query(
		'UPDATE PonyList.Items SET SellerID=?, ItemName=?, ItemCost=?, ItemDetails=?, `Condition`=?, ImageURL=?, DatePosted=CURRENT_TIMESTAMP WHERE ItemID=?;',
		[
			SellerID, ItemName, ItemCost, ItemDetails, Condition, ImageURL, ItemID,
		],
		function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			res.end(JSON.stringify(result));
		}
	);
});

app.patch('/updateIsSold/:ItemID', async (req, res) => {
	connection.query(
		'UPDATE Items SET IsSold = 1 WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			res.end(JSON.stringify(result));
		}
	);
});

// app.get('/addSale/:UserID', (req, res) => {
//     connection.query("UPDATE Users SET NumSales = NumSales + 1 WHERE UserID = ?",
//         [req.params.ItemID],
//         function (err, result, fields) {
//             if (err) throw err;
//             res.end(JSON.stringify(result));
//         }
//     );
// });

app.patch('/addSale/:UserID', async (req, res) => {
	connection.query(
		'UPDATE Users SET NumSales = NumSales + 1 WHERE UserID = ?',
		[req.params.UserID],
		function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/SellerID/:ItemID', (req, res) => {
	connection.query(
		'SELECT SellerID FROM Transactions WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/isSold/:ItemID', (req, res) => {
	connection.query(
		'SELECT COUNT(1) FROM Transactions WHERE ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/favoritedBy/:ItemID', (req, res) => {
	connection.query(
		'Select f.UserID, Username from Favorites f inner join Users u on f.UserID = u.UserID where ItemID = ?',
		[req.params.ItemID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

//transaction calls
app.get('/allTransactions', function (req, res) {
	connection.query(
		'SELECT * FROM Transactions',
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.post('/buyItem', (req, res) => {
	connection.query(
		'INSERT INTO Transactions (BuyerID, SellerID, ItemID, Rating) VALUES(?, ?, ?, ?)',
		[req.body.BuyerID, req.body.SellerID, req.body.ItemID, req.body.Rating],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

//MESSAGES CALLS

app.post('/sendMessage', (req, res) => {
	connection.query(
		'INSERT INTO Messages (RecipientID, SenderID, MessageText) VALUES (?, ?, ?)',
		[req.body.RecipientID, req.body.SenderID, req.body.MessageText],
		function (err, rows, fields) {
			if (err) {
				logger.error('Error while executing Query');
				res.status(400).json({
					data: [],
					error: 'MySQL error',
				});
			} else {
				console.log('check');
				res.status(200).json({
					data: rows,
				});
			}
		}
	);
});

app.get('/messages/:SenderID/:RecipientID', (req, res) => {
	connection.query(
		'SELECT * FROM Messages WHERE SenderID = ? AND RecipientID = ?',
		[req.params.SenderID, req.params.RecipientID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});

app.delete('/deleteMessage/:MessageID', async (req, res) => {
	var ItemID = req.body.ItemID;

	connection.query(
		'DELETE FROM Messages WHERE MessageID = ?',
		[req.params.MessageID],
		function (err, result, fields) {
			if (err) return console.error(error.message);
			res.end(JSON.stringify(result));
		}
	);
});

app.get('/contacts/:SenderID', (req, res) => {
	connection.query(
		'SELECT DISTINCT(RecipientID), Username FROM Messages INNER JOIN Users on Messages.RecipientID = Users.UserID WHERE SenderID = ?',
		[req.params.SenderID],
		function (err, result, fields) {
			if (err) throw err;
			res.end(JSON.stringify(result));
		}
	);
});
