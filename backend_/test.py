import sqlitecloud

try:
    conn = sqlitecloud.connect(
        "wss://cpyjdtbvnk.g5.sqlite.cloud:8860/PlantPricer.db?apikey=PJuyYTUePUY20Abu33rsOVLGhHyW3Hzspl9qsUZmfDk",

    )
    print("Connected successfully!")
except sqlitecloud.exceptions.SQLiteCloudException as e:
    print("Connection failed:", e)