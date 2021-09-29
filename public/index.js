const socket = io();

socket.on('productos', (data)=>{
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
    let html = data.map((e,i)=>`
        <tbody>
            <tr>
                <td>${e.title}</td>
                <td>${e.price}</td>
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

socket.on('mensajes', (data)=>{
    render(data);
});


let render = (data) => {
    let today = new Date();
    let hora = today.toLocaleTimeString();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
        } 
    if(mm<10) {
        mm='0'+mm;
    } 
    let html = data.map((e,i)=>`
        <div>
            <b style="color:blue">${e.email}</b>
            <span style="color:brown">[${dd+'/'+mm+'/'+yyyy} ${hora}]</span>
            <i style="color:green">${e.mensaje}</i>
        </div>
    `).join(' ');
    document.getElementById("chat").innerHTML = html;
}


function envioMensaje(f) {
    let email = document.getElementById("email")
    let mensaje = document.getElementById("texto")
    socket.emit('nuevo', {email: email.value, mensaje: mensaje.value})
    mensaje.value = '';
    return false
};


    
