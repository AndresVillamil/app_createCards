const formCrear = document.getElementById("formCrear");
const formEditar = document.getElementById("formEditar");
const contenedor = document.getElementById("contenedor");

const erroresCrear = document.getElementById("erroresCrear");
const erroresEditar = document.getElementById("erroresEditar");

const modal = new bootstrap.Modal(document.getElementById("modalEditar"));

document.addEventListener("DOMContentLoaded", cargarEmpleados);

async function cargarEmpleados() {
    const res = await fetch("/api/empleados");
    const empleados = await res.json();

    contenedor.innerHTML = "";

    empleados.forEach(emp => {
        const col = document.createElement("div");
        col.classList.add("col-md-4");

        const card = document.createElement("div");
        card.classList.add("card", "shadow-sm", "mb-3");

        const body = document.createElement("div");
        body.classList.add("card-body");

        body.innerHTML = `
            <h5>${emp.nombre}</h5>
            <p><strong>Cargo:</strong> ${emp.cargo}</p>
            <p><strong>Departamento:</strong> ${emp.departamento}</p>
            <p><strong>Salario:</strong> $${emp.salario}</p>
            <p><strong>Ingreso:</strong> ${(emp.fecha_ingreso || "").toString().split("T")[0]
            }</p>
        `;

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-warning", "btn-sm", "me-2");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => abrirModal(emp));

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger", "btn-sm");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => eliminarEmpleado(emp.id));

        body.appendChild(btnEditar);
        body.appendChild(btnEliminar);

        card.appendChild(body);
        col.appendChild(card);
        contenedor.appendChild(col);
    });
}

// 🔹 Crear
formCrear.addEventListener("submit", async (e) => {
    e.preventDefault();
    erroresCrear.innerHTML = "";

    const empleado = obtenerDatosCrear();

    const res = await fetch("/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado)
    });

    const data = await res.json();

    if (!res.ok) {
        if (data.errores) {
            mostrarErrores(data.errores, erroresCrear);
        } else {
            erroresCrear.innerHTML = `<p class="text-danger">${data.error}</p>`;
        }
        return;
    }


    formCrear.reset();
    cargarEmpleados();
});

// 🔹 Abrir Modal
function abrirModal(emp) {
    document.getElementById("edit_id").value = emp.id;
    document.getElementById("edit_nombre").value = emp.nombre;
    document.getElementById("edit_fecha_nacimiento").value = emp.fecha_nacimiento.split("T")[0];
    document.getElementById("edit_fecha_ingreso").value = emp.fecha_ingreso.split("T")[0];
    document.getElementById("edit_salario").value = emp.salario;
    document.getElementById("edit_cargo").value = emp.cargo;
    document.getElementById("edit_departamento").value = emp.departamento;

    erroresEditar.innerHTML = "";
    modal.show();
}

// 🔹 Actualizar
formEditar.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit_id").value;

    const empleado = {
        nombre: document.getElementById("edit_nombre").value,
        fecha_nacimiento: document.getElementById("edit_fecha_nacimiento").value,
        fecha_ingreso: document.getElementById("edit_fecha_ingreso").value,
        salario: document.getElementById("edit_salario").value,
        cargo: document.getElementById("edit_cargo").value,
        departamento: document.getElementById("edit_departamento").value
    };

    const res = await fetch(`/api/empleados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleado)
    });

    const data = await res.json();

    if (!res.ok) {
        if (data.errores) {
            mostrarErrores(data.errores, erroresCrear);
        } else {
            erroresCrear.innerHTML = `<p class="text-danger">${data.error}</p>`;
        }
        return;
    }


    modal.hide();
    cargarEmpleados();
});

// 🔹 Eliminar
async function eliminarEmpleado(id) {
    if (!confirm("¿Eliminar empleado?")) return;

    await fetch(`/api/empleados/${id}`, {
        method: "DELETE"
    });

    cargarEmpleados();
}

function obtenerDatosCrear() {
    return {
        nombre: document.getElementById("nombre").value,
        fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
        fecha_ingreso: document.getElementById("fecha_ingreso").value,
        salario: document.getElementById("salario").value,
        cargo: document.getElementById("cargo").value,
        departamento: document.getElementById("departamento").value
    };
}

function mostrarErrores(errores, contenedor) {
    contenedor.innerHTML = "";

    errores.forEach(err => {
        const p = document.createElement("p");
        p.classList.add("text-danger");
        p.textContent = err.msg;
        contenedor.appendChild(p);
    });
}
