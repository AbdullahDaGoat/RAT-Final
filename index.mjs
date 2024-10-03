import express from 'express';
import { promises as fs } from 'fs';  // Using promises from the fs module
const app = express();
const PORT = process.env.PORT || 3000;

// Store contact data in contacts.json
const contactsFile = 'contacts.json';

app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing form data

// Serve HTML page
app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');

        // HTML page with inline CSS
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
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Uploaded Contacts</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>`;

        contacts.forEach(contact => {
            htmlContent += `
                        <tr>
                            <td>${contact.name || 'N/A'}</td>
                            <td>${contact.phone || 'N/A'}</td>
                            <td>${contact.email || 'N/A'}</td>
                            <td>${contact.address || 'N/A'}</td>
                        </tr>`;
        });

        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>`;
        
        res.send(htmlContent);
    } catch (err) {
        console.error('Error reading contacts file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to receive contact data
app.post('/uploadcontacts', async (req, res) => {
    const contact = req.body;

    if (!contact.name || (!contact.phone && !contact.email && !contact.address)) {
        return res.status(400).send('Invalid contact data.');
    }

    try {
        // Read existing contacts, add new contact
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');
        contacts.push(contact);

        // Write updated contacts back to file
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
