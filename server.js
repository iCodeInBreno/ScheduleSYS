const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'agendamentos'
});

connection.connect(err => {
    if (err) {
        console.error('Erro de conexão:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});

app.post('/agendar', (req, res) => {
    const data = req.body;

    const sql = `INSERT INTO agendamento (laboratorio, data, horario_inicial, horario_final, status)
                 VALUES (?, ?, ?, ?, 'agendado')`;

    connection.query(sql, [data.lab, data.data, data.horarioInicial, data.horarioFinal,], (err, result) => {
        if (err) {
            console.error('Erro ao agendar:', err);
            res.status(500).json({ error: 'Erro ao agendar.' });
        } else {
            console.log('Agendamento realizado com sucesso!');
            res.status(200).json({ message: 'Agendamento realizado com sucesso!' });
        }
    });
});

app.get('/horariosAgendados', (req, res) => {
    const sql = 'SELECT horario_inicial FROM agendamento WHERE status = "agendado"';
    
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao obter horários agendados:', err);
            res.status(500).json({ error: 'Erro ao obter horários agendados.' });
        } else {
            const horariosAgendados = result.map(row => row.horario_inicial);
            res.status(200).json({ horariosAgendados });
        }
    });
});

app.get('/agendamentos', (req, res) => {
    connection.query('SELECT * FROM agendamento', (err, results) => {
        if (err) {
            console.error('Erro ao executar a consulta SQL:', err);
            res.status(500).json({ error: 'Erro ao obter agendamentos' });
            return;
        }
        res.json({ agendamentos: results });
    });
});

app.listen(port, () => {
    console.log(`Servidor Node.js rodando em http://localhost:${port}`);
});
