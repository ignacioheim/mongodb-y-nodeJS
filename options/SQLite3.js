const sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: './db/mydb.sqlite'
    },
    useNullAsDefault: true
};

console.log('Conectado a la base de datos SQLite3');

export default sqlite3 