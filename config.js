// const { name } = require("ejs");
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");

connect.then(() => {
    console.log("Kết nối thành công")
})
.catch(() => {
    console.log("Kết nối thất bại")
});

const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required : true
    }
});

const colllection = new mongoose.model("user", LoginSchema);

module.exports = colllection;