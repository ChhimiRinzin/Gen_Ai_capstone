# RoadSentry AI — GitHub Codespaces & Local Installation Guide

## Quick Start on GitHub Codespaces

1. **Launch Codespace:**
   - Open your GitHub repository and click **Code > Codespaces > Create codespace on main**.
   - The `.devcontainer/devcontainer.json` configuration automatically provisions Python 3.11 with all dependencies.

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Add your GROQ_API_KEY in .env (optional for YOLO & CV analysis)
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Launch Streamlit Application:**
   ```bash
   streamlit run app.py --server.address 0.0.0.0 --server.port 8501
   ```
   Codespaces will automatically forward port 8501 and display a notification to open the application in your browser.

5. **Run Automated Tests:**
   ```bash
   pytest tests -v
   ```

## Local Installation (Ubuntu / macOS / Windows WSL2)

```bash
git clone https://github.com/your-username/roadsentry-ai.git
cd roadsentry-ai

python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt

# Run application
streamlit run app.py
```
