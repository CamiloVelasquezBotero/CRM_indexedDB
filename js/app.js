(function() {

    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('crm', 1)) { // Condicional en caso de que existan datos en la DB 
            obtenerClientes();
        }

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente); // instanciamos el id que esta establecido en el data-cliente

            const confirmar = confirm('Deseas eliminar este cliente?'); // Ventana emergente para confirmar (confirm) enviara true o false
            console.log(confirmar);

            if(confirmar) { // Si el usuario le dio aceptar entonces marcara true
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');

                objectStore.delete(idEliminar); // El keyPath esta en ('id') asiq eu le pasamos el id a eliminar

                transaction.oncomplete = function() {
                    console.log('Eliminado...');

                    e.target.parentElement.parentElement.remove(); // Traversing the DOM para eliminar el 2 padre y actualizar el listado
                }
                transaction.onerror = function() {
                    console.log('Hubo un error');
                }
            }

        }
    }

    function crearDB() {

        // Se crea la base de datos en version 1.0
        const crearDB = window.indexedDB.open('crm', 1);

        crearDB.onerror = function() { // En caso de error
            console.log('Hubo un error al crear la DB')
        }
        crearDB.onsuccess = function() {
            DB = crearDB.result;
        }
        crearDB.onupgradeneeded = function(e) {
            const db = e.target.result; // Se obtiene el resultado del evento

            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true }); //  Se le da la configuracion

            objectStore.createIndex('nombre', 'nombre', {unique: false}); // Se le coloca false por que pueden haber dos nombres iguales
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista');
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('Hubo un error al abrir la conexion');
        }
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result; // Le damos el resultado e la conexion a la variable global DB

            const objectStore = DB.transaction('crm').objectStore('crm'); // Instanciamos el valor de la transaccion del objectStore

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result; // el evento que mande al abrir el cursor, instanciamos el resultado

                if(cursor) {
                    const {nombre, email, telefono, empresa, id} = cursor.value;

                    listadoClientes.innerHTML += ` 
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `
                    cursor.continue(); // Para que vaya iterando ya que cursor itera dinamicamente
                } else {
                    console.log('No hay mas registros');
                }
            }
        }
    }

})(); // Esto es un IIFE, Es una funcion que se llama automaticamente