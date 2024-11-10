import firebase_admin
from pymilvus import connections, Collection, MilvusException,utility
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import os
from milvus_model.dense import JinaEmbeddingFunction
load_dotenv()



def initialize_firebase():
    cred = credentials.Certificate("serviceAccountKey.json")  # Ścieżka do pliku klucza
    firebase_admin.initialize_app(cred)
    print("Polaczenie z baza Firebase.......")
    global context
    context= firestore.client()

#laczenie z baza 
def connect():
    connections.connect(host="192.168.56.1", port="19530")
    try:
        print("Connecting to Vector database ..........")
        # List all collections
        collections = utility.list_collections()
        print(f"List all collections from Vector:\n", collections)
    except MilvusException as e:
        print(e)
def initializeJina():
    global ef
    ef = JinaEmbeddingFunction(
        "jina-embeddings-v3", 
        os.getenv("jina_api_key"),
        task="text-matching",
        dimensions=1024
    )
    print("......init JINA")

def getDataFromFirebase():
    users = context.collection("users")
    docs=users.stream()
    print( [{**doc.to_dict(), 'id': doc.id} for doc in docs])

def getUserById(id):
    user = context.collection("users").document(id)
    doc=user.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return None

def getScientistInfo(user):
    about="about"
    tags="tags"
    info=""
    info+=user.get(about)+" "
    tab=user.get(tags)
    for i in tab:
        info+=i+", "
    info=info[:-2]+"."
    return info

def getAllBusinessModels():
    fields=["keyPartners","keyActivities","keyResources","valuePropositions",
            "customerRelationships", "channels", "customerSegments","costStructure","revenueStreams"]
    projectCollection=context.collection("projects")
    projects=projectCollection.get()
    tab=[]
    modelInfo=[]
    for p in projects:
        for i in fields:
            value = p.to_dict().get(i) 
            if value:  
                modelInfo.append(value)
        print(modelInfo)
        tab.append(str(modelInfo.copy()))
        modelInfo.clear()
        #print(tab)
        print("-------------------------------------------------------------------------------")
    return tab

#input array
def createEmbedding(texts):
    print("---------------EMBEDDED------------------------")
    embeddings=ef(texts)
    for i in range(len(embeddings)):
        print(i," ",embeddings)
        print("#########################################")
    return embeddings  #it returns [model1[0.....8],model2[0....8],...,modeln[0.....8]] macierz n wierszy na 9 kolumn 