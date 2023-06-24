const express=require("express");
const bodyparser=require("body-parser");
const date=require(__dirname+"/date.js");
const mongoose=require("mongoose");
const _=require("lodash");

const app=express();
app.set('view engine','ejs');

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb+srv://himanshu:Himanshu7520@cluster0.5ezkzmf.mongodb.net/todolistDB");

const itemSchema=new mongoose.Schema({
    name:String,
    date:String,
});

const listSchema={
    name:String,
    items:[itemSchema],
    date:String
};

const List=mongoose.model("List",listSchema);
const Item=mongoose.model('Item',itemSchema);
    
app.get("/",function(req,res){

    List.find({})
    .then(function(foundList){ 
        const day=date.getDate();
        res.render('home',{listTitle:day,list:foundList});
    })
    .catch(function(err){
        console.log(err);
    })
    
})

app.post("/",function(req,res){
    const listTitle=_.capitalize(req.body.listTitle);

    List.findOne({name:listTitle})
    .then(function(foundList){
        if(!foundList)
        {
            const day=date.getDate();
            const newList=new List({
                name:listTitle,
                items:[],
                date:day
            });
            newList.save();
        }
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err)
    })
})

app.post("/deletelist",function(req,res){
    const id=req.body.listId;

    //delete its items
    List.findOne({_id:id})
    .then(function(foundList){
        foundList.items.forEach(function(item)
        {
            Item.deleteOne({_id:item._id})
            .then(function(){})
            .catch(function(err){
                console.log(err);
            })
        })
    })
    .catch(function(err){
        console.log(err);
    })
    List.deleteOne({_id:id})
    .then(function(){
        console.log("List deleted successfully");
        res.redirect("/");
    })
    .catch(function(err){
        console.log(err);
    })
})


app.post("/delete",function(req,res){
    const id=req.body.itemId;
    const listTitle=req.body.listTitle;

    List.findOneAndUpdate({name:listTitle},{$pull:{items:{_id:id}}})
    .then(function(foundList){
        //delete from item 
        Item.deleteOne({_id:id})
        .then(function(){
            console.log("Deleted Successfully");
        })
        .catch(function(err){
            console.log(err);
        })
        res.redirect("/"+listTitle);
    })
    .catch(function(err){
        console.log(err);
    })
    
})

//dynamic routes
app.get("/:listTitle",function(req,res){
    const listTitle=_.capitalize(req.params.listTitle);

    List.findOne({name:listTitle})
    .then(function(list){
        if(!list)
        {
            const day=date.getDate();
            const list=new List({
                name:listTitle,
                items:[],
                date:day
            })
            list.save();
            res.render('list',{listTitle:listTitle,itemList:list.items,action:"/"+listTitle});
        }
        else
        {
           console.log("List already exists"); 
           res.render('list',{listTitle:listTitle,itemList:list.items,action:"/"+listTitle});
        }
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post("/:listTitle",function(req,res){
    const listTitle=req.params.listTitle;
    const task=req.body.task;
    const day=date.getDate();
    const newItem=new Item({
        name:task,
        date:day
    });
    newItem.save();

    List.findOne({name:listTitle})
    .then(function(foundList){
        foundList.items.push(newItem);
        foundList.save();
        console.log("Item pushed successfully");
    })
    .catch(function(err){
        console.log(err);
    })
    res.redirect("/"+listTitle);
})


app.listen(3000,function(){
    console.log("server is running on port 3000");
})
