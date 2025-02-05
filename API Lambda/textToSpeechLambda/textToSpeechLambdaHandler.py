import json
import base64
import os
import tempfile
import openai
import io
import boto3

# Secure API Key Retrieval from AWS SSM Parameter Store
def get_openai_api_key():
    """Retrieve OpenAI API key securely from AWS SSM Parameter Store *** for interview *** """
    ssm_client = boto3.client("ssm", region_name="us-east-2") 
    response = ssm_client.get_parameter(Name="/openai/api-key", WithDecryption=True)
    return response["Parameter"]["Value"]

# Set API key once
openai.api_key = get_openai_api_key()

def lambda_handler(event, context):

    try:
        #parse Json request
        base64_transcription = event["body"]
        

        # Restrict max file size (5MB)
        if len(base64_transcription) > 5 * 1024 * 1024:
            return {
                "statusCode": 413,
                "body": json.dumps({"error": "Audio file too large. Max 5MB allowed."})
            }

        decoded_audio = base64.b64decode(base64_transcription)
        file = io.BytesIO(decoded_audio)
        file.name = "recorded-audio.webm"

        # Call openai API
        transcription = openai.audio.transcriptions.create(
            model="whisper-1", 
            file=file
        )

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"transcription": transcription.text})
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON format. Ensure request body is JSON."})
        }

    except openai.OpenAIError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"OpenAI API error: {str(e)}"})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": f"Unexpected error: {str(e)}"})
        }

