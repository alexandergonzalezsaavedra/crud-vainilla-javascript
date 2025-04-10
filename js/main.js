const modalAdd = document.querySelector('#addUserModal')
const modalAddUser = new bootstrap.Modal(document.querySelector('#addUserModal'))
const formCreateUser = document.querySelector("#createUser");
const togglePassword = document.querySelector('#togglePassword');
const iconVisibilityPass = document.querySelector('#visibilityPass');
const password = document.querySelector('#userPass');
const noData = document.querySelector("#noData")
const printListUsers = document.querySelector("#listUsers");
const template = document.querySelector("#templateUser");

let data = JSON.parse(localStorage.getItem("users")) || [];
let isEditing = false;
let currentEditId = null;

togglePassword.addEventListener('click', function () {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    iconVisibilityPass.textContent = iconVisibilityPass.textContent === 'visibility'
        ? 'visibility_off'
        : 'visibility';
});

modalAdd.addEventListener("click", (e) => {
    const btnCancelAdd = e.target.closest(".cancel-add")
    if (btnCancelAdd) {
        formCreateUser.reset();
        modalAddUser.hide()
    }
});

noData.addEventListener("click", (e) => {
    const btnDefaultUser = e.target.closest(".btn-default-user")
    if (btnDefaultUser) {
        addDefaultUsers()
    }
});

printListUsers.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-user");
    const deleteBtn = e.target.closest(".delete-user");
    if (editBtn) {
        editUser(editBtn.dataset.id);
    }
    if (deleteBtn) {
        deleteUser(deleteBtn.dataset.id);
    }
});

formCreateUser.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(formCreateUser);
    const userData = {
        userName: formData.get('userName').trim(),
        userDeparment: formData.get('userDeparment'),
        userPhone: formData.get('userPhone').trim(),
        userEmail: formData.get('userEmail').trim(),
        userPass: formData.get('userPass').trim(),
    };
    if (Object.values(userData).some(value => !value)) {
        alert('Todos los campos son obligatorios');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.userEmail)) {
        alert('Por favor ingrese un correo electrónico válido');
        return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(userData.userPass)) {
        alert('La contraseña debe contener:\n- Mínimo 8 caracteres\n- Al menos una mayúscula\n- Un número\n- Un carácter especial');
        return;
    }
    userData.userPhone = userData.userPhone.replace(/\D/g, '');
    if (userData.userPhone.length < 10) {
        alert('El teléfono debe tener al menos 10 dígitos');
        return;
    }
    if (isEditing) {
        const index = data.findIndex(user => user.id === currentEditId);
        if (index !== -1) {
            userData.id = currentEditId;
            data[index] = userData;
        }
        isEditing = false;
        currentEditId = null;
    } else {
        const dynamicId = `${userData.userName.toLowerCase().replace(/\s+/g, '_')}_${userData.userPhone.slice(-4)}_${Date.now().toString(36)}`;
        userData.id = dynamicId;
        data.push(userData);
    }
    saveLocalStorage();
    renderUsers();
    formCreateUser.reset();
    modalAddUser.hide()
});
const renderUsers = () => {
    if (data.length > 0) {
        noData.classList.add("d-none")
    } else {
        noData.classList.remove("d-none")
    }
    printListUsers.textContent = "";
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
        const clone = template.content.cloneNode(true);
        clone.querySelector(".userName").textContent = item.userName;
        clone.querySelector(".userEmail").textContent = item.userEmail;
        clone.querySelector(".userPhone").textContent = item.userPhone;
        clone.querySelector(".userDeparment").textContent = item.userDeparment;
        clone.querySelector(".btn-outline-dark").dataset.id = item.id;
        clone.querySelector(".btn-outline-danger").dataset.id = item.id;
        fragment.appendChild(clone);
    });
    printListUsers.appendChild(fragment);
};
const saveLocalStorage = () => {
    localStorage.setItem("users", JSON.stringify(data));
};
const deleteUser = (id) => {
    data = data.filter(item => item.id !== id);
    saveLocalStorage();
    renderUsers();
};
const editUser = (id) => {
    modalAddUser.show()
    const user = data.find(item => item.id === id);
    if (user) {
        formCreateUser.userName.value = user.userName;
        formCreateUser.userDeparment.value = user.userDeparment;
        formCreateUser.userPhone.value = user.userPhone;
        formCreateUser.userEmail.value = user.userEmail;
        formCreateUser.userPass.value = user.userPass;
        isEditing = true;
        currentEditId = id;
    }
};


const userDefault = [
    {
        "id": "alex111111",
        "userName": "Alexander González",
        "userDeparment": "Tecnología",
        "userPhone": "3156201269",
        "userEmail": "alexandergonzalezsaavedra@gmail.com",
        "userPass": "$#%Alex111111",
    },
    {
        "id": "hanna111111",
        "userName": "Hanna",
        "userDeparment": "Recursos humanos",
        "userPhone": "3156201269",
        "userEmail": "hanna@gmail.com",
        "userPass": "$#%Hanna111111",
    },
    {
        "id": "serj111111",
        "userName": "Serj Tankian",
        "userDeparment": "SOAD",
        "userPhone": "3156201269",
        "userEmail": "serj@soad.com",
        "userPass": "$#%Serj111111",
    },
    {
        "id": "daron111111",
        "userName": "Daron Malakian",
        "userDeparment": "SOAD",
        "userPhone": "3156201269",
        "userEmail": "daron@soad.com",
        "userPass": "$#%Daron111111",
    },
    {
        "id": "shavo111111",
        "userName": "Shavo Odadjian",
        "userDeparment": "SOAD",
        "userPhone": "3156201269",
        "userEmail": "shavo@soad.com",
        "userPass": "$#%Shavo111111",
    },
    {
        "id": "john111111",
        "userName": "John Dolmayan",
        "userDeparment": "SOAD",
        "userPhone": "3156201269",
        "userEmail": "john@soad.com",
        "userPass": "$#%John111111",
    },
]

const addDefaultUsers = () => {
    data = [...data, ...userDefault];
    saveLocalStorage();
    renderUsers();
}

renderUsers();
