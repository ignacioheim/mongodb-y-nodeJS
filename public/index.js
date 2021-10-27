const socket = io();

socket.on('productos', (productos)=>{
    //console.log(data);
    let startTable = `
    <table class="table table-striped table-dark" id="table">
    <thead>
        <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Imagen</th>
        </tr>
    </thead>
    `;
    let endTable = `
    </table>
    `;
    let html = productos.map((e,i)=>`
        <tbody>
            <tr>
                <td>${e.titulo}</td>
                <td>${e.precio}</td>
                <td><img src=${e.thumbnail} class="imgTable"></td>
            </tr>
        </tbody>
    `).join(' ');
    document.getElementById("table").innerHTML =`
    ${startTable}
    ${html}
    ${endTable}
    `;
});

socket.on('mensajes', (mensajesMongo)=>{
    let html = mensajesMongo.map((e,i)=>`
        <div>
            <b style="color:blue">${e.email}</b>
            <span style="color:brown">[${e.hora}]</span>
            <i style="color:green">${e.mensaje}</i>
        </div>
    `).join(' ')
    document.getElementById("chat").innerHTML =`
    ${html}
    `;
});



function envioMensaje(f) {
    let email = document.getElementById("email")
    let mensaje = document.getElementById("texto")
    socket.emit('nuevo', {email: email.value, mensaje: mensaje.value})
    mensaje.value = '';
    return false
};


    
