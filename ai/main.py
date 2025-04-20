# import pandas as pd
# import google.generativeai as genai
# import os

# # Load environment variables (ensure .env has GEMINI_API_KEY)
# from dotenv import load_dotenv
# load_dotenv()

# # Gemini setup
# genai.configure(api_key="AIzaSyAKFNYPNWvZ1lefBXWYXzSbIBGjzqPD1DM")
# model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-01-21")

# # CSV loading as before
# column_names = [
#     "isbn", "isbn13", "title", "authors", "categories", "unused1", "description",
#     "published_year", "average_rating", "num_pages", "ratings_count",
#     "title_full", "desc_with_isbn"
# ]

# books_df = pd.read_csv("books.csv", header=None, names=column_names)
# books_sample = books_df[['title', 'authors', 'average_rating', 'description']].dropna().head(100).to_dict(orient="records")

# # User input
# user_input = input("Tell me what kind of books you like: ")

# # Create prompt
# book_data_for_prompt = "\n".join([
#     f"Title: {b['title']}\nAuthor: {b['authors']}\nRating: {b['average_rating']}\nDescription: {b['description']}\n"
#     for b in books_sample
# ])

# prompt = f"""
# You are a smart book recommendation AI.
# A user said: "{user_input}"

# Based on their interests, recommend the best 5 books from the following list. Format your reply nicely.

# Books Available:
# {book_data_for_prompt}
# """

# # Gemini response
# response = model.generate_content(prompt)
# print("\n📚 Recommended Books:\n")
# print(response.text)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env and setup Gemini
load_dotenv()
genai.configure(api_key="AIzaSyAKFNYPNWvZ1lefBXWYXzSbIBGjzqPD1DM")
model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-01-21")

# FastAPI setup
app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic input model
class InterestInput(BaseModel):
    user_interest: str

# Load book data
column_names = [
    "isbn", "isbn13", "title", "authors", "categories", "unused1", "description",
    "published_year", "average_rating", "num_pages", "ratings_count",
    "title_full", "desc_with_isbn"
]
books_df = pd.read_csv("books.csv", header=None, names=column_names)
books_sample = books_df[['title', 'authors', 'average_rating', 'description']].dropna().head(100).to_dict(orient="records")

@app.post("/recommend")
async def recommend_books(data: InterestInput):
    user_input = data.user_interest

    book_data_for_prompt = "\n".join([
        f"Title: {b['title']}\nAuthor: {b['authors']}\nRating: {b['average_rating']}\nDescription: {b['description']}\n"
        for b in books_sample
    ])

    prompt = f"""
You are a smart book recommendation AI.
A user said: "{user_input}"

Based on their interests, recommend the best 5 books from the following list. Format your reply as a list with title and author.

Books Available:
{book_data_for_prompt}
"""

    response = model.generate_content(prompt)
    return {"recommendations": response.text}
