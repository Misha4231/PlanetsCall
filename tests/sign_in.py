import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def test_sign_in():
    url = "https://localhost:7000/api/Auth/sign-in"
    headers = {"Content-Type": "application/json-patch+json"}

    scenarios = [
        {
            "name": "Correct Credentials",
            "payload": {"uniqueIdentifier": "Miszus", "password": "Miszus"},
            "expected_status": 200,
        },
        {
            "name": "Incorrect Password",
            "payload": {"uniqueIdentifier": "Miszus", "password": "WrongPassword"},
            "expected_status": 401,
        },
        {
            "name": "Non-existent User",
            "payload": {"uniqueIdentifier": "NonExistentUser", "password": "SomePassword"},
            "expected_status": 401,
        },
        {
            "name": "Missing Password",
            "payload": {"uniqueIdentifier": "Miszus"},
            "expected_status": 400,
        },
        {
            "name": "Missing Unique Identifier",
            "payload": {"password": "Miszus"},
            "expected_status": 400,
        },
        {
            "name": "Empty Payload",
            "payload": {},
            "expected_status": 400,
        },
    ]

    for scenario in scenarios:
        print(f"\n=== Test: {scenario['name']} ===")
        try:
            response = requests.post(url, json=scenario["payload"], headers=headers, verify=False)
            print(f"Status Code: {response.status_code}")

            if response.status_code == scenario["expected_status"]:
                print("Test Passed")
                try:
                    response_data = response.json()
                    if scenario["expected_status"] == 200:
                        if "accessToken" in response_data:
                            print("Response Data Valid: Access Token received.")
                        else:
                            print("Response Data Invalid: Missing accessToken.")
                    else:
                        if "message" in response_data:
                            print(f"Error Message: {response_data['message']}")
                        else:
                            print("Response Data Invalid: Missing error details.")
                except ValueError:
                    print("Response Data Invalid: Unable to parse JSON.")
            else:
                print(f"Test Failed: Expected {scenario['expected_status']}, got {response.status_code}")
                print(f"Response: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"Test Failed: Request exception - {e}")
