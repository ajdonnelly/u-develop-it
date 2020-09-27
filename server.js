//import inputCheck NPM module
const inputCheck = require('./utils/inputCheck');

const express = require('express');

//variable declaration importing databse.js
const db = require('./db/database');

const PORT = process.env.PORT || 3001;
const app = express();

//variable declaration importing all our routes from the apiRoutes folder-will automatically pick up index.js
const apiRoutes = require('./routes/apiRoutes');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.
app.use('/api', apiRoutes);

//Express route to page
// app.get('/', (req, res) => {
//     res.json({
//       message: 'Hello World'
//     });
//   });

  // Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
  });

// Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
