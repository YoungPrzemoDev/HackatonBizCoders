import db_connection 
import uvicorn
from fastapi import FastAPI


TESTID="5"


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

@app.get("/recommendation")
def get_recommendation():
    user=db_connection.getUserById(TESTID)
    info=db_connection.getScientistInfo(user)
    print("----------------------------------------------")
    
    #db_connection.createEmbedding(db_connection.getAllBusinessModels())
    #db_connection.newCollection("USER"+TESTID)
    
    #db_connection.deleteCollection("USER"+TESTID)
    ###-------------------------
    db_connection.newCollection(9,"USER"+TESTID)
    texts,ids=db_connection.getAllBusinessModels()
    embeddings=db_connection.createEmbedding(texts)
    print("ids",len(ids))
    print("texts",len(texts[0]))
    print("embeddings",len(embeddings[0]))
    db_connection.insertData(ids,texts,embeddings,"USER"+TESTID)
    #---------------------------------------------------
    recommendation=db_connection.returnIdForRecommendation(str(info),"USER"+TESTID)
    #tablice trzeba zwrocic do fronta
    return {"recommendation": str(info)}

