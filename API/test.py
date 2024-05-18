import requests
from flask import jsonify
import json


URL = "http://127.0.0.1:5000/"
response = requests.get(URL)
# response = requests.post(URL, json={"name":"G Farm","location":"Zaria", "user_id":"1"})
# response = requests.post(URL, json={"name":"Abba",'email':"abba@mail.com","role":"Contractor","password":"123dser45","lga":"Samaru","state":"Kaduna"})

print(response.json())

