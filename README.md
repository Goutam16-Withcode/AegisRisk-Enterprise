# 🔒 Fraud Detection System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Enterprise-Grade ML-Powered Transaction Security**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Model Details](#-model-details) • [Screenshots](#-screenshots)

</div>

---

## 📋 Overview

A sophisticated machine learning-based fraud detection system that analyzes financial transactions in real-time. Built with a Decision Tree classifier trained on transaction data, this system provides instant fraud predictions through an intuitive web interface.

## ✨ Features

- 🎯 **Real-time Prediction** - Instant fraud detection for transactions
- 🌙 **Modern Dark UI** - Sleek, professional interface with glass-morphism design
- 📊 **Visual Feedback** - Animated results with confidence indicators
- 🔐 **Multiple Transaction Types** - Support for CASH_OUT, PAYMENT, CASH_IN, TRANSFER, and DEBIT
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Fast Processing** - Cached model loading for optimal performance

## 🛠 Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fraud-detection.git
   cd fraud-detection
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Train the model** (Required before first run)
   
   Open and run all cells in the Jupyter notebook:
   ```bash
   jupyter notebook fraud_detection.ipynb
   ```
   This will download the dataset and create `fraud_detection_model.pkl`

4. **Launch the application**
   ```bash
   streamlit run app.py
   ```

5. **Access the app**
   
   Open your browser and navigate to `http://localhost:8501`

## 📁 Project Structure

```
fraud-detection/
│
├── app.py                      # Streamlit web application
├── fraud_detection.ipynb       # Model training notebook
├── fraud_detection_model.pkl   # Trained model (generated)
├── requirements.txt            # Python dependencies
└── README.md                   # Project documentation
```

## 🚀 Usage

### Training the Model

1. Open `fraud_detection.ipynb` in Jupyter Notebook/Lab
2. Execute all cells sequentially
3. The notebook will:
   - Download the Kaggle fraud dataset via `kagglehub`
   - Preprocess and encode the data
   - Train a Decision Tree classifier
   - Save the model as `fraud_detection_model.pkl`

### Using the Web Application

1. Select a **Transaction Type** from the dropdown
2. Enter the **Transaction Amount**
3. Input the **Old Balance** (balance before transaction)
4. Input the **New Balance** (balance after transaction)
5. Click **"Analyze Transaction"**
6. View the prediction result with visual feedback

### Transaction Types

| Type | Code | Description |
|------|------|-------------|
| CASH_OUT | 1 | Cash withdrawal |
| PAYMENT | 2 | Payment transaction |
| CASH_IN | 3 | Cash deposit |
| TRANSFER | 4 | Money transfer |
| DEBIT | 5 | Debit transaction |

## 🤖 Model Details

### Algorithm
- **Type**: Decision Tree Classifier
- **Library**: scikit-learn
- **Training Split**: 80/20 (train/test)
- **Random State**: 42

### Features

The model uses 4 features for prediction:

| Feature | Description | Range |
|---------|-------------|-------|
| `type` | Transaction type (encoded) | 1-5 |
| `amount` | Transaction amount | 0 - 1,000,000 |
| `oldbalanceOrg` | Original account balance | 0 - 10,000,000 |
| `newbalanceOrig` | New account balance | -1,000,000 - 10,000,000 |

### Output
- **Fraud** - Transaction flagged as potentially fraudulent
- **No Fraud** - Transaction appears legitimate

## 📦 Dependencies

```
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
streamlit>=1.28.0
kagglehub>=0.1.0
plotly>=5.18.0
matplotlib>=3.8.0
seaborn>=0.13.0
```

## 🎨 Screenshots

### Main Interface
The application features a modern dark theme with:
- Gradient backgrounds
- Glass-morphism effects
- Animated transitions
- Responsive card layouts

### Prediction Results
- ✅ **Safe Transaction** - Green success animation
- 🚨 **Fraud Detected** - Red alert animation with warning indicators

## ⚠️ Troubleshooting

### Common Issues

1. **"Model file not found" error**
   - Run the Jupyter notebook first to generate `fraud_detection_model.pkl`

2. **Kaggle dataset download fails**
   - Check your internet connection
   - Verify kagglehub authentication

3. **Port 8501 already in use**
   ```bash
   streamlit run app.py --server.port 8502
   ```

4. **Module not found errors**
   ```bash
   pip install -r requirements.txt --upgrade
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset provided by [Kaggle](https://www.kaggle.com/)
- Built with [Streamlit](https://streamlit.io/)
- Machine Learning powered by [scikit-learn](https://scikit-learn.org/)

---

<div align="center">

**Made with ❤️ for secure transactions**

</div>
