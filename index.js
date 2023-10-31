const express = require('express');
const jsonfile = require('jsonfile');
const app = express();
const { v4: uuidv4 } = require('uuid'); // Import the v4 function from uuid
const port = 3000;
const dataFile = 'storybookDb/storybookDb.json';
const cors = require('cors'); // Import the 'cors' middleware

app.use(cors({ origin: '*' }));

console.log(dataFile)
// Middleware to parse JSON request bodies
app.use(express.json());

// Define a route to get data from the JSON database
app.get('/', (req, res) => {
    res.send("Live...")
});

// Define a route to get data from the JSON database
app.get('/storybook/:storyId', (req, res) => {
  jsonfile.readFile(dataFile, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    const stories = JSON.stringify(data);
    console.log(stories)
    let returnStory = {error: "No story was found..."};
    data.stories.find(story => {
        console.log(story, req.params.storyId)
        if(story.storyId === req.params.storyId) {
            returnStory = story;
        }
    })
    res.json(returnStory);
  });
});

// Define a route to update data in the JSON database
app.post('/createBook', (req, res) => {
    const newBookData = req.body;
    console.log("heyooo")
  
    jsonfile.readFile(dataFile, (err, data) => {
        console.log(dataFile)
        // const newData = data.

        const newUuid = uuidv4(); // Generate a new UUID using v4 function
        const newStory = {
            title: newBookData.title,
            storyId: newUuid
        }

        data.stories.push(newStory)
      
        jsonfile.writeFile(dataFile, data, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({ message: 'Data updated successfully' });
      });
    });
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
