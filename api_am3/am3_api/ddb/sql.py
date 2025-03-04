import boto3
import base64

class DynamoDB:
    def __init__(self) -> None:
        self.db = boto3.resource('dynamodb')
        self.table = self.db.Table('Accounts')
        self. attributes = set(['id', 'title', 'account', 'pw', 'logo', 'note'])
        
    def encodeImg(img: bytes) -> str:
        """_summary_

        Encode images with base64
    
        Args:
            img (bytes): image file

        Returns:
            str: encoded string
        """
        return base64.b64encode(img.read()).decode('utf-8')

    def decodeImg(img:str) -> bytes:
        """_summary_

        Decode base64 encoded string to bytes
        
        Args:
            img (str): base64 encoded image

        Returns:
            bytes: image file
        """
        return base64.b64decode(img)

    def count(self) -> int:
        """_summary_

        Count all items in the table 
        Exclude Admin (id=0)
        
        Returns:
            int: number of items in the table
        """
        return self.table.scan(TableName="Accounts", Select='COUNT')["Count"] - 1

    def maxID(self) -> int:
        """_summary_
        
        Get maximum value of id as int
        
        Returns:
            int: maximum integer of id attribute
        """
        accounts = self.table.scan()["Items"]
        return max(int(account['id']) for account in accounts)
    
    def put(self, id: int = None, title: str = "", account: str = "", pw: str = "", logo: str = "", note: str = "") -> None:
        """_summary_
        
        Put an item in the table
        
        Args:
            id (int): primary key id 
            title (str): title for the account
            account (str): account
            pw (str): hashed password
            logo (str): base64 encoded logo image
            note (str): additional notes about the account
        """
        # do nothing if no information is given
        if title+account+pw+logo+note == "":
            return 
        
        if not id:
            id = self.maxID()+1
        
        self.table.put_item(
            Item={
                'id': id,
                'account': account,
                'logo' : logo,
                'title' : title,
                'note' : note,
                'pw'   : pw
            }
        )
    
    def putItems(self, items) -> None:
        """
        Insert multiple items into the DynamoDB table efficiently.
        If same ID is given it will overwrite the old one with new one

        Args:
            items (list): A list of dictionaries, each representing an item to insert.
        """
        
        # DynamoDB batch write limit is 25 items per request
        chunk_size = 25
        chunks = [items[i:i + chunk_size] for i in range(0, len(items), chunk_size)]
        print(chunks)
        
        for chunk in chunks:
            with self.table.batch_writer() as batch:
                for item in chunk:
                    batch.put_item(Item=item)
        
    def getAll(self) -> list:
        """_summary_

        Get all items in the table.
        Admin Item excluded
       
        Returns:
            list: all items
        """
        
        # get all items
        response = self.table.scan()
        accounts = response["Items"]

        # If the table contains more than 1MB of data, you'll need to paginate
        while 'LastEvaluatedKey' in response:
            response = self.table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            accounts.extend(response['Items'])
                
        # remove admin item
        accounts = [d for d in accounts if d.get('id') != 0]
        
        return accounts
    
    def get(self, **kwargs) -> dict:
        """_summary_

        Get an item by an attribute name and value

        Kwrgs: id, title, account, pw, logo, note
                    
        Returns:
            list: item
        """
        # check if kwargs are valid
        try:
            for attribute, value in kwargs.items():
                if attribute not in self.attributes:
                    raise NameError
                if attribute == 'id':
                    if not isinstance(value, int):
                        raise TypeError(0,value)
                elif not isinstance(value, str):
                    raise TypeError(1, value)
        except NameError:
            print("Invalid attribute Title.")
            print("Valid attribute names are 'title', 'account', 'pw', 'logo', 'note'")
        except TypeError as v:
            if v.args[0] == 0:
                print("You entered: ", type(v.args[1]))
                print("Please enter a integer for id")
            else:
                print("You entered: ", type(v.args[1]))
                print("Please enter a string")
            
        return self.table.get_item(Key=kwargs)['Item']
    
    def update(self, targetID:int, **kwargs) -> None:
        """_summary_
        
        Update an item
        
        Args:
            targetID (int): item id
        """
        if len(kwargs) == 0:
            return
        
        # create expression and value dictionary
        expression = "SET "
        values = {}
        try:
            for attribute, value in kwargs.items():
                # validity check
                if attribute not in self.attributes:
                    raise NameError
                if not isinstance(value, str):
                    raise TypeError(value)
                
                expression += f"{attribute}=:new{attribute},"
                values[f":new{attribute}"] = value
            
            expression = expression[:-1] # get rid of last comma

            # update
            self.table.update_item(Key={'id': targetID},
                                   UpdateExpression=expression,
                                   ExpressionAttributeValues=values
                                   )
        except NameError:
            print("Invalid attribute name.")
            print(
                "Valid attribute names are 'id', 'title', 'account', 'pw', 'logo', 'note'.")
        except TypeError as v:
            print("You entered: ", type(v.args[0]))
            print("Please enter a string")
            
        return
        
    def delete(self, targetID:int) -> None:
        """_summary_

        Delete a item with id

        Args:
            targetID (int): item id
        """
        if targetID == 0:
            print("ERROR: Do not delete admin item")
            return 
        
        self.table.delete_item(Key={'id': targetID})