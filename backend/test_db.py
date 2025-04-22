import sqlite3


conn = sqlite3.connect("db.sqlite3")
# 2. Create a cursor object to execute SQL commands
cursor = conn.cursor()


# Query sqlite_master to get table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

# Print table names
# for table in tables:
#     print(table[0])
    
    
query = """select * from kudos_app_user"""
res = cursor.execute(query).fetchall()

for i in res:
    print(i)

# Close the connection
conn.close()



'''
create:
{
    "username":"test4",
    "email": "test4@gmail.com",
    "password":"test4",
    "organization":"testOrg"
}

login: 
{
    "email": "test4@gmail.com",
    "password":"test4"
}

kudos: 
{
    "sender":1,
    "receiver": 2,
    "message":"For his work"
}

filter-kudos-byweek
?user_id=3&date=2025-04-23&filter_type=sent or receive

kudos_quota:
{
    "user_id": 1,
    "date" : "2024-04-16"
}

list_of_user in org:
{
    "user_id": 1
}

'''