import db_connection 
import uvicorn
from fastapi import FastAPI


TESTID="7"


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
    
    db_connection.createEmbedding(db_connection.getAllBusinessModels())
    return {"recommendation": str(info)}

