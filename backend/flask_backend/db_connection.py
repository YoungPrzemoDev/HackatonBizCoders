import firebase_admin
import os
import dbSchema
from pymilvus import connections, Collection, MilvusException,utility,AnnSearchRequest,WeightedRanker
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from milvus_model.dense import JinaEmbeddingFunction
import pandas as pd
import re
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

# def getDataFromFirebase():
#     users = context.collection("users")
#     docs=users.stream()
#     print( [{**doc.to_dict(), 'id': doc.id} for doc in docs])

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
            "channels", "customerRelationships", "customerSegments","costStructure","revenueStreams"]
    projectCollection=context.collection("projects")
    projects=projectCollection.get()
    ids=[]
    tab=[]
    modelInfo=[]
    connectedString=""
    for p in projects:
        for i  in range(3):
            value = p.to_dict().get(fields[i]) 
            connectedString+=str(value)+" " 
        modelInfo.append(connectedString)        
        connectedString=""        

        for i in range(3,5):
            value = p.to_dict().get(fields[i]) 
            connectedString+=str(value)+" " 
        modelInfo.append(connectedString)        
        connectedString=""

        for i in range(5,7):
            value = p.to_dict().get(fields[i]) 
            connectedString+=str(value)+" " 
        modelInfo.append(connectedString)        
        connectedString=""
    
        for i in range(7,9):
            value = p.to_dict().get(fields[i]) 
            connectedString+=str(value)+" " 
        modelInfo.append(connectedString)        
        connectedString=""
        #print(modelInfo)
        value = p.id
        ids.append(value)
        
        tab.append(modelInfo.copy())
        modelInfo.clear()

        #print("-------------------------------------------------------------------------------")
    #prztworzenie 9kolumn  w 4 bo inaczej nie zaladuje do milvusa
    print(tab)    
    return tab,ids

#input array
def createEmbedding(texts):
    print("---------------EMBEDDED------------------------")
    embeddings=[]
    for i in texts:
        embeddings.append(ef(i)) #ef(texts) do stworzenia embeda
    # for i in range(len(embeddings)):
    #     for j in range(len(embeddings[i])):
    #         print(j," ",embeddings[i][j])
    #     print("#########################################")
    print(embeddings)
    return embeddings  #it returns [model1[0.....8],model2[0....8],...,modeln[0.....8]] macierz n wierszy na 9 kolumn 
def createSingleEmbedd(text):
    print("########single embede")
    embeddings=[]
    embeddings.append(ef(text))
    print(embeddings[0])
    return embeddings

def newCollection(inserted_rows,userId):
    dbSchema.createIndex(inserted_rows,userId)

def deleteCollection(userId):
    dbSchema.drop_collection(userId)

def insertData(ids,texts,embeddings,userId):
    print("-------Tworze dataframe--------------")
    data = {
        'idModel': ids,
        'value1': [text[0] for text in texts],
        'vector1': [embed[0] for embed in embeddings],
        'value2': [text[1] for text in texts],
        'vector2': [embed[1] for embed in embeddings],
        'value3': [text[2] for text in texts],
        'vector3': [embed[2] for embed in embeddings],
        'value4': [text[3] for text in texts],
        'vector4':  [embed[3] for embed in embeddings]
    }
    # Tworzymy DataFrame na podstawie słownika
    df = pd.DataFrame(data)
    print(df.head().T)
    try:
        collection = Collection(userId)      # Get an existing collection.
        collection.insert(df)
        collection.load()
    except MilvusException as e:
        print(e)


def returnIdForRecommendation(prompt,userId):
    embedPrompt=ef(prompt)
    print(embedPrompt)
    search_param_1 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vector1", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    search_param_2 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vector2", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    search_param_3 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vector3", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    search_param_4 = {
    "data": embedPrompt, # Query vector
    "anns_field": "vector4", # Vector field name
    "param": {
        "metric_type": "COSINE", # This parameter value must be identical to the one used in the collection schema
        "params": {"nprobe": 10}
    },
    "limit": 9 # Number of search results to return in this AnnSearchRequest
    }
    request_1 = AnnSearchRequest(**search_param_1)
    request_2 = AnnSearchRequest(**search_param_2)
    request_3 = AnnSearchRequest(**search_param_3)
    request_4 = AnnSearchRequest(**search_param_4)
    reqs = [request_1, request_2,request_3,request_4]
    rerank = WeightedRanker(0.4, 0.3,0.2,0.1) # wagi dla multi search
    collection = Collection(userId)
    res = collection.hybrid_search(
    reqs, # List of AnnSearchRequests created in step 1
    rerank, # Reranking strategy specified in step 2
    limit=9 # Number of final search results to return
    )
    ids=[]
    for r in res[0]:
        ids.append(r.id)
    print(ids)
    return ids