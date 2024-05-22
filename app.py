from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.text_splitter import RecursiveCharacterTextSplitter
import openai

app = Flask(__name__)

CORS(app)


load_dotenv()

# Initialize OpenAIEmbeddings
openai_embeddings = OpenAIEmbeddings()

# Load CSV data
file_path = "a.csv"
if not os.path.isfile(file_path):
    print(f"Error: File {file_path} does not exist.")
    exit()

# Load all documents from CSV
loader = CSVLoader(file_path=file_path)
documents = loader.load()

# Limit documents to the first 1000
documents = documents[:1000]

# Split documents into chunks
chunk_size = 100  # Adjust chunk size as needed
chunks = [documents[i:i + chunk_size] for i in range(0, len(documents), chunk_size)]

# Setup ChatOpenAI model
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")

# Define template for prompts
template = """
You are an expert data analyst. I will share a query with you, and you will provide the best possible response 
based on the data provided in the CSV file. Use the data provided below to generate your response.

Query: {message}

Data: {best_practice}

Please provide a response that accurately answers the query based on the data:
"""

prompt = PromptTemplate(input_variables=["message", "best_practice"], template=template)

# Setup LLMChain
chain = LLMChain(llm=llm, prompt=prompt)

# Function to generate response
def generate_response(query, db):
    # Retrieve relevant information from the database
    info = db.similarity_search(query, k=3)
    best_practice = info[0] if info else "No relevant data found."
    
    # Generate response based on the query and retrieved information
    response = chain.run(message=query, best_practice=best_practice)
    return {"text": response, "score": 0}  

@app.route('/query', methods=['POST'])
def process_query():
    data = request.get_json()
    query = data['query']
    
    # Collect responses from all chunks
    all_responses = []
    for i, chunk in enumerate(chunks):
        print(f"Processing chunk {i + 1}/{len(chunks)}...")
        
        # Create FAISS index with embeddings for the chunk
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        split_documents = text_splitter.split_documents(chunk)
        db = FAISS.from_documents(split_documents, openai_embeddings)
        
        response = generate_response(query, db)
        all_responses.append(response)
        
    # Find the best response based on the highest score
    best_response = max(all_responses, key=lambda x: x["score"])
    
    return jsonify(best_response)


