import os
import sys

print("Testing passlib and bcrypt")
try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    print(pwd_context.hash("12345"))
    print("Hash successful")
except Exception as e:
    print(f"Error: {e}")
