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
var fs = require('fs')

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
    
    try {
        if(req.validation) throw req.validation
        let data = JSON.parse(req.body.propgambar)
        db.query(`insert into gambar values (0,'${data.nama}','files/${req.file.filename}',${data.price})`, (err, result) => {
            if (err) throw err
            res.send('Success')
        })

        // pakai split
        // let data=req.body.propgambar.split('||') 
        // db.query(`insert into gambar values (0,'${data[0]}','files/${req.file.filename}',${data[1]})`,(err,result)=>{
        //     if(err)throw err
        //     res.send('Success')
        // })    
    } catch (error) {
        fs.unlinkSync(req.file.path)
        console.log(error);
    }
    
})

app.get('/getall',(req,res)=>{
    db.query('select * from gambar',(err,result)=>{
        if(err) throw err
        res.send(result)
    })
})



app.listen(port, console.log('Listening in '+port))

