import sys
import requests
import json

# print("# start stannp")
data = json.loads(sys.argv[1])
filePath = sys.argv[2]
maildata = {
            "test": "1",
            "file": filePath.replace("../tmp/", "https://suazo-backend.herokuapp.com/file/"),
            "recipient[firstname]": data["ownerList"][data["primaryOwnerIndex"]]["firstName"],
            "recipient[lastname]": data["ownerList"][data["primaryOwnerIndex"]]["lastName"],
            "recipient[address1]": data["ownerList"][data["primaryOwnerIndex"]]["street"],
            # "recipient[address2]": "",
            "recipient[town]": data["ownerList"][data["primaryOwnerIndex"]]["city"],
            "recipient[state]": data["ownerList"][data["primaryOwnerIndex"]]["state"],
            "recipient[zipcode]": data["ownerList"][data["primaryOwnerIndex"]]["zipcode"],
            "recipient[country]": "USA",
            "transactional": "true",
            "duplex": "False",
            }
response = requests.post(
    "https://us.stannp.com/api/v1/letters/create?api_key=55a74d67d7452effed4d8ff4", data=maildata)
if "error" in response.json():
    print(response.json()['error'], file=sys.stderr)
print(response.json()['success'])
# print("# stannp done")