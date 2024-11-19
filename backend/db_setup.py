import sqlite3

def create_database():
    connection = sqlite3.connect('backend/user_data.db')
    cursor = connection.cursor()
    
    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userName TEXT NOT NULL,
            pressureId INTEGER,
            pressureValid BOOLEAN,
            leftFootSize REAL,
            rightFootSize REAL,
            leftWidth REAL,
            rightWidth REAL,
            feetLevel STRING,
            createdAt DATE DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    connection.commit()
    connection.close()

if __name__ == '__main__':
    create_database()
    print("Database and table created successfully.")
