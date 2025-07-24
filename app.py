from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database configuration using environment variables
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'personal-website-db.cb002k6es5bn.us-east-2.rds.amazonaws.com'),
    'database': os.getenv('DB_NAME', 'personal_website'),
    'user': os.getenv('DB_USER', 'admin'),
    'password': os.getenv('DB_PASSWORD'),  # Required from environment
    'port': int(os.getenv('DB_PORT', 3306))
}

@app.route('/')
def home():
    return jsonify({'message': 'Flask API is working!', 'status': 'success'})

@app.route('/home')
def home_page():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/test')
def test():
    return jsonify({'message': 'Flask is working!'})

@app.route('/blog/qb-rankings/data')
def qb_rankings_data():
    year = request.args.get('year', type=int)
    week = request.args.get('week', type=int)
    print(f"Received request for year: {year}, week: {week}")
    
    if year is None or week is None:
        print("Missing year or week parameter")
        return jsonify({'error': 'Missing year or week'}), 400
    
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("Database connection successful")
        cursor = conn.cursor(dictionary=True)
        query = 'SELECT * FROM qb_rankings WHERE year = %s AND week IN (%s, %s) ORDER BY week DESC'
        params = (year, week-1, week)
        print(f"Executing query: {query} with params: {params}")
        cursor.execute(query, params)
        results = cursor.fetchall()
        print(f"Query returned {len(results)} results")
        cursor.close()
        conn.close()
        return jsonify(results)
    except Exception as e:
        print(f"Database error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/blog/qb-rankings')
def qb_rankings():
    return render_template('qb_rankings.html')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, port=5001) 