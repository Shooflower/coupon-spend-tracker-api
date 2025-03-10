import express from "express"
import {createServer} from "node:http"
import * as service from "./services/database.service"
import cors from "cors"

const app = express()
const server = createServer(app)
const port = 5678

const corsWhitelist = ["http://localhost:5173", "https://couponspendtracker.netlify.app"]

// Required for parsing request.body as json
app.use(express.json())

// Allows pre-flight requests and sets cors allow-origin header to any for all OPTIONS reqs
app.options("*", cors())

// For all requests, check to see if the requesting server is whitelisted
app.all("*", (request, response, next) => {
    console.log(request.body)

    // Get origin and set response header
    const origin = request.headers.origin
    response.header("Access-Control-Allow-Origin", origin)

    // Check if origin is allowed to use service
    if(corsWhitelist.includes(origin)) {
        next()
    } else {
        console.error(`Origin ${origin} not allowed to make calls to this API`)
        response.status(500)
        response.send({result: "Sorry, your server cannot use this API"})
    }
})

// TODO: retrieve stores from db
app.get("/store", (request, response) => {
    response.send({result: ["CVS", "Walgreens", "Publix", "Target", "Walmart", "Winn-Dixie"]})
})

app.post("/addexpense", (request, response) => {
        
    const expenseObj = request.body
    service.addExpense(expenseObj)
        .then(() => {
            response.status(200)
            response.send({result: "Expense successfully added!"})
        })
        .catch(error => {
            response.status(500)
            response.send({result: `There was an error trying to add a new expense: ${error}`})
        })

    
})

// Get all expenses
app.get("/expense", (request, response) => {
    service.getAllExpenses()
        .then(expenses => {
            console.log(expenses)
            response.status(200)
            response.send({result: expenses})
        })
        .catch(error => {
            response.status(500)
            response.send({result: `There was an error trying to fetch expenses: ${error}`})
        })
})

// Delete expense
app.delete("/expense/:id", (request, response) => {
    const {id} = request.params
    service.deleteExpense(id)
    .then((result) => {
        console.log(`DB Server Response: ${result}`)
        response.status(200)
        response.send({result: `Successfully removed expense ${id}`})
    })
    .catch(error => {
        response.status(500)
        response.send({result: `There was an error trying to delete expense with id ${id}: ${error}`})
    })
})

server.listen(port, () => console.log(`Server listening at ${port}`))