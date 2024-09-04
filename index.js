import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const db = new pg.Client({
  user:"postgres",
  host:"localhost" ,
  database:"world",
  password : "Ejc9c123",
  port : 5432
})
db.connect();






let users = [
  { id: 1, name: "Angela", color: "teal" },
  { id: 2, name: "Jack", color: "powderblue" },
];




let countries = [];
let messge= "add country name";
async function check(){
  countries = []
  const resalt = await db.query("SELECT country_code FROM visited_countries" );
resalt.rows.forEach((country) => { countries.push(country.country_code);});
}



app.get("/", async (req, res) => {
  const users_list  = await db.query("select * from users")
  users = users_list.rows;
  console.log(users_list);
  await check()
  res.render("index.ejs" , {countries : countries , total : countries.length , error:messge  , users:users})

});


app.post("/add" , async (req , res)=>{
  let input =  req.body.country;
  const respon = await db.query("SELECT country_code FROM countries WHERE country_name = $1" , [input])
  if(respon.rowCount === 0 ){
    messge = "worng country name";
    res.redirect("/") 
  }else{
      let all ="";
      let str_to_check ;
      const for_chicking_if_exisite = await db.query("SELECT country_code FROM visited_countries" )
      const country_to_check =  for_chicking_if_exisite.rows
      for (let index = 0; index < country_to_check.length; index++) {
        all += JSON.stringify(country_to_check[index])
      }
       str_to_check =  JSON.stringify(respon.rows[0].country_code)

      if(all.includes(str_to_check)){
        messge = "country alrady has been added";
        res.redirect("/") 
        }
        else{
          console.log()
          db.query("INSERT INTO visited_countries (country_code) VALUES($1) " , [respon.rows[0].country_code] )
        
        res.redirect("/")
  }
  }
})
    

    
  

 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
