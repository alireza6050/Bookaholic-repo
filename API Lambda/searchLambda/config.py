import boto3
import os

# Define AWS SSM parameter name
SSM_PARAMETER_NAME = "/openai/api-key"

# Create SSM client
ssm_client = boto3.client("ssm", region_name="us-east-2")

def get_openai_api_key():
    """Retrieve OpenAI API key from SSM Parameter Store with fallback to env variable. **Just for interview This is not running in the backend **"""
    try:
        response = ssm_client.get_parameter(Name=SSM_PARAMETER_NAME, WithDecryption=True)
        return response["Parameter"]["Value"]
    except Exception as e:
        print(f"Error fetching OpenAI API key: {str(e)}")
        return os.getenv("OPENAI_API_KEY")

# OpenAI API key
OPENAI_API_KEY = get_openai_api_key()

# OpenLibarry Search URL
OPENLIBRARY_API = "https://openlibrary.org/search.json"

# Number of books to fetch from OpenLiberary
# Number of workers to process the book descriptions. 
BOOK_COUNT = 7

