def get_query_classification_prompt(query):
    """
    Returns the structured prompt for classifying and refining book search queries.
    """

    return [
        {"role": "system", "content": 
            "You are an AI assistant that refines book search queries and ensures content is appropriate. "
            "Your job is to: "
            "1. Determine if the user wants to chat or search for a book. "
            "   - If it's a chat, respond with '_CHAT_# ' followed by a concise response max 50 words. "
            "   - If it's a book search, respond with '_BOOK_#' followed by an optimized query.  "
            "2. If the input contains profanity, offensive content, or inappropriate language, do not process it as a search. "
            "   - Instead, respond with '_MODERATED_#' followed by a message explaining that profanity is not allowed. "
            "4. Ensure the response is optimized for searching books"
            "5. Keep the query short maximum 3 words."
             "**Examples:**\n"
            "- 'Give me a book about vitamin D.' → `_BOOK_# vitamin D`\n"
            "- 'I want a book about meditation.' → `_BOOK_# meditation mindfulness`\n"
            "- 'Recommend a book about AI and ethics.' → `_BOOK_# AI ethics`\n"
            "- 'Give me a book about sex.' → `_BOOK_# sex intimacy`\n"
            "- 'Find me something about productivity.' → `_BOOK_# productivity time management`\n"
            "- 'Tell me about books on space exploration.' → `_BOOK_# space exploration`\n"
            "- 'Show me a book about cryptocurrency.' → `_BOOK_# cryptocurrency Bitcoin`\n"
            "- 'Find books about world war history.' → `_BOOK_# World War history`\n\n"
            "- 'i got sick today and wanna get better suggest some books.' → `_BOOK_# Sick`\n\n"
            },

        {"role": "user", "content": 
            f"User Query: {query} "
            "Classify it as chat or book search. If it is inappropriate, mark it as moderated. If it is a book search come up"
            " with few key words so this could be used in a api call."
            "In each search figure out the concept of the search and do not put words that are not related to the main topic."}
    ]


def get_query_clarification_prompt(query, refined_query):
    """
    Returns the structured prompt for clarifying the query, when no books were found.
    """

    return [
        {"role": "system", "content": 
            "You are an AI assistant helping users find books based on their natural language queries. "
            "No books are found based on the users previous ask, so you must politely ask for more clarification. "
            "Your response should: "
            "1. Acknowledge that no exact matches were found. "
            "2. Ask the user for more details, such as genres, themes, time periods, or authors they like. "
            "3. Keep the tone friendly and engaging."
            "4. Keep the answer short. Maximum 40 words."},

        {"role": "user", "content": 
            f"User Query: {query} "
            f"Refined Search Query Used: {refined_query} "
            "No books were found. Please ask the user for more details to refine their search."}
    ]

def get_book_summary_prompt(book):
    """
    Returns the structured prompt for summarizing a book.
    """

    book_info = f"Title: {book['title']}, Author: {', '.join(book.get('author_name', ['Unknown']))}"

    return [
        {"role": "system", "content": 
            "You are a book expert."},

        {"role": "user", "content": 
            f"Summarize this book in a short and engaging way and limit the summary to 40 words (do not start by repeating book title):\n\n{book_info}"}
    ]
