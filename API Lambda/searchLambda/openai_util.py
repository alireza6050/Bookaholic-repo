import openai
from prompts import get_query_classification_prompt, get_query_clarification_prompt, get_book_summary_prompt
from config import OPENAI_API_KEY
openai.api_key = OPENAI_KEY

def classify_query(query):
    """
        Determine if GPT user wants to chat or searches for books search query. If GPT thinks user wants a book, returns 
        a string starting with _BOOK_# and refined query. If user wants to chat, reutrns _CHAT_# and response to the chat

        args:
            query(str): raw query from user
        returns:
            (str): refined query or chat reponse
    """
    #Getting the prompt
    messages = get_query_classification_prompt(query)

    #Call gpt api
    gpt_response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.1,
    ).choices[0].message.content
    print(f"GPT Response: {gpt_response}")
    
    action, result = gpt_response.split("# ", 1)
    return action, result

def ask_clarifying_questions(query, refined_query):
    """
        Tells user that that no books were fine and asks clarifying questions.

        args:
            query(str): user's query
            refined_query(str): refined query
        
        returns:
            (str): clarifying questions
    """
    #Getting the prompt
    messages = get_query_clarification_prompt(query, refined_query)
    
    #Call chat gpt
    gpt_response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    ).choices[0].message.content
    
    return gpt_response


def summarize_book(book):
    """
        Generate a short book summary using GPT.

        args:
            book (dict): the book to generate a summary for.

        returns:
            (dict): book info including summary.
    
    """
    prompt = get_book_summary_prompt(book)
    gpt_response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=prompt,
        temperature=0.1,
        max_tokens=100
    )

    return {
        "title": book["title"],
        "author": ', '.join(book.get('author_name', ['Unknown'])),
        "summary": gpt_response.choices[0].message.content
    }