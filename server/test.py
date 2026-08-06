from core.security import create_access_token

token = create_access_token(
    {
        "sub": "s@example.com"
    }
)

print(token)