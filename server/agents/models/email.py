from pydantic import BaseModel


class EmailOutput(BaseModel):
    subject: str
    body: str