const createSchema = (db) => {
    db.select('*').from('users')
    .then(d => { 
        console.log('db schema exists: nothing to initialize');
        process.exit(0);
    })
    .catch(error => { 
        db.schema.createTable('users', function (table) {
            table.increments('id').primary(),
            table.string('firstname', 100),
            table.text('email').unique().notNullable(),
            table.bigint('entries').defaultTo(0),
            table.timestamp('joined').notNullable()
        })
        .then( (data) => {
            if (process.env.APP_DEBUG) {
                console.log('db response : ', data);
            }
        })
        .catch( (err) => {
            console.log('db schema has not initialized');
            if (process.env.APP_DEBUG) {
                console.log('db response : ', err);
                process.exit(1);
            }
        });
        db.schema.createTable('login', function (table) {
            table.increments('id').primary(),
            table.string('hash', 100),
            table.text('email').unique().notNullable()
        })
        .then( (data) => {
            console.log('db schema has created succesfully');
            if (process.env.APP_DEBUG) {
                console.log('db response : ', data);
            }
            process.exit(1);
        })
        .catch( (err) => {
            console.log('db schema has not initialized');
            if (process.env.APP_DEBUG) {
                console.log('db response : ', err);
            }
            process.exit(1);
        });
    });
};

module.exports = {
    createSchema
};