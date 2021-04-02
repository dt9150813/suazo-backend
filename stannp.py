import sys
import requests
import json

print("# start stannp")
data = json.loads(sys.argv[1])
filePath = sys.argv[2]
maildata = {"file": "https://suazo-backend.herokuapp.com/coo/downlaod/n13JX6KUJVWTrb78OkCvIIXp71G2",
            "recipient[firstname]": data["ownerList"][data["primaryOwnerIndex"]]["firstName"],
            "recipient[lastname]": data["ownerList"][data["primaryOwnerIndex"]]["lastName"],
            "recipient[address1]": data["ownerList"][data["primaryOwnerIndex"]]["street"],
            # "recipient[address2]": "APT317",
            "recipient[town]": data["ownerList"][data["primaryOwnerIndex"]]["city"],
            "recipient[state]": data["ownerList"][data["primaryOwnerIndex"]]["state"],
            "recipient[zipcode]": data["ownerList"][data["primaryOwnerIndex"]]["zipcode"],
            "recipient[country]": "USA",
            "transactional": "true",
            # "template": "111666",
            "duplex": "False",
            }
response = requests.post(
    "https://us.stannp.com/api/v1/letters/create?api_key=55a74d67d7452effed4d8ff4", data=maildata)
# print(response.json()['success'])
print(response.json())
print("# stannp done")