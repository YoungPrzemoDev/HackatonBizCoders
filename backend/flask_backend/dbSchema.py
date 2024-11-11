from pymilvus import MilvusException, Collection, CollectionSchema, FieldSchema, DataType, utility
import numpy as np

def create_collection(name: str):
    id = FieldSchema(
        name="idModel",
        dtype=DataType.VARCHAR,#???????
        is_primary=True,
        max_length=1300
        #auto_id=True
    )

#keyPartners keyActivities keyResources
    value1 = FieldSchema(
        name="value1",
        dtype=DataType.VARCHAR,
        max_length=1300
    )
    vector1 = FieldSchema(
        name="vector1",
        dtype=DataType.FLOAT_VECTOR,
        dim=1024
    )
#valuePropositions channels
    value2 = FieldSchema(
        name="value2",
        dtype=DataType.VARCHAR,
        max_length=1300
    )
    vector2 = FieldSchema(
        name="vector2",
        dtype=DataType.FLOAT_VECTOR,
        dim=1024
    )
#customerRelationships customerSegments
    value3 = FieldSchema(
        name="value3",
        dtype=DataType.VARCHAR,
        max_length=1300
    )
    vector3 = FieldSchema(
        name="vector3",
        dtype=DataType.FLOAT_VECTOR,
        dim=1024
    )
#costStructure  revenueStreams
    value4 = FieldSchema(
        name="value4",
        dtype=DataType.VARCHAR,
        max_length=1300
    )
    vector4 = FieldSchema(
        name="vector4",
        dtype=DataType.FLOAT_VECTOR,
        dim=1024
    )


    schema = CollectionSchema(
        fields=[id, value1,vector1,
                value2,vector2,
                value3, vector3,
                value4,vector4],
        description="Test collection",
        enable_dynamic_field=True
    )
    new_collection = Collection(
        name=name,
        schema=schema,
        using='default',
        shards_num=4
    )
    return new_collection

def drop_collection(name: str):
    global inserted_rows_count
    exist = utility.has_collection(name)
    
    if(exist):
        try: 
            utility.drop_collection(name)
            str = "Collection: " + name + " successfully dropped"
            inserted_rows_count = 0
            return str
        except MilvusException as e:
            print(e)
            return 1
    else:
        return "Collection doesnt exists"
    
def createIndex(inserted_rows,name):
    collection=create_collection(name)
    nlist = 4 * int(np.round(np.sqrt(inserted_rows)))
    index_params = {
        "index_type": "IVF_FLAT",
        "metric_type": "COSINE",
        "params": {
            "nlist": nlist
        }
    }
    
    try:
        indexes = utility.list_indexes(
        collection_name=name
        )
        if(len(indexes) > 0):
            print("Droping previous index...")
            collection.release()
            collection.drop_index()
        print(f"Creating index to collection: {collection.name}...")
        collection.create_index(field_name="vector1",index_params=index_params,index_name="SimpleIndex1")
        collection.create_index(field_name="vector2",index_params=index_params,index_name="SimpleIndex2")
        collection.create_index(field_name="vector3",index_params=index_params,index_name="SimpleIndex3")
        collection.create_index(field_name="vector4",index_params=index_params,index_name="SimpleIndex4")
        print("Succesfull")
    except MilvusException as e:
        print(e)