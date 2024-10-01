import express from 'express';
import { promises as fs } from 'fs';  // Using promises from the fs module
import cors from 'cors';  // To allow all origins

const app = express();
const PORT = process.env.PORT || 3000;

// Store contact data in contacts.json
const contactsFile = 'contacts.json';

// Allow all origins (to prevent CORS issues)
app.use(cors());

// Parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Serve HTML page displaying raw contact data
app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');

        // HTML page with inline CSS to display raw data
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Uploaded Contacts</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        background-color: #f4f4f9;
                    }
                    h1 {
                        text-align: center;
                        color: #333;
                    }
                    pre {
                        background-color: #eee;
                        padding: 15px;
                        border-radius: 5px;
                        max-width: 100%;
                        overflow: auto;
                    }
                </style>
            </head>
            <body>
                <h1>Uploaded Contacts</h1>
                <pre>${JSON.stringify(contacts, null, 2)}</pre> <!-- Display raw JSON -->
            </body>
            </html>`;

        res.send(htmlContent);
    } catch (err) {
        console.error('Error reading contacts file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to receive contact data (no validation, accept raw data)
app.post('/uploadcontacts', async (req, res) => {
    const contact = req.body;  // No validation, accept everything as-is

    try {
        // Read existing contacts, add new contact
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');
        contacts.push(contact);  // Add new contact to the list

        // Write updated contacts back to the file
        await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2));
        res.status(200).send('Contact uploaded successfully');
    } catch (err) {
        console.error('Error writing to contacts file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
