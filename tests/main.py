from development_sign_up import test_development_sign_up
from sign_in import test_sign_in

def main():
    print("=== API Test Menu ===")
    print("1. Development Sign Up Tests")
    print("2. Sign In Tests")
    choice = input("Choose an option: ")

    if choice == "1":
        test_development_sign_up()
    elif choice == "2":
        test_sign_in()
    else:
        print("Invalid choice!")

if __name__ == "__main__":
    main()
