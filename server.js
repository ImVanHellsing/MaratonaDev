// Configuraração inicial do servidor
const express = require("express")
const server = express()

// Configurando servidor para arquivos estáticos / complementares
server.use(express.static('public'))

// Habiltiar body
server.use(express.urlencoded({ extended: true}))

// Configurar Banco de Dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'donation'
})

// Configurando a Template Engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// Startando a página INDEX
server.get("/", function(req, res){   
   
    db.query("SELECT * FROM donors", function(err, result){

        if(err) return res.send("Erro ao acessar o Bando de Dados!")

        const donors = result.rows

        return res.render("index.html",{donors})
    })
})

// Pegando dados do formulário
server.post("/", function(req, res){
    const name  = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Verificação de NULLs
    if(name == "" || email == "" || blood == ""){

        return res.send("Por favor, preencha todos os campos!")
    }

    // Colocando dados no BD
    const query = `
            INSERT INTO donors ("name", "email", "blood") 
            VALUES ($1,$2,$3)`

    const values = [name,email,blood]
    
    db.query(query, values, function(err){

        // IF ERROR
        if(err) return res.send("Erro ao acessar o Bando de Dados!")

        //IF SUCESS
        return res.redirect("/")
    })
})

// Conectar servidor à porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor!")
})