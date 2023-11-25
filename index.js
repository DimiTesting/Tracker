import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres", 
  host: "localhost", 
  database: "",
  password: "",
  port: 5432
})

db.connect()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const today = await db.query("SELECT * FROM today ORDER BY id ASC")
    const todayItems = today.rows;

    const week = await db.query("SELECT * FROM week ORDER BY id ASC")
    const weekItems = week.rows;

    const month = await db.query("SELECT * FROM month ORDER BY id ASC")
    const monthItems = month.rows


    res.render("index.ejs", {
      listTitle: "Today",
      listItems: todayItems, 
      weekTitle: "This week",
      weekItems: weekItems,
      monthTitle: "This month",
      monthItems: monthItems
    })
      
  } catch (err) {
    console.log(err)
  }
});


app.post("/add", async(req, res) => {
  const todayItem = req.body.newItemForToday;
  const weekItem = req.body.newItemForWeek;
  const monthItem = req.body.newItemForMonth;

  if (todayItem && weekItem===undefined && monthItem===undefined) {
    try {
      await db.query("INSERT INTO today (title) VALUES ($1)", [todayItem])
      res.redirect("/");
    } catch (err) {
        console.log(err)
    }
  } else if (todayItem===undefined && weekItem && monthItem===undefined ){
      try {
        await db.query("INSERT INTO week (title) VALUES ($1)", [weekItem])
        res.redirect("/");
      } catch (err) {
          console.log(err)
      }
  } else {
      try {
        await db.query("INSERT INTO month (title) VALUES ($1)", [monthItem])
        res.redirect("/");
      } catch (err) {
          console.log(err)
      }
  }


});

app.post("/edit", async(req, res) => {
  const todayItem = req.body.todayItemTitle;
  const todayId = req.body.todayItemId;
  const weekItem = req.body.weekItemTitle;
  const weekId = req.body.weekItemId;
  const monthItem = req.body.monthItemTitle;
  const monthId = req.body.monthItemId;

  if (todayItem && weekItem===undefined && monthItem===undefined) {
    try {
      await db.query(`UPDATE today SET title = '${todayItem}' WHERE id = ${todayId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
    }
  } else if (todayItem===undefined && weekItem && monthItem===undefined){
    try {
      await db.query(`UPDATE week SET title = '${weekItem}' WHERE id = ${weekId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
    }
  } else {
    try {
      await db.query(`UPDATE month SET title = '${monthItem}' WHERE id = ${monthId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
    }
  }


});

app.post("/delete", async(req, res) => {
  const todayId = req.body.deleteTodayItemId
  const weekId = req.body.deleteWeekItemId
  const monthId = req.body.deleteMonthItemId

  if (todayId && weekId===undefined && monthId===undefined) {
    try {
      await db.query(`DELETE FROM today WHERE id = ${todayId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
    }
  } else if (todayId===undefined && weekId && monthId===undefined){
    try {
      await db.query(`DELETE FROM week WHERE id = ${weekId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
    } 
  } else {
    try {
      await db.query(`DELETE FROM month WHERE id = ${monthId};`)
        res.redirect("/");
    } catch (err) {
        console.log(err)
  }

}});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
