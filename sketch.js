var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var lastFed,now;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
  milk = loadImage("milkImage.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",readTime);
  
  dog=createSprite(800,200,150,150);
  dog.addImage("happy",happyDog);
  dog.addImage("sad",sadDog);
  dog.scale=0.15;

  milkSprite=createSprite(280,30,0,0);
  milkSprite.addImage(milk);
  milkSprite.scale=0.1;

  feedFood=createButton("Feed The Food");
  feedFood.position(690,95);
  feedFood.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  
  getTimeHour();

  if(now-lastFed > 5){
    dog.changeImage("sad");
  }
 
  fill("white")
  textSize(20);
  text("Last Fed: " + lastFed, 350, 30);

  fill("white")
  textSize(20);
  text(foodS, 300, 35);
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function readTime(data){
  lastFed=data.val();
}

function feedDog(){
  dog.changeImage("happy");

  if(foodS === 0){
    alert("No more milk is left");
  }

  if(foodS > 0){
    foodS--;
    getTimeHour();
    database.ref('/').update({
      FeedTime:now
    })
  }
  database.ref('/').update({
    Food:foodS
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

async function getTimeHour(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11,13);
  
  now = hour;
}