var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      
        // Cannot open database
      console.error(err.message)
      throw err

    } else {
        
        console.log('Connected to the SQLite database.')

        // Pages
        db.run(
            `CREATE TABLE pages (
                page_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text UNIQUE, 
                link text,
                background_image text, 
                show_in_menu INTEGER,
                CONSTRAINT title_unique UNIQUE (title)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Pages table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO pages (title,link,background_image,show_in_menu) VALUES (?,?,?,?)'
                db.run(insert, ["home","home","pictures/2.jpg",1])
                db.run(insert, ["test","test","pictures/1.jpg",1])
                db.run(insert, ["with space","with_space","pictures/3.jpg",0])
            }
        });

        // Contents
        db.run(
            `CREATE TABLE contents (
                content_id INTEGER PRIMARY KEY AUTOINCREMENT,
                page_id INTEGER, 
                type text,
                value text,
                CONSTRAINT content_id_unique UNIQUE (content_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Contents table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO contents (page_id,type,value) VALUES (?,?,?)'
                db.run(insert, [1,"html","<div><h3>hello im the test conent item</h3></div>"])
                db.run(insert, [2,"gallery",1])
            }
        });

        // Content Types
        db.run(
            `CREATE TABLE content_types (
                content_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
                type text,
                CONSTRAINT type_unique UNIQUE (type)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Content Types table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO content_types (type) VALUES (?)'
                db.run(insert, ["gallery"])
                db.run(insert, ["html"])
                db.run(insert, ["news"])
                db.run(insert, ["contact"])
                db.run(insert, ["home"])
                db.run(insert, ["crew"])
            }
        });

        // Galleries
        db.run(
            `CREATE TABLE galleries (
                gallery_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text,
                description text,
                CONSTRAINT gallery_id_unique UNIQUE (gallery_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Galleries table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO galleries (title,description) VALUES (?,?)'
                db.run(insert, ["general","General purpose gallery for testing"])
            }
        });

        // Gallery Items
        db.run(
            `CREATE TABLE gallery_items (
                gallery_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                type text,
                gallery_id INTEGER,
                filepath text, 
                title text,
                caption text,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT gallery_item_id_unique UNIQUE (gallery_item_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Gallery Items table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO gallery_items (type,gallery_id, filepath, title, caption) VALUES (?,?,?,?,?)'
                db.run(insert, ["picture",1,"pictures/1.jpg","test picture","lalalala caption"]);
                db.run(insert, ["picture",1,"pictures/2.jpg","test picture","lalalala caption"]);
                db.run(insert, ["picture",1,"pictures/3.jpg","test picture","lalalala caption"]);
                db.run(insert, ["picture",1,"pictures/4.jpg","test picture","lalalala caption"]);
                db.run(insert, ["picture",1,"pictures/5.jpg","test picture","lalalala caption"]);
                db.run(insert, ["video",1,"videos/1.mp4","test video","video video caption"]);
            }
        });

        // Messages
        db.run(
            `CREATE TABLE messages (
                msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                email text, 
                msg text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                read BOOLEAN,
                CONSTRAINT msg_id_unique UNIQUE (msg_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Messages table already created');
            } else {
                // Table just created, creating some rows
                console.log('Messages table created')
            }
        });

        // News
        db.run(
            `CREATE TABLE news (
                news_id INTEGER PRIMARY KEY AUTOINCREMENT,
                title text, 
                text text,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT news_id_unique UNIQUE (news_id)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('News table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO news (title, text) VALUES (?,?)'
                db.run(insert, ["first news item","the movie had won 10000 awards in every category wow how cool yeah woohoo"]);
            }
        });

        // Crew
        db.run(
            `CREATE TABLE crew (
                crew_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name text, 
                job text,
                picture text,
                about text,
                CONSTRAINT crew_id_unique UNIQUE (crew_id)
            )`
        ,
        (err) => {
            if (err) {
                
                // Table already created
                console.log('Crew table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO crew (name, job, picture, about) VALUES (?,?,?,?)'
                db.run(insert, ["Elisa Nelvand","Director","pictures/Elisa.jpg","elisa fucking nelband MOTHER FUCKING BIATCH N******AAAAA ****** and ****** BOOOM"]);
            }
        });

        // Users
        db.run(
            `CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username text, 
                email text UNIQUE, 
                password text,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt text,
                CONSTRAINT email_unique UNIQUE (email)
            )`
        ,
        (err) => {
            if (err) {
                // Table already created
                console.log('Users table already created');
            } else {
                // Table just created, creating some rows
                var insert = 'INSERT INTO users (username, email, password) VALUES (?,?,?)'
                db.run(insert, ["admin","admin@example.com","admin123456"])
                db.run(insert, ["user","user@example.com","user123456"])
            }
        });  
                
        
    }
});

module.exports = db

