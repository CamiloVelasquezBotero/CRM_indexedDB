let DB;

function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);

    abrirConexion.onerror = function(){
        console.log('Hubo un error al conectar a la DB');
    }
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result;
    }
}

function imprimirAlerta(mensaje, tipo) {
    const alerta = document.querySelector('.alerta');

    if (!alerta) {
        const divMensaje = document.createElement('div');
        // Se le agregan clases de Tailwind
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta'); 

        if (tipo === 'error') {
            // Volvemos el mensaje tipo error ccon las clases de Tailwind
            divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700'); 
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700'); 
        }

        divMensaje.textContent = mensaje; // Le agregamos el mensaje al div

        formulario.appendChild(divMensaje); // Agregamos el div al formulario

        setTimeout( () => { // Despues de 3 segundos se eliminara el mensaje
            divMensaje.remove();
        }, 3000);
    }
}