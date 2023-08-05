(function() {

    let idCliente;
    // Inputs
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {

        // Nos coenctamos primero a la DB
        conectarDB();

        // Actualiza el registro:
        formulario.addEventListener('submit', actualizarCliente);

        //Verificar ID de la URL:
        const parametrosURL = new URLSearchParams(window.location.search); // Buscamos parametros que hayan en la url
        idCliente = parametrosURL.get('id'); // Obtenemos el parametro con el target id

        if (idCliente) {
             /*
                Programacion asincrona, ya que se demora para conectarse a la base de datos, para que no marque error y le de tiempo de conectarse
                Y de esta manera no nos marque ( DB is undefined )
              */
            setTimeout( () => { 
                obtenerCliente(idCliente);
            }, 100); // Espera 1s para que le de tiempo de conectarse a la DB
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return; 
          } 

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente)
        };

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        // Esto actualizara la DB mediante el (id) ya que pusimos el id como (keypath: 'id')
        objectStore.put(clienteActualizado); 

        transaction.oncomplete = function() {
            imprimirAlerta('Editado correctamente');

            setTimeout( () => {
                window.location.href = 'index.html';
            }, 3000);
        }
        transaction.onerror = function(error) {
            console.log(error);
            imprimirAlerta('Error al editar', 'error');
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly'); // Accedemos a la DB de la transaccion con el permiso de soloLectura
        const objectStore = transaction.objectStore('crm'); // Accedemos al objectStore del transaction

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                if(cursor.value.id === Number(id)) {
                    llenarFomulario(cursor.value); // le pasamos el valor actual a la funcion para rellenar lso inputs del form
                }
                cursor.continue(); // Seguimos para que el cursor vaya iterando
            }
        }
    }

    function llenarFomulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente; // Destructuring a los datos del cliente

        nombreInput.value = nombre; // Agregamos cada valor a los inputs
        emailInput.value = email;
        telefonoInput.value = telefono;
        empresaInput.value = empresa;
    }

})();