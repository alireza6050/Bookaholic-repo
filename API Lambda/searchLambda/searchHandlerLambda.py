import json
import concurrent.futures
from config import OPENLIBRARY_API, BOOK_COUNT
from openai_util import classify_query, ask_clarifying_questions, summarize_book
from book_fetcher import fetch_books

def lambda_handler(event, context):
    try:
        # Preprocess the user query
        request_body = json.loads(event["body"])
        query = request_body.get("query", "").strip()
        
        # Classify and refine the query 
        gpt_action, gpt_result = classify_query(query)
        print(f"GPT Query Action: {gpt_action}, Result: {gpt_result}")
        
        
        # If gpt_action is _BOOK_ user is looking for a book, otherwise the respose is a normal chat or moderation message
        ###### Start Book Search #######
        if gpt_action == "_BOOK_":

            # Fetch the books from the library
            books = fetch_books(gpt_result)

            # If some books were found 
            if len(books) > 0:
                summaries = []

                # Creating threads
                with concurrent.futures.ThreadPoolExecutor(max_workers=BOOK_COUNT) as executor:
                    # assigning book summarization to the thread
                    future_to_book = {executor.submit(summarize_book, book): book for book in books}
                    try:
                        for future in concurrent.futures.as_completed(future_to_book, timeout=1):
                            
                                result = future.result(timeout=1)
                                if result:
                                    summaries.append(result)
                    except Exception as e:
                        book_title = future_to_book[future]['title']
                        print(f"Timeout: Skipping book summary for {book_title}")
                # Returning books summaries
                return {
                    "statusCode": 200,
                    "headers": {"Content-Type": "application/json"},
                    "body": json.dumps({"books": summaries})
                }
            # If no books were found so gpt asking clarifying questions (a normal chat)
            else:
                # Ask clarifying quesitons
                gpt_result = ask_clarifying_questions(query, gpt_result)
                print(f"Clarifying questions: {gpt_result}")

        ###### End Book Search #######
            

        # If users wants to just chat or content is moderated 
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"chat-response": gpt_result})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)})
        }