const express = require('express')

const server = express()
server.use(express.json())

const projects = []
let requests = 0;

function checkId (req, res, next) {
    const { id } = req.params
    
    const project = projects.find(p => p.id == id)

    if(!project) {
        return res.json({error: 'Projeto não localizado!'})
    }

    return next()
}

function countRequests (req, res, next) {
    requests++

    console.log(`Número de request: ${requests}`)

    return next()
}

server.use(countRequests);

// Lista todos os projetos
server.get('/projects', (req, res) => {
    res.json(projects)
})

// Incluir novo projeto
server.post('/projects', (req, res) => {
    const { id, title } = req.body
    
    const idProject = projects.findIndex(p => p.id == id)

    if (idProject != -1) {
        return res.json({ Error: 'Projeto ja existente!' })
    }    

    projects.push({
        id,
        title,
        tasks: []
    })

    return res.json(projects)
})

// Alterar projeto
server.put('/projects/:id', checkId, (req, res) => {
    const { id } = req.params

    const { title } = req.body

    const idProject = projects.findIndex(p => p.id == id)

    projects[idProject].title = title

    return res.json(projects[idProject])

})

// Deletar projeto
server.delete('/projects/:id', checkId, (req, res) => {
    const { id } = req.params

    const idProject = projects.findIndex(p => p.id == id)

    projects.splice(idProject, 1)

    return res.json()
})

// Incluir Tasks

server.post('/projects/:id/tasks', checkId, (req, res) => {
    const { id } = req.params
    const { title } = req.body

    const idProject = projects.findIndex(p => p.id == id)

    projects[idProject].tasks.push(title)

    return res.json(projects[idProject])

})


server.listen(3000)

