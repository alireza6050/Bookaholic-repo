import requests
from config import OPENLIBRARY_API, BOOK_COUNT

def fetch_books(query):
    """
    Fetch books from OpenLibrary with optimized parameters.
    
    args: 
        query (str): refined query by chatgpt.

    returns:
        (list): list of books fetched from the API. 
    
    """
    
    params = {
        "q": query,
        "limit": BOOK_COUNT, # Number rof books to be fetched
        "fields": "title,author_name",
    }
    # Calling API with given params
    response = requests.get(OPENLIBRARY_API, params=params)

    try:
        data = response.json()

        books = data.get("docs", [])
        if not isinstance(books, list):
            books = []

        return books
    except json.JSONDecodeError:
        return []