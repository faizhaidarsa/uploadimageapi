var mysql = require('mysql')
const db = mysql.createConnection({
    user:'root',
    password:'password',
    database:'datagambar',
    host:'localhost'
})

var express = require('express')
var app = express()
const port = 9000
var bodyParser = require('body-parser')
var cors = require('cors')
var multer = require('multer')

app.use(bodyParser.json())
app.use(cors())
app.use('/files',express.static('./uploads'))

let multerStorageConfig = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename : (req,file,cb)=>{
        cb(null,`PRD-${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
})

let filterConfig = (req,file,cb)=> {
    if(file.mimetype.split('/')[1]=='png'||file.mimetype.split('/')[1]=='jpeg'){
        cb(null,true)
    }else{
        req.validation = {error:true,msg:'File must be an image'}
        cb(null,false)
    }
}

let upload = multer({
    storage:multerStorageConfig,
    fileFilter:filterConfig
})

app.post('/uploadimage',upload.single('gambar'), (req,res)=>{
    db.query(`insert into gambar values (0,'${req.body.namagambar}','${req.file.filename}')`,(err,result)=>{
        if(err)throw err
        console.log(result);
    })
    res.send('Success')
})

app.get('/getall',(req,res)=>{
    db.query('select * from gambar',(err,result)=>{
        if(err) throw err
        res.send(result)
    })
})



app.listen(port, console.log('Listening in '+port))

