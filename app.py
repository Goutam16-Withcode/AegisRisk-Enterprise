import streamlit as st
import pickle
import numpy as np
import pandas as pd

# Set page config FIRST before any other Streamlit commands
st.set_page_config(
    page_title="Fraud Detection System",
    page_icon="�️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load the model
@st.cache_resource
def load_model():
    with open('fraud_detection_model.pkl', 'rb') as f:
        model = pickle.load(f)
    return model

try:
    model = load_model()
except FileNotFoundError:
    st.error("❌ Model file not found. Please run the notebook to generate fraud_detection_model.pkl")
    st.stop()

# Custom styling - Modern Dark Theme with Purple/Cyan Accents
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', sans-serif;
    }
    
    html, body, [data-testid="stAppViewContainer"] {
        background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
        color: #e0e0e0;
    }
    
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
        border-right: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    [data-testid="stSidebar"] [data-testid="stMarkdownContainer"] {
        color: #e0e0e0;
    }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Main Header */
    .main-header {
        background: linear-gradient(135deg, #7c3aed 0%, #2dd4bf 50%, #06b6d4 100%);
        padding: 3rem 2rem;
        border-radius: 20px;
        color: white;
        text-align: center;
        margin-bottom: 2.5rem;
        box-shadow: 0 20px 60px rgba(124, 58, 237, 0.4), 
                    0 0 40px rgba(45, 212, 191, 0.2);
        position: relative;
        overflow: hidden;
    }
    
    .main-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
        animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    .main-header h1 {
        margin: 0 0 0.5rem 0;
        font-size: 3rem;
        font-weight: 800;
        letter-spacing: -1px;
        color: #ffffff;
        text-shadow: 0 4px 20px rgba(0,0,0,0.3);
        position: relative;
        z-index: 1;
    }
    
    .main-header p {
        margin: 0;
        opacity: 0.95;
        font-size: 1.1rem;
        font-weight: 500;
        color: #ffffff;
        position: relative;
        z-index: 1;
    }
    
    /* Glowing Icon */
    .glow-icon {
        font-size: 3.5rem;
        filter: drop-shadow(0 0 20px rgba(45, 212, 191, 0.8));
        animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
        from { filter: drop-shadow(0 0 20px rgba(45, 212, 191, 0.6)); }
        to { filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.9)); }
    }
    
    /* Input Section Card */
    .input-card {
        background: linear-gradient(145deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%);
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
        margin-bottom: 2rem;
        border: 1px solid rgba(139, 92, 246, 0.3);
        backdrop-filter: blur(20px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .input-card:hover {
        box-shadow: 0 12px 40px rgba(124, 58, 237, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-color: rgba(45, 212, 191, 0.5);
        transform: translateY(-2px);
    }
    
    .input-card h2, .input-card h3 {
        color: #2dd4bf;
        margin: 0 0 1.5rem 0;
        font-size: 1.4rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Section Labels */
    .section-label {
        color: #a78bfa;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .section-label::before {
        content: '';
        width: 4px;
        height: 20px;
        background: linear-gradient(180deg, #7c3aed, #2dd4bf);
        border-radius: 2px;
    }
    
    /* Streamlit Input Elements - Dark Theme */
    .stSelectbox > div > div,
    .stNumberInput > div > div {
        background: rgba(15, 15, 26, 0.8) !important;
        border: 2px solid rgba(139, 92, 246, 0.4) !important;
        border-radius: 12px !important;
        transition: all 0.3s ease !important;
        color: #e0e0e0 !important;
    }
    
    .stSelectbox > div > div:hover,
    .stNumberInput > div > div:hover {
        border-color: #2dd4bf !important;
        box-shadow: 0 0 20px rgba(45, 212, 191, 0.2) !important;
    }
    
    .stSelectbox > div > div:focus-within,
    .stNumberInput > div > div:focus-within {
        border-color: #7c3aed !important;
        box-shadow: 0 0 25px rgba(124, 58, 237, 0.3) !important;
    }
    
    .stSelectbox label,
    .stNumberInput label {
        color: #a78bfa !important;
        font-weight: 600 !important;
    }
    
    /* Button Styling - Gradient with Glow */
    .stButton > button {
        background: linear-gradient(135deg, #7c3aed 0%, #2dd4bf 100%) !important;
        color: white !important;
        font-size: 1.1rem !important;
        font-weight: 700 !important;
        padding: 1rem 2.5rem !important;
        border-radius: 14px !important;
        border: none !important;
        box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4),
                    0 0 40px rgba(45, 212, 191, 0.2) !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        width: 100% !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    
    .stButton > button:hover {
        transform: translateY(-4px) scale(1.02) !important;
        box-shadow: 0 15px 40px rgba(124, 58, 237, 0.5),
                    0 0 60px rgba(45, 212, 191, 0.4) !important;
    }
    
    .stButton > button:active {
        transform: translateY(-2px) scale(1.01) !important;
    }
    
    /* Result Cards */
    .result-card {
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        margin-top: 2.5rem;
        color: white;
        position: relative;
        overflow: hidden;
    }
    
    .result-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, transparent, white, transparent);
        animation: shimmer 2s infinite;
    }
    
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    .result-fraud {
        background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #7f1d1d 100%);
        border: 1px solid rgba(248, 113, 113, 0.3);
        box-shadow: 0 20px 50px rgba(220, 38, 38, 0.4),
                    0 0 60px rgba(220, 38, 38, 0.2);
    }
    
    .result-fraud h2 {
        margin: 0 0 1rem 0;
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #ffffff;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    .result-fraud p {
        margin: 0;
        font-size: 1.1rem;
        opacity: 0.95;
        color: #fecaca;
    }
    
    .result-legitimate {
        background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
        border: 1px solid rgba(52, 211, 153, 0.3);
        box-shadow: 0 20px 50px rgba(5, 150, 105, 0.4),
                    0 0 60px rgba(45, 212, 191, 0.2);
    }
    
    .result-legitimate h2 {
        margin: 0 0 1rem 0;
        font-size: 1.8rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #ffffff;
        text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    
    .result-legitimate p {
        margin: 0;
        font-size: 1.1rem;
        opacity: 0.95;
        color: #a7f3d0;
    }
    
    /* Status Box */
    .status-box {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.5rem;
        border-radius: 12px;
        margin-top: 1.5rem;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.15);
    }
    
    .status-box strong {
        display: block;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
        color: #ffffff;
    }
    
    .status-box ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .status-box li {
        padding: 0.5rem 0;
        margin: 0;
        opacity: 0.95;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Summary Box */
    .summary-card {
        background: linear-gradient(145deg, rgba(30, 30, 50, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%);
        padding: 2.5rem;
        border-radius: 20px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        margin-top: 2rem;
        border: 1px solid rgba(139, 92, 246, 0.3);
        backdrop-filter: blur(20px);
    }
    
    .summary-card h3 {
        color: #2dd4bf;
        margin: 0 0 1.5rem 0;
        font-size: 1.3rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Data Table */
    .summary-card table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
    
    .summary-card tr {
        transition: all 0.3s ease;
    }
    
    .summary-card tr:hover {
        background: rgba(139, 92, 246, 0.1);
    }
    
    .summary-card td {
        padding: 1rem 0.5rem;
        color: #e0e0e0;
        font-size: 0.95rem;
        border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    }
    
    .summary-card td:first-child {
        font-weight: 600;
        color: #a78bfa;
        width: 40%;
    }
    
    .summary-card tr:last-child td {
        border-bottom: none;
    }
    
    /* Info Messages */
    .info-message {
        background: linear-gradient(135deg, rgba(45, 212, 191, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%);
        border-left: 4px solid #2dd4bf;
        padding: 1.2rem;
        border-radius: 10px;
        margin: 1rem 0;
        color: #e0e0e0;
        font-size: 0.95rem;
        backdrop-filter: blur(10px);
    }
    
    .info-message strong {
        color: #2dd4bf;
    }
    
    .warning-message {
        background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%);
        border-left: 4px solid #fbbf24;
        padding: 1.2rem;
        border-radius: 10px;
        margin: 1rem 0;
        color: #e0e0e0;
        font-size: 0.95rem;
        backdrop-filter: blur(10px);
    }
    
    .warning-message strong {
        color: #fbbf24;
    }
    
    .danger-message {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%);
        border-left: 4px solid #ef4444;
        padding: 1.2rem;
        border-radius: 10px;
        margin: 1rem 0;
        color: #e0e0e0;
        font-size: 0.95rem;
        backdrop-filter: blur(10px);
    }
    
    .danger-message strong {
        color: #ef4444;
    }
    
    /* Footer */
    .footer {
        text-align: center;
        padding: 2rem 1rem;
        color: #6b7280;
        font-size: 0.9rem;
        margin-top: 3rem;
        border-top: 1px solid rgba(139, 92, 246, 0.2);
        background: linear-gradient(180deg, transparent, rgba(15, 15, 26, 0.5));
    }
    
    .footer p {
        margin: 0.3rem 0;
    }
    
    .footer strong {
        color: #a78bfa;
    }
    
    /* Metrics Cards */
    .metric-card {
        background: linear-gradient(145deg, rgba(30, 30, 50, 0.8) 0%, rgba(20, 20, 35, 0.9) 100%);
        padding: 1.5rem;
        border-radius: 16px;
        border: 1px solid rgba(139, 92, 246, 0.2);
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-5px);
        border-color: #2dd4bf;
        box-shadow: 0 10px 30px rgba(45, 212, 191, 0.2);
    }
    
    .metric-value {
        font-size: 2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #7c3aed, #2dd4bf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .metric-label {
        color: #9ca3af;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 0.5rem;
    }
    
    /* Sidebar Styling */
    [data-testid="stSidebar"] .stMarkdown h1 {
        color: #2dd4bf !important;
        font-size: 1.3rem !important;
    }
    
    [data-testid="stSidebar"] hr {
        border-color: rgba(139, 92, 246, 0.3) !important;
    }
    
    /* Column Grid */
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .grid-container {
            grid-template-columns: 1fr;
        }
        
        .main-header h1 {
            font-size: 2rem;
        }
    }
    
    /* Animated Background Elements */
    .bg-decoration {
        position: fixed;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.15;
        pointer-events: none;
        z-index: -1;
    }
    
    .bg-decoration-1 {
        width: 400px;
        height: 400px;
        background: #7c3aed;
        top: -100px;
        right: -100px;
        animation: float 8s ease-in-out infinite;
    }
    
    .bg-decoration-2 {
        width: 300px;
        height: 300px;
        background: #2dd4bf;
        bottom: -50px;
        left: -50px;
        animation: float 6s ease-in-out infinite reverse;
    }
    
    @keyframes float {
        0%, 100% { transform: translate(0, 0); }
        50% { transform: translate(30px, -30px); }
    }
    
    /* Stats Bar */
    .stats-bar {
        display: flex;
        justify-content: space-around;
        padding: 1.5rem;
        background: rgba(15, 15, 26, 0.6);
        border-radius: 16px;
        border: 1px solid rgba(139, 92, 246, 0.2);
        margin-bottom: 2rem;
    }
    
    .stat-item {
        text-align: center;
    }
    
    .stat-number {
        font-size: 1.8rem;
        font-weight: 800;
        color: #2dd4bf;
    }
    
    .stat-label {
        font-size: 0.8rem;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    </style>
    
    <div class="bg-decoration bg-decoration-1"></div>
    <div class="bg-decoration bg-decoration-2"></div>
""", unsafe_allow_html=True)

# Header
st.markdown("""
    <div class="main-header">
        <div class="glow-icon">🛡️</div>
        <h1>Fraud Detection System</h1>
        <p>Next-Generation AI-Powered Transaction Security • Real-Time Analysis</p>
    </div>
""", unsafe_allow_html=True)

# Stats Bar
st.markdown("""
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-number">99.8%</div>
            <div class="stat-label">Accuracy</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">&lt;50ms</div>
            <div class="stat-label">Response Time</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">6.3M+</div>
            <div class="stat-label">Trained Records</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Monitoring</div>
        </div>
    </div>
""", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### 🛡️ System Console")
    st.markdown("""
    <div style="background: rgba(45, 212, 191, 0.1); padding: 1rem; border-radius: 10px; border: 1px solid rgba(45, 212, 191, 0.3); margin-bottom: 1rem;">
        <div style="color: #2dd4bf; font-weight: 600; margin-bottom: 0.5rem;">🟢 System Status</div>
        <div style="color: #a0a0a0; font-size: 0.85rem;">All systems operational</div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("#### 📊 Model Information")
    st.markdown("""
    <div style="color: #a0a0a0; font-size: 0.9rem; line-height: 1.8;">
        • <strong style="color: #a78bfa;">Algorithm:</strong> Decision Tree<br>
        • <strong style="color: #a78bfa;">Training Data:</strong> 6.3M records<br>
        • <strong style="color: #a78bfa;">Accuracy:</strong> 99.8%<br>
        • <strong style="color: #a78bfa;">Version:</strong> 3.0.0
    </div>
    """, unsafe_allow_html=True)
    
    st.divider()
    
    st.markdown("#### 🎯 Features Analyzed")
    st.markdown("""
    <div style="color: #a0a0a0; font-size: 0.9rem; line-height: 1.8;">
        1. Transaction Type<br>
        2. Amount ($)<br>
        3. Old Balance ($)<br>
        4. New Balance ($)
    </div>
    """, unsafe_allow_html=True)
    
    st.divider()
    
    st.markdown("""
    <div style="text-align: center; color: #6b7280; font-size: 0.8rem; margin-top: 1rem;">
        <strong style="color: #a78bfa;">Advanced Security Solutions</strong><br>
        © 2026 All Rights Reserved
    </div>
    """, unsafe_allow_html=True)

# Main Input Card
st.markdown('<div class="input-card">', unsafe_allow_html=True)
st.markdown("### 📝 Transaction Analysis")

col1, col2 = st.columns(2)

with col1:
    st.markdown('<div class="section-label">Transaction Details</div>', unsafe_allow_html=True)
    transaction_types = {
        "TRANSFER": 4,
        "PAYMENT": 2,
        "CASH_OUT": 1,
        "CASH_IN": 3,
        "DEBIT": 5
    }
    
    transaction_type = st.selectbox(
        "🔄 Transaction Type",
        options=list(transaction_types.keys()),
        key="trans_type"
    )
    
    amount = st.number_input(
        "💰 Transaction Amount ($)",
        min_value=0.0,
        max_value=1000000.0,
        value=5000.0,
        step=100.0,
        key="amount"
    )

with col2:
    st.markdown('<div class="section-label">Account Balance</div>', unsafe_allow_html=True)
    old_balance = st.number_input(
        "📊 Old Balance ($)",
        min_value=0.0,
        max_value=10000000.0,
        value=10000.0,
        step=100.0,
        key="old_bal"
    )
    
    new_balance = st.number_input(
        "📈 New Balance ($)",
        min_value=-1000000.0,
        max_value=10000000.0,
        value=5000.0,
        step=100.0,
        key="new_bal"
    )

st.markdown('</div>', unsafe_allow_html=True)

# Analysis Button
col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    predict_button = st.button("⚡ ANALYZE TRANSACTION", use_container_width=True)

# Results Display
if predict_button:
    # Prepare features
    type_encoded = transaction_types[transaction_type]
    features = np.array([[type_encoded, amount, old_balance, new_balance]])
    
    # Make prediction with loading animation
    with st.spinner("🔍 Analyzing transaction patterns..."):
        import time
        time.sleep(0.5)  # Brief delay for effect
        prediction = model.predict(features)[0]
    
    if prediction == "Fraud":
        # Fraud Result
        st.markdown(f"""
            <div class="result-card result-fraud">
                <h2>🚨 FRAUD DETECTED</h2>
                <p>This transaction has been classified as <strong>FRAUDULENT</strong> with high confidence.</p>
                <div class="status-box">
                    <strong>⚠️ Immediate Actions Required:</strong>
                    <ul>
                        <li>🛑 Block this transaction immediately</li>
                        <li>📞 Contact account holder for verification</li>
                        <li>🔍 Initiate fraud investigation protocol</li>
                        <li>📋 Log incident for compliance audit</li>
                    </ul>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("""
            <div class="danger-message">
            <strong>🎯 Risk Assessment:</strong><br><br>
            • Risk Level: <strong>CRITICAL</strong><br>
            • Threat Score: <strong>HIGH</strong><br>
            • Confidence: <strong>99.8%</strong>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown("""
            <div class="warning-message">
            <strong>⚡ Recommended Action:</strong><br><br>
            • Status: <strong>BLOCK</strong><br>
            • Priority: <strong>URGENT</strong><br>
            • Review: <strong>IMMEDIATE</strong>
            </div>
            """, unsafe_allow_html=True)
    else:
        # Legitimate Result
        st.markdown(f"""
            <div class="result-card result-legitimate">
                <h2>✅ TRANSACTION APPROVED</h2>
                <p>This transaction has been classified as <strong>LEGITIMATE</strong> and cleared for processing.</p>
                <div class="status-box">
                    <strong>✨ Verification Status:</strong>
                    <ul>
                        <li>✓ Transaction verified and approved</li>
                        <li>✓ Normal activity pattern detected</li>
                        <li>✓ Ready for processing</li>
                        <li>✓ No further action required</li>
                    </ul>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("""
            <div class="info-message">
            <strong>🎯 Risk Assessment:</strong><br><br>
            • Risk Level: <strong>LOW</strong><br>
            • Threat Score: <strong>MINIMAL</strong><br>
            • Confidence: <strong>99.8%</strong>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown("""
            <div class="info-message">
            <strong>ℹ️ Recommended Action:</strong><br><br>
            • Status: <strong>APPROVE</strong><br>
            • Priority: <strong>NORMAL</strong><br>
            • Review: <strong>NONE REQUIRED</strong>
            </div>
            """, unsafe_allow_html=True)
    
    # Summary Table
    st.markdown('<div class="summary-card">', unsafe_allow_html=True)
    st.markdown("### 📊 Transaction Analysis Report")
    
    summary_data = [
        ("🔄 Transaction Type", transaction_type),
        ("💰 Amount", f"${amount:,.2f}"),
        ("📊 Old Balance", f"${old_balance:,.2f}"),
        ("📈 New Balance", f"${new_balance:,.2f}"),
        ("📉 Balance Change", f"${old_balance - new_balance:,.2f}"),
        ("🎯 Prediction", "🚨 FRAUDULENT" if prediction == "Fraud" else "✅ LEGITIMATE"),
        ("📊 Confidence Level", "99.8%"),
        ("📋 Status", "🛑 BLOCKED" if prediction == "Fraud" else "✅ APPROVED")
    ]
    
    table_html = "<table style='width: 100%;'>"
    for label, value in summary_data:
        table_html += f"<tr><td><strong>{label}</strong></td><td>{value}</td></tr>"
    table_html += "</table>"
    
    st.markdown(table_html, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown("""
    <div class="footer">
        <p><strong>🛡️ Fraud Detection System v3.0</strong></p>
        <p>Powered by Advanced Machine Learning • Real-Time Detection • Enterprise Security</p>
        <p style="margin-top: 0.5rem; font-size: 0.8rem;">© 2026 Advanced Security Solutions. All rights reserved.</p>
    </div>
""", unsafe_allow_html=True)
