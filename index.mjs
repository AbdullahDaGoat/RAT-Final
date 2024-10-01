import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const contactsFile = 'contacts.json';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve HTML page displaying raw contact data
app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');
        res.json(contacts);
    } catch (err) {
        console.error('Error reading contacts file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to receive contact data
app.post('/uploadcontacts', async (req, res) => {
    const contacts = req.body; // This will now be an array of contacts

    console.log("Received contacts batch:", JSON.stringify(contacts, null, 2));

    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        let existingContacts = JSON.parse(data || '[]');

        // Add the new batch of contacts
        existingContacts = existingContacts.concat(contacts);

        await fs.writeFile(contactsFile, JSON.stringify(existingContacts, null, 2));
        
        console.log('Batch uploaded successfully');
        res.status(200).send('Batch uploaded successfully');
    } catch (err) {
        console.error('Error writing to contacts file:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

