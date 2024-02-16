const express = require('express');
const cors = require('cors');
const Todo = require('././src/models/todo');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/web-sushi');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection refused'));
db.once('open', ()=>{
    console.log('Connected to MongoDB');
})

app.listen(4000, ()=>{
    console.log('Application listening to port 4000');
})


app.post('/todos', async (req, res) => {
    try {
        console.log('Post Mapping started' + req.body);
        const {title, description, date} = req.body;
        const todo = new Todo({title, description, date})
        await todo.save();
        res.json(todo);
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.get('/todos', async (req, res) => {
    try {
        const todo = await Todo.find();
        res.json(todo);
    } catch (e) {
        res.status('500').json({error: e.message})
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        // console.log(req.params.id);
        const { title, description,date } = req.body;
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { title, description, date },
            { new: true }
        );
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
