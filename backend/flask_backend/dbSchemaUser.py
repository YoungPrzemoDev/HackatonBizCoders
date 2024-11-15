from pymilvus import MilvusException, Collection, CollectionSchema, FieldSchema, DataType, utility
import numpy as np
import pandas as pd
def createUserCollection():
    id = FieldSchema(
        name="idUser",
        dtype=DataType.VARCHAR,#???????
        is_primary=True,
        max_length=2500
        #auto_id=True
    )
    about= FieldSchema(
        name="about",
        dtype=DataType.VARCHAR,
        max_length=1300
    )
    vector = FieldSchema(
        name="vector",
        dtype=DataType.FLOAT_VECTOR,
        dim=1024
    )
    schema = CollectionSchema(
        fields=[id, about,vector],
        description="UserPreferences",
        enable_dynamic_field=True
    )
    new_collection = Collection(
        name='UserPreferences',
        schema=schema,
        using='default',
        shards_num=4
    )
    return new_collection

def createUserIndex(collection):
    nlist = 4 
    index_params = {
        "index_type": "IVF_FLAT",
        "metric_type": "COSINE",
        "params": {
            "nlist": nlist
        }
    }
    
    try:
        indexes = utility.list_indexes(
        collection_name="UserPreferences"
        )
        if(len(indexes) > 0):
            print("Droping previous index...")
            collection.release()
            collection.drop_index()
        print(f"Creating index to collection: {collection.name}...")
        collection.create_index(field_name="vector",index_params=index_params,index_name="UserIndex")
        print("Succesfull")
    except MilvusException as e:
        print(e)

def checkCollection(name):
    if not utility.has_collection(name):
        return False
    else:
        return True
    
def getCollection():
    return Collection("UserPreferences")

def insertData(id,info,emmbeding):
    print("-------Tworze dataframe--------------")
    data = {
        'idUser': id,
        'about': info,
        'vector':  emmbeding[0]
    }
    df = pd.DataFrame(data)
    print(df.head().T)
    try:
        collection = Collection("UserPreferences")      # Get an existing collection.
        collection.insert(df)
        collection.load()
    except MilvusException as e:
        print(e)


def findAboutById(id):
    collection=Collection("UserPreferences")
    results = collection.query(
    expr=f'idUser == "{id}"',    # Adjust this field name if needed
    output_fields=["about"]  # Specify the fields you want to retrieve
    )
    about_texts = [result['about'] for result in results]
    return about_texts[0]

def findVectorById(id):
    collection=Collection("UserPreferences")
    results = collection.query(
    expr=f'idUser == "{id}"',    # Adjust this field name if needed
    output_fields=["vector"]  # Specify the fields you want to retrieve
    )
    vector_texts = [result['vector'] for result in results]
    return vector_texts[0]