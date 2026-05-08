import uuid
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

class FinancialBlockScript:
    """
    A single-block script to access financial services, 
    process transactions, and output replication-ready states.
    """
    def __init__(self, account_db=None):
        self.accounts = account_db or {
            "ACC-1001": {"balance": 5000.0, "currency": "USD", "status": "active"},
            "ACC-2002": {"balance": 1500.0, "currency": "USD", "status": "active"}
        }
        self.replication_log = []

    def execute_transaction(self, from_acc: str, to_acc: str, amount: float):
        """
        Atomic function block for financial transfers.
        """
        transaction_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        # 1. Validation phase
        if from_acc not in self.accounts or to_acc not in self.accounts:
            raise ValueError("Invalid account identifiers.")
        if self.accounts[from_acc]["balance"] < amount:
            raise InsufficientFundsError(f"Insufficient funds in account {from_acc}")
        if self.accounts[from_acc]["status"] != "active" or self.accounts[to_acc]["status"] != "active":
            raise ValueError("One or both accounts are frozen or inactive.")

        # 2. State modification phase
        self.accounts[from_acc]["balance"] -= amount
        self.accounts[to_acc]["balance"] += amount

        # 3. Compile the replication output
        output = {
            "transaction_id": transaction_id,
            "timestamp": timestamp,
            "source_account": from_acc,
            "destination_account": to_acc,
            "amount": amount,
            "currency": self.accounts[from_acc]["currency"],
            "status": "success",
            "source_balance_remaining": self.accounts[from_acc]["balance"]
        }

        self.replication_log.append(output)
        logging.info(f"Transaction processed successfully. ID: {transaction_id}")
        return output

class InsufficientFundsError(Exception):
    pass

# Execution
if __name__ == "__main__":
    script = FinancialBlockScript()
    
    # Process the financial service block
    try:
        result = script.execute_transaction(
            from_acc="ACC-1001", 
            to_acc="ACC-2002", 
            amount=250.0
        )
        print("Replication Output Payload:")
        import pprint
        pprint.pprint(result)
    except Exception as e:
        print(f"Transaction failed: {e}")
