import * as mongodb from "mongodb"
import "dotenv/config.js"
import { ExpenseEntry } from "../types/types"

// DATABASE
const {CONNECTION_STRING, DATABASE, COLLECTION} = process.env
if(typeof CONNECTION_STRING === 'undefined') {
    throw new Error("No connection string specified")
}
if(typeof DATABASE === 'undefined') {
    throw new Error("No database specified")
} 
if(typeof COLLECTION === 'undefined') {
    throw new Error("No collection specified")
}
const client: mongodb.MongoClient = new mongodb.MongoClient(CONNECTION_STRING)

export async function connectToDatabase() {
    // Connect to database
    await client.connect()
    const db = client.db(DATABASE)
    // const collection = db.collection(COLLECTION)
    
    // const databasesList = await db.admin().listDatabases()
    
    // console.log("Databases:")
    // databasesList.databases.forEach(db => console.log(` - ${db.name}`))

    console.log(`Successfully connected to ${db.databaseName}`)

    return db

}

export async function closeConnection() {
    try{
        await client.close()
        console.log(`Successfully closed connection to ${DATABASE}`)
    } catch(error) {
        console.error("Could not close client!", error)
    }
}

export async function getCollection() {
    try{
        const collection = (await connectToDatabase()).collection(COLLECTION || "")
        return collection
    
    } catch(error) {
        console.error(error)
    }

}

export async function addExpense(expense:ExpenseEntry) {
    const expenseObj = {
        expenseType: expense.expenseType,
        store: expense.store,
        amount: expense.amount,
        tax: expense.tax,
        total: expense.total,
        purchaseDate: expense.purchaseDate
    }

    try{
        const collection = await getCollection()
        return collection.insertOne(expenseObj)
    } catch(error) {
        throw new Error(`Error while inserting document: ${error}`)
    }
}

export async function getAllExpenses() {
    try {
        const collection = await getCollection()
        const results = await collection.find()

        const expenses = []

        for await (const expense of results) {
            expenses.push(expense)
        }

        return expenses
    } catch(error) {
        throw new Error(`Error while fetching all documents: ${error}`)
    }
}