const Sequelize = require('sequelize');
const config = require('./config.json');
const db = require('./models')(Sequelize, config);
let films = require('./data/films.json');
const actors = require('./data/actors.json');
const filmsActors = require('./data/filmsActors.json');

db.sequelize.addHook('beforeBulkCreate', () => {
    console.log('beforeCreate');
});
db.sequelize.addHook('afterBulkCreate', () => {
    console.log('afterCreate');
});
Work();

async function Work(){
    await db.sequelize.sync({force: true});

    //1. validation fields
    /*
    await db.films.create({
        title: 'some name',
        rating: -1337,
        year: 1900,
        budget: -159,
        gross: 0,
        poster: 'no'
    });*/

    //2. insert 3 films in package
    await db.films.bulkCreate(films.slice(0,3));

    //3. package update
    await db.films.bulkCreate(films.slice(3));
    await db.actors.bulkCreate(actors);

    await db.actors.update({
        liked: 22
    },
    {
        where:{
            films: { [Sequelize.Op.gt]: 200 }
        }    
    })
    
    //4. delete actors where liked = 0;
    await db.actors.destroy({
        where: {
            liked: 0
        }
    });

    //5. get film with all actors in one query
    let film = await db.films.findById(3, {
        include: [{
            model: db.actors,
            as: 'Actors'
        }]
    });
    film.Actors.forEach((actor) => {
        console.log(actor.name);
    })

    //6. scope for films after 2007
    console.log('films after 2007');
    let films2007 = db.films.scope('newFilms');
    films = await films2007.findAll();
    films.forEach((film) => {
        console.log(film.title);
    })

    //8. transaction
    console.log('transaction');
    await db.sequelize.transaction().then((tran) => {
        return db.actors.update({
            liked: 0
        }, 
        {
            transaction: tran,
            where: {}
        }).then(() => {
            console.log('wait 10 sec...');
            setTimeout(function () {
                console.log("commit");
                //return tran.rollback();
                return tran.commit();
            }, 10000);
        });
    });
}






/*  //  await db.actorfilms.bulkCreate([
  //      {actorId: 1, filmId: 1},
  //      {actorId: 1, filmId: 2},    
  //      {actorId: 1, filmId: 3},
  //      {actorId: 3, filmId: 3}     
  //  ]); */