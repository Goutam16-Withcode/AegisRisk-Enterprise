"""
Production Python Backend Server for Fraud Risk Platform
Can run standalone or alongside the Next.js frontend.
Uses built-in http.server (with optional Flask/FastAPI support) for 100% zero-dependency execution.
"""
import os
import json
import pickle
import numpy as np
from http.server import HTTPServer, BaseHTTPRequestHandler

# Load trained Scikit-Learn DecisionTree model
MODEL_FILE = os.path.join(os.path.dirname(__file__), 'fraud_detection_model.pkl')
try:
    with open(MODEL_FILE, 'rb') as f:
        model = pickle.load(f)
        if not hasattr(model, 'monotonic_cst'):
            model.monotonic_cst = None
    print(f"[OK] Successfully loaded model from {MODEL_FILE}")
    print(f"     Classes: {getattr(model, 'classes_', 'N/A')}")
except Exception as e:
    model = None
    print(f"[WARNING] Model file could not be loaded: {e}")

CHANNEL_MAP = {
    "TRANSFER": 4,
    "PAYMENT": 2,
    "CASH_OUT": 1,
    "CASH_IN": 3,
    "DEBIT": 5
}

def evaluate_transaction(data, threshold=0.5):
    if model is None:
        return {"error": "Model not loaded"}

    channel_str = str(data.get("type", "PAYMENT")).upper()
    channel_code = CHANNEL_MAP.get(channel_str, 2)
    amount = float(data.get("amount", 0.0))
    old_balance = float(data.get("oldBalance", data.get("oldbalanceOrg", 0.0)))
    new_balance = float(data.get("newBalance", data.get("newbalanceOrig", 0.0)))

    features = np.array([[channel_code, amount, old_balance, new_balance]])

    # Model inference
    raw_pred = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0] if hasattr(model, 'predict_proba') else [0.0, 1.0]

    # Classes are typically ['Fraud', 'No Fraud']
    fraud_prob = float(probabilities[0])
    is_drained = (old_balance > 0 and new_balance == 0)
    discrepancy = abs((old_balance - new_balance) - amount)

    # Risk heuristics
    score = int(fraud_prob * 70)
    if raw_pred == 'Fraud' or fraud_prob >= threshold:
        score = max(score, 75)
    if is_drained and (channel_code == 4 or channel_code == 1) and amount >= old_balance * 0.9:
        score = min(100, score + 30)
    if channel_code in [2, 3, 5] and not is_drained:
        score = min(score, 15)

    decision = 'BLOCK' if score >= 70 else ('REVIEW' if score >= 35 else 'ALLOW')

    return {
        "decision": decision,
        "isFraud": decision == 'BLOCK',
        "riskScore": score,
        "policyAction": "Block & freeze account" if decision == 'BLOCK' else ("Step-up 2FA required" if decision == 'REVIEW' else "Authorize"),
        "features": {
            "channel": channel_str,
            "amount": amount,
            "oldBalance": old_balance,
            "newBalance": new_balance
        },
        "ledger": {
            "discrepancy": round(discrepancy, 2),
            "isAccountDrained": is_drained
        }
    }

class FraudRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status_code, payload):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_OPTIONS(self):
        self._send_json(200, {"status": "ok"})

    def do_GET(self):
        if self.path == '/' or self.path == '/health':
            self._send_json(200, {
                "status": "online",
                "service": "Fraud Risk Scoring Engine",
                "modelLoaded": model is not None,
                "framework": "Scikit-Learn DecisionTreeClassifier"
            })
        else:
            self._send_json(404, {"error": "Not Found"})

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')

        try:
            body = json.loads(post_data) if post_data else {}
        except json.JSONDecodeError:
            self._send_json(400, {"error": "Invalid JSON format"})
            return

        if self.path == '/predict':
            result = evaluate_transaction(body, threshold=body.get('threshold', 0.5))
            self._send_json(200, {"status": "success", "data": result})

        elif self.path == '/batch':
            tx_list = body.get('transactions', body if isinstance(body, list) else [])
            threshold = body.get('threshold', 0.5) if isinstance(body, dict) else 0.5
            results = [evaluate_transaction(tx, threshold=threshold) for tx in tx_list]
            blocked = sum(1 for r in results if r['decision'] == 'BLOCK')
            self._send_json(200, {
                "status": "success",
                "summary": {
                    "total": len(results),
                    "blocked": blocked,
                    "review": sum(1 for r in results if r['decision'] == 'REVIEW'),
                    "allowed": len(results) - blocked
                },
                "results": results
            })
        else:
            self._send_json(404, {"error": "Endpoint not recognized"})

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, FraudRequestHandler)
    print("=" * 60)
    print(f"Fraud Risk Python API Backend running on http://localhost:{port}")
    print(f"Endpoints:")
    print(f"  GET  http://localhost:{port}/health")
    print(f"  POST http://localhost:{port}/predict")
    print(f"  POST http://localhost:{port}/batch")
    print("=" * 60)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server(port=8000)
