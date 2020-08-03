const jwt = require("jsonwebtoken")
const User = require('../models/UserModel')
// Middleware xác minh client
module.exports = async function (req, res, next) {


  // const token = req.headers["x-access-token"] || req.headers["authorization"]
  // // Check HEADER REQUEST có authorization or x-access-token không, không => loại luôn
  // if (!token) return res.status(401).send("Access denied. No token provided.")

  // // Hàm verify: xác minh token có phải do server mình tạo ra không
  // /* 
  //   Quá trình: Lấy header và payload trong token băm (bằng thuật toán do phần header server quy đinh) với secretkey (của server chỉ server biết) 
  //   so sánh với signature trong token, sai => invalid token
  //   đúng => verify token, giải mã payload để lấy info.
  // */
  // try {
  //   // Set req.user = nội dung payload (sau này dùng để xác minh, phân quyền cho user) and pass to next middleware
  //   jwt.verify(token, process.env.JWT_SECRET_KEY , function(err, payload) {
  //     if (err) throw err
  //     else req.user = payload
  //     next()
  //   })
  // } catch (err) {
  //   res.status(400).send("Invalid token.")
  // }

  const token = req.header('Authorization')
  const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
  try {
    const user = await User.findOne({ _id: data._id, 'tokens.token': token })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this resource' })
  }

}