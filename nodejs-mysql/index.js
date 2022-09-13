const express = require('express');

// import the mysql driver package.
const mysql = require('mysql');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 1337;

// MySQL Connection Configuration
const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: 'test@1234',
  database: 'mydb',
};

// Create a connection driver
const connetion = mysql.createConnection(connectionConfig);

// Connect to the MySQL Server
connetion.connect((err) => {
  if (err) {
    console.log('ERROR:: ' + err);
    return;
  }

  console.log(`✅ database connection successful!`);
});

app.get('/ping', (_, res) => {
  return res.json({ status: 'ok', message: 'pong' });
});

const server = app.listen(PORT, () =>
  console.log(`🚀 server running on ${PORT}`)
);

// Performing the various CRUD Operations
// TODO App example.

// Create the table todo.
connetion.query(
  'CREATE TABLE IF NOT EXISTS todo(id int AUTO_INCREMENT, note VARCHAR(255), PRIMARY KEY(id))',
  (err) => {
    if (err) {
      console.log('Error::Failed to crate table todo. ' + err);
    }

    console.log(`✅ table todo created!`);
  }
);

// 1. Create a record.
app.post('/create', async (req, res) => {
  const { note } = req.body;

  // Construct the Query String.
  const sql = 'INSERT INTO todo (note) VALUES (?)';

  try {
    connetion.query(sql, [note], (err) => {
      if (err) {
        console.log('ERROR:: Failed to insert into database. ' + err);
        return res.status(400).json({ message: err.message });
      }

      return res.status(201).json({
        status: 'ok',
        message: 'Record Created!',
      });
    });
  } catch (err) {
    console.log('ERROR:: ' + err);
    res.status(500).send();
  }
});

// 2. Read a record
app.get('/read', async (_, res) => {
  // Construct the Query String.
  const sql = 'SELECT * FROM todo;';

  try {
    connetion.query(sql, (err, results) => {
      if (err) {
        console.log('ERROR:: Failed to insert into database. ' + err);
        res.status(400).json({ message: err.message });
        return;
      }

      return res.status(201).json({
        status: 'ok',
        message: 'Todos Found!',
        data: results,
      });
    });
  } catch (err) {
    console.log('ERROR:: ' + err);
    res.status(500).send();
  }
});

// 3. Update a record
app.patch('/update/:id', async (req, res) => {
  const { note } = req.body;
  const { id } = req.params;

  const sql = 'UPDATE todo SET note = ? WHERE id = ?;';

  try {
    connetion.query(sql, [note, id], (err) => {
      if (err) {
        console.log('ERROR:: Failed to update database. ' + err);
        return res.status(400).json({ message: err.message });
      }

      return res.status(201).json({
        status: 'ok',
        message: 'Todo Updated!',
      });
    });
  } catch (err) {
    console.log('ERROR:: ' + err);
    res.status(500).send();
  }
});

// 4. Delete a record
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM todo WHERE id = ?;';

  try {
    connetion.query(sql, [id], (err, results) => {
      if (err) {
        console.log('ERROR:: Failed to update database. ' + err);
        return res.status(400).json({ message: err.message });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: 'Todo Not Found!',
        });
      }

      return res.status(201).json({
        status: 'ok',
        message: 'Todo Deleted!',
      });
    });
  } catch (err) {
    console.log('ERROR:: ' + err);
    res.status(500).send();
  }
});

process.on('SIGTERM', () => {
  // Safely end the connection to the MySQL Database.
  connetion.end();

  // Shutdown the server.
  server.close();
});
