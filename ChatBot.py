

# I have created the LLM for the chatbot, but I don't know why it always shows this error: ERROR { openai.RateLimitError: Error code: 429 - {'error': {'message': 'You exceeded your current quota, please check your plan and billing details. For more information on this error, read the docs: https://platform.openai.com/docs/guides/error-codes/api-errors.', 'type': 'insufficient_quota', 'param': None, 'code': 'insufficient_quota'}} } It tells me to check my plan and bills. I tried your key, and I also tried my keys, but it didn't work for me. That's why I am unable to integrate the chatbot into the application. However, if I find a solution to it, I will integrate the chatbot.





import os
import streamlit as st
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAIEmbeddings
openai_embeddings = OpenAIEmbeddings()

# 1. Vectorize the sales response CSV data
file_path = "a.csv"  # Update this with your actual file path

# Ensure the file exists
if not os.path.isfile(file_path):
    print(f"Error: File {file_path} does not exist.")
else:
    loader = CSVLoader(file_path=file_path)
    try:
        documents = loader.load()
    except RuntimeError as e:
        print(f"Error loading document: {e}")
        documents = None 


    if documents:
        # Generate embeddings for each document
        db = FAISS.from_documents(documents, openai_embeddings)

        # Function for similarity search
        def retrieve_info(query):
            similar_response = db.similarity_search(query, k=3)
            page_contents_array = [doc.page_content for doc in similar_response]
            return page_contents_array

        # 3. Setup LLMChain & prompts
        llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")

        template = """
        You are an expert data analyst. I will share a query with you, and you will provide the best possible response 
        based on the data provided in the CSV file. Use the data provided below to generate your response.

        Query: {message}

        Data: {best_practice}

        Please provide a response that accurately answers the query based on the data:
        """

        prompt = PromptTemplate(
            input_variables=["message", "best_practice"],
            template=template
        )

        chain = LLMChain(llm=llm, prompt=prompt)

        # Retrieval augmented generation
        def generate_response(message):
            best_practice = retrieve_info(message)
            response = chain.run(message=message, best_practice=best_practice)
            return response