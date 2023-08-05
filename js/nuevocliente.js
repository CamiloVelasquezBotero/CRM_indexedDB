(function() {

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        
        formulario.addEventListener('submit', validarCliente);
    })

    function validarCliente(e) {
        e.preventDefault();

        // Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            // Se le pasa el mensaje y otro string para la clase de css
            imprimirAlerta('Todos los campos son obligatorios', 'error'); 
            return;
        }

        // Creamos el objeto de cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now() // los usamos como id unico ya que no hya una base de datos real
        }

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite'); // Instanciamos la transaction
        const objectStore = transaction.objectStore('crm'); // Instanciamos el objectStore de la transaction

        objectStore.add(cliente); // Le agreamos el cliente al objectStore

        transaction.onerror = function() {
            imprimirAlerta('Hubo un error al agregar', 'error');
        }
        transaction.oncomplete = function() {
            imprimirAlerta('El cliente se agrego correctamente');

            setTimeout( () => {
                window.location.href = "index.html"; // Despues de 3 segundos nos lleva a los clientes
            }, 3000);
        }
    }
})();