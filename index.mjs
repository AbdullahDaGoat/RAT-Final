import express from 'express';
import { promises as fs } from 'fs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 1000;
const contactsFile = 'contacts.json';

app.use(cors());
app.use(express.text({ type: '*/*' })); 

app.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(contactsFile, 'utf-8');
        res.json(JSON.parse(data || '[]')); 
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.post('/uploadcontacts', async (req, res) => {
    const rawContacts = req.body; 
    try {
        await fs.writeFile(contactsFile, rawContacts, { flag: 'a' });
        res.status(200).send('Data received and appended successfully');
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
