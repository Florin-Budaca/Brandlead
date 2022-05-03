import "bootstrap";
import axios from "axios";
import "../css/app.scss";

axios.defaults.withCredentials = true;

function getEmployees() {
    window.document.getElementById("list-employees").innerHTML = "";

    axios
        .get("http://localhost/api/employees")
        .then((response) => {
            response.data.forEach((employee) => {
                displayEmployee(employee.name, employee.id);
            });
        })
        .catch((error) => {
            console.log(error);
            window.location = "/login.html";
        });
}


function editEmployee (employeeId) {
    let employeeName = window.document.getElementById(
        `employee-name-${employeeId}`
    ).value;

    axios.put(`http://localhost/api/employees/${employeeId}`, {
        name: employeeName,
    });
};

function deleteEmployee (employeeId) {
    axios.delete(`http://localhost/api/employees/${employeeId}`).then((response) => {
        window.document.getElementById(`employee-${employeeId}`).remove();
    });
};

function move (employeeId, type) {
    let employeeElement = window.document.getElementById(`employee-${employeeId}`);

    axios
        .put(`http://localhost/api/employees/${employeeId}/position-${type}`)
        .then((response) => {
            getEmployees();
        });
}

function displayEmployee(employeeName, employeeId) {
    let response = getEmployeeElement(employeeId, employeeName);

    window.document.getElementById("list-employees").appendChild(response.employeeElement);

    response.btnEdit.onclick = () => editEmployee(employeeId);
    response.btnDelete.onclick = () => deleteEmployee(employeeId);
    response.moveUp.onclick = () => move(employeeId, 'up');
    response.moveDown.onclick = () => move(employeeId, 'down');
}

function getEmployeeElement(employeeId, employeeName) {
    let employeeElement = document.createElement('div');
    employeeElement.className = 'list-group-item list-group-item-action py-3';
    employeeElement.id = `employee-${employeeId}`;

    let row = document.createElement('div');
    row.className = 'row';
    employeeElement.appendChild(row);

    let colFormGroup = document.createElement('div');
    colFormGroup.className = 'col';
    row.appendChild(colFormGroup);

    let formGroup = document.createElement('div');
    formGroup.className = 'form-group';
    colFormGroup.appendChild(formGroup);

    let input = document.createElement('input');
    input.className = 'form-control form-control-lg';
    input.id = `employee-name-${employeeId}`;
    input.value = employeeName;
    formGroup.appendChild(input);

    let colButtons = document.createElement('div');
    colButtons.className = 'col-auto my-auto';
    row.appendChild(colButtons);

    let buttonsDisplay = document.createElement('div');
    buttonsDisplay.className = 'd-flex';
    colButtons.appendChild(buttonsDisplay);

    let btnEdit = document.createElement('div');
    btnEdit.className = 'p-1 cursor-pointer border';
    btnEdit.innerHTML = '<i class="fa fa-save fa-lg px-2 py-3 text-primary"></i>';
    buttonsDisplay.appendChild(btnEdit);

    let btnDelete = document.createElement('div');
    btnDelete.className = 'p-1 cursor-pointer border';
    btnDelete.innerHTML = '<i class="fa fa-trash-can fa-lg px-2 py-3 text-danger"></i>';
    buttonsDisplay.appendChild(btnDelete);

    let moveUp = document.createElement('div');
    moveUp.className = 'p-1 cursor-pointer border';
    moveUp.innerHTML = '<i class="fa fa-caret-up fa-lg px-2 py-3 text-secondary"></i>';
    buttonsDisplay.appendChild(moveUp);

    let moveDown = document.createElement('div');
    moveDown.className = 'p-1 cursor-pointer border';
    moveDown.innerHTML = '<i class="fa fa-caret-down fa-lg px-2 py-3 text-secondary"></i>';
    buttonsDisplay.appendChild(moveDown);

    return {
        employeeElement: employeeElement,
        btnEdit: btnEdit,
        btnDelete: btnDelete,
        moveUp: moveUp,
        moveDown: moveDown,
    };
}

function addEmployee() {
    let employeeName = window.document.getElementById("employee-name").value;

    axios
        .post("http://localhost/api/employees", {
            name: employeeName,
        })
        .then((response) => {
            displayEmployee(employeeName, response.data.id);
            window.document.getElementById("employee-name").value = "";

        })
        .catch((error) => {
            console.log(error);
        });
};

window.document.getElementById("btn-add-employee")
    .addEventListener("click", () => addEmployee(), false);
getEmployees();