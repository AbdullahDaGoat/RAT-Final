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
    console.log("Received contact:", req.body);  // Log the raw body to debug

    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        let contacts = JSON.parse(data || '[]');

        contacts.push(req.body); // Add new contact

        await fs.writeFile(contactsFile, JSON.stringify(contacts, null, 2));
        
        console.log('Contact uploaded successfully');
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
