const express = require("express");
const pasth = require("path");
const bcrypt = require("bcrypt");
const colllection = require("./config");
const { name } = require("ejs");
const { send } = require("process");

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",(req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//register
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.username,
            password: req.body.password
        };

        //check user exists
        const existingUser = await colllection.findOne({name: data.name});
        if(existingUser){
            res.status(400).send(`
                <script>
                    alert('Tên này đã tồn tại. Vui lòng thử tên khác.');
                    window.location.href = '/signup';
                </script>
            `);
        }else{
            //Ma hoa password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            data.password = hashedPassword;

            const userdata = await colllection.insertMany([data]); // Lưu dữ liệu vào DB
            console.log(userdata);
            res.status(200).send(`
                <script>
                    alert('Đăng ký thành công!');
                    window.location.href = '/';
                </script>
            `);
        }
    } catch (error) {
        console.error("Lỗi trong quá trình đăng ký:", error);
        res.status(500).send("Đăng ký thất bại");
    }
});


app.post("/login", async (req, res) => {
    try{
        const check = await colllection.findOne({name: req.body.username});
        if(!check){
           res.send("Không tìm thấy tài khoản này")
        }

        const isPassword = await bcrypt.compare(req.body.password, check.password);
        if(isPassword){
            res.render("home")
        }else{
            res.send("Mật khẩu không đúng")
        }
    }catch{
        res.send("wrong")
    }
});

const port = 5000;
app.listen(port, () =>{
    console.log(`Server running on port: ${port}`);
})


