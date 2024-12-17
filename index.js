const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize('employee_mng', 'root', 'harinirajanT@og7', {
    host: 'Employee',
    dialect: 'mysql',
    logging: console.log, 
});


const Employee = sequelize.define('employees', { 
    employee_id: { type: DataTypes.STRING(10), unique: true, allowNull: false },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), unique: true, allowNull: false },
    phone_number: { type: DataTypes.STRING(10), allowNull: false },
    department: { type: DataTypes.STRING(50), allowNull: false },
    date_of_joining: { type: DataTypes.DATE, allowNull: false },
    role: { type: DataTypes.STRING(50), allowNull: false },
}, {
    timestamps: false,
});

sequelize.sync({ alter: true }).then(() => {
    console.log("Database & tables created!");
}).catch((err) => {
    console.error("Error creating database or tables:", err);
});


app.post('/employees', async (req, res) => {
    try {
        const { employee_id, email } = req.body;

        const existingEmployee = await Employee.findOne({
            where: {
                [Sequelize.Op.or]: [{ employee_id }, { email }],
            },
        });

        if (existingEmployee) {
            return res.status(400).json({ error: 'Employee ID or Email already exists.' });
        }

        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
