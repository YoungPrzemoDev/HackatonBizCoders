import db_connection 
import uvicorn
from fastapi import FastAPI
from typing import List
from models import Interraction
import dbSchemaUser
#TESTID="5"


app = FastAPI()

async def initialize_db():
    db_connection.initialize_firebase()
    db_connection.initializeJina()
    #db_connection.getDataFromFirebase()
    global db_milvus
    db_milvus=db_connection.connect()

@app.on_event("startup")
async def startup():
    await initialize_db()

@app.get("/recommendation",response_model=List[str])
async def get_recommendation(userId):
    # user=db_connection.getUserById(userId)
    # info=db_connection.getScientistInfo(user)

    db_connection.newCollection(9,"USER"+userId)
    texts,ids=db_connection.getAllBusinessModels()
    embeddings=db_connection.createEmbedding(texts)
    print("ids",len(ids))
    print("texts",len(texts[0]))
    print("embeddings",len(embeddings[0]))
    db_connection.insertData(ids,texts,embeddings,"USER"+userId)
    #---------------------------------------------------
    recommendation=db_connection.returnIdForRecommendation(dbSchemaUser.findVectorById(userId),"USER"+userId)




    #tablice trzeba zwrocic do fronta
    return recommendation

@app.post("/userInteraction/")
async def changeUserVector(interraction: Interraction):
    print(dbSchemaUser.findAboutById("5"))
    print(dbSchemaUser.findVectorById("5"))
    return {"OK"}

@app.post("/about/{userId}")
async def embedding(userId):

    #stworzenie embedingu dla usera na podstawie danych about 
    if not dbSchemaUser.checkCollection("UserPreferences"):
        collection= dbSchemaUser.createUserCollection()
        dbSchemaUser.createUserIndex(collection)
        user=db_connection.getUserById(userId)
        info=db_connection.getScientistInfo(user)
        embeddings=db_connection.createSingleEmbedd(info)
        dbSchemaUser.insertData(userId,info,embeddings)
    else:
        user=db_connection.getUserById(userId)
        info=db_connection.getScientistInfo(user)
        embeddings=db_connection.createSingleEmbedd(info)
        dbSchemaUser.insertData(userId,info,embeddings)
    return {"UserOk": userId}