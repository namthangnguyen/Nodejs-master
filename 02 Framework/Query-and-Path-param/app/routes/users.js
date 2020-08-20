const express = require('express');
// ExpressJS cung cấp một đối tượng router chuyên dùng để khai báo route
const user_router = express.Router();

var usersData = [
	{ id: 1, name: "User1", email: "user1@gmail.com", age: 31 },
	{ id: 2, name: "User2", email: "user2@gmail.com", age: 20 },
	{ id: 3, name: "User1", email: "user3@gmail.com", age: 25 }
];

user_router.get('/', function (req, res) {
	res.render('index', { users: usersData });
});

user_router.get('/search', (req, res) => {
	var name_search = req.query.name // lấy giá trị của key name trong query parameters gửi lên
	var age_search = req.query.age // lấy giá trị của key age trong query parameters gửi lên
	var result = usersData.filter((user) => {
		// tìm kiếm chuỗi name_search trong user name. 
		// Lưu ý: Chuyển tên về cùng in thường hoặc cùng in hoa để không phân biệt hoa, thường khi tìm kiếm
		return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
	})

	res.render('index', {
		users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
	});
})

user_router.get('/create', (req, res) => {
	res.render('create');
})

user_router.post('/create', (req, res) => {
	usersData.push(req.body);
	res.redirect('')
})

user_router.get('/:id', (req, res) => {
	console.log(req.params);
	var user = usersData.find((user) => {
		return user.id == parseInt(req.params.id);
	});
	res.render('show', {
		user: user
	})
})

module.exports = user_router;