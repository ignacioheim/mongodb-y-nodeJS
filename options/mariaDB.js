const mysql = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'login_node'
    }
}

console.log('Conectando a la base de datos MariaDB');

export default mysql
