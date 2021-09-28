const socket = io();

// socket.on('productos', (data)=>{
//     console.log(data);
//     let html = data.map((e,i)=>`
//         <div>
//             <strong>${e.title}</strong>
//             <em>${e.price}</em>
//         </div>
//     `).join(' ');
//     document.getElementById("list").innerHTML = html;
// });  

socket.on('productos', (data)=>{
    //console.log(data);
    let ul = document.getElementsByTagName('ul')[0];
    ul.innerHTML = '';
    for (item of data) {
        
        let ul = document.getElementsByTagName('ul')[0];
        let li = document.createElement('li');
        ul.appendChild(li);
        li.innerHTML = `Nombre: ${item.title} - Precio: ${item.price} - <img src=${item.thumbnail} class="imgTable">`;
        // li.innerHTML = `
        // <table class="table table-striped table-dark">
        // <thead>
        //     <tr>
        //         <th scope="col">Nombre</th>
        //         <th scope="col">Precio</th>
        //         <th scope="col">Imagen</th>
        //     </tr>
        // </thead>
        // <tbody>
        //         <tr>
        //             <td>${item.title}</td>
        //             <td>${item.price}</td>
        //             <td><img src=${item.thumbnail} class="imgTable"></td>
        //         </tr>
        // </tbody>
        // </table>  
        // `
    }
});  
    
