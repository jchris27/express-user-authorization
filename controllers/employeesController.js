// MODEL-VIEW-CONTROLLER (MVC) PATTERN
// create to store data
const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data) { this.employees = data }
};

// get the data from the database
data.employees = require('../model/employees.json');

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createNewEmployee = (req, res) => {
    // create a new object
    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1, // increment id by 1 or default to 1
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    // send a response error if requirements are missing
    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ 'message': 'First and last name are required.' });
    };

    data.setEmployees([...data.employees, newEmployee]); // deconstruct the array and insert the newly created object
    res.status(201).json(data.employees); // 201 means success in creating a new employee
};

const updateEmployee = (req, res) => {
    // find an employee by id
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    // if no employee found send an error
    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found.` });
    };

    // update the data
    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    // remove/filter the old data from the original array
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // insert the new data
    const unsortedArray = [...filteredArray, employee];

    data.setEmployees(unsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.employees);
};

const deleteEmployee = (req, res) => {
    // find an employee by id
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id));

    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.body.id} not found.` });
    };

    // filter the array
    const filteredArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    data.setEmployees([...filteredArray]);
    res.json(data.employees);
};

const getEmployee = (req, res) => {
    // Use req.params.id to get the id from the URL not req.body.id
    const employee = data.employees.find(emp => emp.id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found.` });
    };

    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
};