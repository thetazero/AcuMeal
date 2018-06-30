const admin = require("firebase-admin");
const fs = require('fs')

var serviceAccount = require("acumeal-c8f89-firebase-adminsdk-cvzvv-55a5470d0d");
var recipe = [];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://acumeal-c8f89.firebaseio.com"
});

var db = admin.firestore();


db.collection('recipe').get().then((snapshot) => {
    snapshot.forEach((doc) => {
        let carbs;
        if (doc.data().Carbohydrates == null)
            carbs = "28.1";
        else
            carbs = doc.data().Carbohydrates.replace("g", "");
        let index = recipe.push({
            name: doc.id,
            calories: doc.data().Calories.slice(0, doc.data().Calories.length - 4),
            carbs: carbs,
            cookTime: doc.data()["Cooking Time"].slice(0, doc.data()["Cooking Time"].length - 3),
            ingredients: doc.data().Ingredients
        })
        console.log(index)
        /*
        console.log(doc.data().Calories);
        console.log(doc.data().Carbohydrates);
        console.log(doc.data()["Cooking Time"]);
        console.log(doc.data().Ingredients);*/
    })

    fs.writeFile('save.json', JSON.stringify(recipe), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    console.log(recipe[0])
}).catch((err) => {
    console.log('Error getting documents', err);
})