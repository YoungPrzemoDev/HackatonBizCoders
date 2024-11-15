from pydantic import BaseModel

class Interraction(BaseModel):
    userId: str
    projectId: str
    text:str
