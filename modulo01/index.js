const express = require('express')

const server = express()

server.use(express.json())

const users = ['Pedro', 'Luiza', 'Sophia']

server.use((req, res, next) => {
    console.time('Request')
    console.log(`Método: ${req.method} Url: ${req.url}`)

    next()
    console.timeEnd('Request')
})

function checkUserNome (req, res, next) {
    if (!req.body.nome) {
        return res.status(400).json({error: 'Usuario faltando!'})
    }

    return next()
}

function checkUserArray (req, res, next) {
    const user = users[req.params.index]
    if (!user) {
        return res.status(400).json({error: 'Usuario não existe!'})
    }

    req.user = user

    return next()
}


server.get('/users', (req, res) => {
    return res.json(users)
})

server.get('/users/:index', checkUserArray, (req, res) => {

  res.json({message: `Usuario: ${req.user}`})
})

server.post('/users', checkUserNome, (req, res) => {
    const { nome } = req.body

    users.push(nome)

    res.json(users)
})

server.put('/users/:index', checkUserNome, checkUserArray, (req, res) => {
    const { index } = req.params
    const { nome } = req.body

    users[index] = nome

    return res.json(users)
})

server.delete('/users/:index', checkUserArray, (req, res) => {
    const { index } = req.params

    users.splice(index, 1)

    return res.json(users)
})

server.listen(3000)