import requests
import uuid
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def generate_unique_user():
    unique_id = uuid.uuid4().hex[:6]
    return {
        "email": f"user_{unique_id}@example.com",
        "username": f"user_{unique_id}",
        "password": "TestPassword123",
        "passwordConfirmation": "TestPassword123",
    }

def test_development_sign_up():
    url = "https://localhost:7000/api/Auth/development-sign-up"
    headers = {"Content-Type": "application/json"}

    # Definiowanie scenariuszy
    scenarios = [
        {
            "name": "Correct Data",
            "payload": generate_unique_user() | {"agreedToTermsOfService": True},
            "expected_status": 200,
        },
        {
            "name": "Missing email",
            "payload": {
                "username": "testuser",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "TestPassword123"},
                "agreedToTermsOfService": True,
            },
            "expected_status": 400,
        },
        {
            "name": "Invalid email format",
            "payload": {
                "email": "invalidemail",
                "username": "testuser",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "TestPassword123"},
                "agreedToTermsOfService": True,
            },
            "expected_status": 400,
        },
        {
            "name": "Missing username",
            "payload": {
                "email": "test@example.com",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "TestPassword123"},
                "agreedToTermsOfService": True,
            },
            "expected_status": 400,
        },
        {
            "name": "Passwords do not match",
            "payload": {
                "email": "test@example.com",
                "username": "testuser",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "WrongPassword"},
                "agreedToTermsOfService": True,
            },
            "expected_status": 400,
        },
        {
            "name": "Password too short",
            "payload": {
                "email": "test@example.com",
                "username": "testuser",
                "passwords": {"password": "short", "passwordConfirmation": "short"},
                "agreedToTermsOfService": True,
            },
            "expected_status": 400,
        },
        {
            "name": "Terms not agreed",
            "payload": generate_unique_user() | {"agreedToTermsOfService": False},
            "expected_status": 400,
        },
        {
            "name": "Duplicate email",
            "payload": {
                "email": "duplicate@example.com",
                "username": "user_duplicate",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "TestPassword123"},
                "agreedToTermsOfService": True,
            },
            "setup": lambda: requests.post(url, json={
                "email": "duplicate@example.com",
                "username": "user_duplicate",
                "passwords": {"password": "TestPassword123", "passwordConfirmation": "TestPassword123"},
                "agreedToTermsOfService": True,
            }, headers=headers, verify=False),
            "expected_status": 400,
        },
    ]

    for scenario in scenarios:
        print(f"\n=== Test: {scenario['name']} ===")

        if "setup" in scenario:
            scenario["setup"]()

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
