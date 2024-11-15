from pydantic import BaseModel

class Interraction(BaseModel):
    projectID: str
    userId: str
    