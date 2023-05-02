const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

// 创建服务器实例
const app = express();

// 添加跨域配置
app.use(cors());
// 解析 body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 文件上传配置
app.use(fileUpload({ createParentPath: true, defParamCharset: "utf8" }));

// 静态文件
app.use(express.static("files/"));

function handlerUpload(req, res) {
  if (req.files == null)
    return res.status(400).send({ status: 400, message: "请上传具体文件" });

  const uploaderr = [],
    links = [];

  const files = req.files;

  const keys = Object.keys(files);

  for (let i = 0; i < keys.length; i++) {
    const file = files[keys[i]];

    file.mv(`./files/${file.name}`, (err) => {
      if (err) {
        uploaderr.push(file.name);
      } else {
        links.push({
          name: file.name,
          link: `http://127.0.0.1:8362/${file.name}`,
        });
      }

      if (i < keys.length - 1) return;

      if (uploaderr.length) {
        res.send({
          status: 500,
          message: `${uploaderr.join("、")}等文件上传失败`,
          result: links,
        });
      } else {
        res.send({
          status: 200,
          message: "文件上传成功",
          result: links,
        });
      }
    });
  }
}

app.post("/upload", handlerUpload);

app.listen(8362, () => {
  console.log("services is runing http://127.0.0.1:8362/");
});
