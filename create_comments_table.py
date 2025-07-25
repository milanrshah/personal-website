import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# AWS DynamoDB setup
dynamodb = boto3.resource('dynamodb',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'us-east-1')
)

table_name = os.getenv('DYNAMODB_TABLE_NAME', 'nfl-qb-rankings-comments')

def create_comments_table():
    """Create the DynamoDB table for comments"""
    try:
        # Check if table already exists
        existing_tables = [table.name for table in dynamodb.tables.all()]
        if table_name in existing_tables:
            print(f"Table {table_name} already exists!")
            return
        
        # Create the table
        table = dynamodb.create_table(
            TableName=table_name,
            KeySchema=[
                {
                    'AttributeName': 'week',
                    'KeyType': 'HASH'  # Partition key
                },
                {
                    'AttributeName': 'commentId',
                    'KeyType': 'RANGE'  # Sort key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'week',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'commentId',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'parentCommentId',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'timestamp',
                    'AttributeType': 'S'
                }
            ],
            GlobalSecondaryIndexes=[
                {
                    'IndexName': 'parentCommentId-index',
                    'KeySchema': [
                        {
                            'AttributeName': 'parentCommentId',
                            'KeyType': 'HASH'
                        },
                        {
                            'AttributeName': 'timestamp',
                            'KeyType': 'RANGE'
                        }
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL'
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5
                    }
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        # Wait for table to be created
        table.meta.client.get_waiter('table_exists').wait(TableName=table_name)
        print(f"Table {table_name} created successfully!")
        
    except Exception as e:
        print(f"Error creating table: {e}")

if __name__ == '__main__':
    create_comments_table() 