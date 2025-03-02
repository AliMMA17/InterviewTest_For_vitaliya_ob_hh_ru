const express = require('express');
const { sequelize, User } = require('./models');

const app = express();
app.use(express.json());

app.post('/update-balance', async (req, res) => {
    const { userId, amount } = req.body;
    if (!userId || typeof amount !== 'number') { return res.status(400).json({ error: 'Invalid input' }); }
    let transaction;
    //const transaction = await sequelize.transaction();
    try {
        transaction = await sequelize.transaction();
        const user = await User.findByPk(userId, { lock: transaction.LOCK.UPDATE, transaction });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.balance + amount < 0) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        // Update balance
        user.balance += amount;
        await user.save({ transaction });
        // Commit the transaction
        await transaction.commit();
        return res.json({ success: true, balance: user.balance });
    } catch (error) {
        if (transaction) { await transaction.rollback(); }
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, async () => {
    await sequelize.sync();
    console.log(`Server is running on port ${port}`);
});