const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MongoDB Atlas Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

  const menuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: [0.01, 'Price must be greater than 0'] 
    }});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

app.delete('/menu/:id', async (req, res) => {
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted', item: deletedItem });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.put('/menu/:id', async (req, res) => {
    const { name, description, price } = req.body;
    if (price <= 0) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { name, description, price },
            { new: true, runValidators: true }
        );
        if (!updatedItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item updated', item: updatedItem });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});