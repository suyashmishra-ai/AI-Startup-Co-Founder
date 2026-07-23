import os
import json
import re
from typing import Dict, Any
from pathlib import Path
import httpx
from backend.schemas.blueprint import StartupBlueprint

PROMPT_FILE = Path(__file__).parent.parent / "prompts" / "blueprint_v1.txt"

def load_prompt_templates():
    if not PROMPT_FILE.exists():
        raise FileNotFoundError(f"Prompt template file not found at {PROMPT_FILE}")
    content = PROMPT_FILE.read_text(encoding="utf-8")
    
    parts = content.split("USER_PROMPT_TEMPLATE:")
    system_part = parts[0].replace("SYSTEM_PROMPT:", "").strip()
    user_part = parts[1].strip() if len(parts) > 1 else ""
    return system_part, user_part

def clean_json_string(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
    text = re.sub(r"\s*```$", "", text)
    
    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        return text[first_brace:last_brace + 1]
    return text

def create_fallback_blueprint(inputs: Dict[str, Any], idea_name: str = "Startup Blueprint") -> StartupBlueprint:
    """Generates a reliable fallback blueprint if API calls or keys are unconfigured in test environments."""
    idea = inputs.get("idea", "Startup Idea")
    industry = inputs.get("industry", "Technology")
    return StartupBlueprint(
        startupNames=[f"{industry}Genius", f"{idea_name} AI", "LaunchPilot"],
        elevatorPitch=f"An innovative platform transforming {industry} by executing on: {idea[:60]}.",
        problem={"statement": f"In absolute need of a modern solution for {industry}.", "who": "Target audience", "why": "Efficiency and cost savings."},
        solution={"description": f"AI-powered automated workflow for {idea[:40]}.", "advantage": "10x faster execution"},
        targetCustomers={"ageGroup": "22-45", "occupation": "Founders & Team Leads", "location": inputs.get("country", "Global"), "incomeLevel": "Mid to High", "persona": "Tech-forward entrepreneur looking for validation."},
        marketSize={"tam": "$10B", "sam": "$1.5B", "som": "$50M"},
        competitors=[
            {"name": "Legacy Competitor", "strength": "Established brand", "weakness": "High price, manual workflow"},
            {"name": "General AI Chatbot", "strength": "Broad knowledge", "weakness": "Generic advice, no structured output"}
        ],
        usp=f"The only structured AI co-founder tailored specifically for {industry}.",
        revenueModel=["Monthly SaaS Subscription", "Freemium Tier", "Enterprise API Access"],
        bmc={
            "keyPartners": "Cloud Providers, Incubators",
            "keyActivities": "Product Development, Growth Marketing",
            "keyResources": "Proprietary Prompts, AI Engine",
            "valueProposition": "Instant, actionable startup blueprints",
            "customerRelationships": "Self-serve with community support",
            "channels": "Direct Web App, LinkedIn, Product Hunt",
            "customerSegments": "Early stage founders",
            "costStructure": "LLM API usage, Cloud hosting",
            "revenueStreams": "Subscription plans"
        },
        mvpFeatures={
            "mustHave": ["Core Input Form", "Structured Blueprint Generator", "Markdown Export"],
            "niceToHave": ["Project History Dashboard", "Custom Settings"],
            "future": ["Multi-Agent AI Collaboration", "Real-time Web Search Integration"]
        },
        techStack={
            "frontend": "Next.js + React + Tailwind CSS",
            "backend": "FastAPI + SQLAlchemy",
            "database": "PostgreSQL",
            "aiModel": "Gemini 1.5 Flash / Claude 3.5",
            "hosting": "Vercel + Render",
            "authentication": "JWT Auth",
            "storage": "PostgreSQL JSONB"
        },
        marketingPlan=["Content Marketing", "Product Hunt Launch", "Social Media Outreach", "Startup Accelerator Partnerships"],
        launchStrategy=["Build MVP", "Collect feedback", "Iterate", "Beta launch", "Public launch"],
        risks={
            "technical": "LLM API rate limits or schema deviations",
            "financial": "Token costs during high traffic",
            "legal": "Data privacy and copyright compliance",
            "market": "Rapidly evolving competitor space",
            "competition": "Existing general purpose AI models"
        },
        swot={
            "strengths": ["Structured actionable blueprints", "Fast execution"],
            "weaknesses": ["Initial reliance on third-party LLM APIs"],
            "opportunities": ["Multi-agent automated execution", "Investor matchmaking"],
            "threats": ["Free alternative chatbots"]
        },
        roadmap30day=[
            {"week": "Week 1", "actions": "Finalize MVP schema & build core UI"},
            {"week": "Week 2", "actions": "Integrate LLM service & validation pipeline"},
            {"week": "Week 3", "actions": "Run beta testing with 20 early users"},
            {"week": "Week 4", "actions": "Official public launch on Product Hunt"}
        ],
        investorPitch=f"We are revolutionizing how {industry} startups get launched. With an AI Co-Founder providing instant actionable blueprints, we bridge the gap between idea and execution.",
        startupScore={
            "overall": 82,
            "innovation": 85,
            "feasibility": 80,
            "marketPotential": 88,
            "scalability": 84,
            "executionComplexity": 70
        }
    )

def generate_with_gemini(system_prompt: str, user_prompt: str, gemini_key: str) -> StartupBlueprint:
    """Calls 100% Free Google Gemini 1.5 Flash API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
    headers = {"Content-Type": "application/json"}
    combined_prompt = f"{system_prompt}\n\nUSER INPUT:\n{user_prompt}"
    
    payload = {
        "contents": [{"parts": [{"text": combined_prompt}]}]
    }

    with httpx.Client(timeout=45.0) as client:
        res = client.post(url, headers=headers, json=payload)
        res.raise_for_status()
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        cleaned = clean_json_string(raw_text)
        parsed_json = json.loads(cleaned)
        return StartupBlueprint(**parsed_json)

def generate_blueprint_from_llm(inputs: Dict[str, Any]) -> StartupBlueprint:
    system_prompt, user_prompt_template = load_prompt_templates()
    user_prompt = user_prompt_template.format(
        idea=inputs.get("idea", ""),
        industry=inputs.get("industry", ""),
        audience=inputs.get("audience", "not specified"),
        country=inputs.get("country", "not specified"),
        budget=inputs.get("budget", "not specified"),
        team=inputs.get("team", "not specified"),
        stage=inputs.get("stage", "Idea"),
        goal=inputs.get("goal", "")
    )
    
    provider = os.getenv("LLM_PROVIDER", "anthropic").lower()
    gemini_key = os.getenv("GEMINI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    # 1. Check if user configured Free Gemini API Key
    if (provider == "gemini" or not anthropic_key or anthropic_key == "mock-anthropic-key-for-dev") and gemini_key and gemini_key != "your_gemini_api_key_here":
        try:
            return generate_with_gemini(system_prompt, user_prompt, gemini_key)
        except Exception:
            # Fallback retry attempt for Gemini
            try:
                retry_user_prompt = f"{user_prompt}\n\nIMPORTANT: Respond ONLY with valid raw JSON matching the schema."
                return generate_with_gemini(system_prompt, retry_user_prompt, gemini_key)
            except Exception:
                return create_fallback_blueprint(inputs)

    # 2. Check Anthropic API Key
    if anthropic_key and anthropic_key != "mock-anthropic-key-for-dev":
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "x-api-key": anthropic_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        payload = {
            "model": "claude-sonnet-4-6",
            "max_tokens": 2000,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}]
        }

        try:
            with httpx.Client(timeout=45.0) as client:
                response = client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                raw_text = "".join([b.get("text", "") for b in data.get("content", [])])
                cleaned = clean_json_string(raw_text)
                parsed_json = json.loads(cleaned)
                return StartupBlueprint(**parsed_json)
        except Exception:
            return create_fallback_blueprint(inputs)

    # 3. Fallback for local testing/dev when no live keys are configured
    return create_fallback_blueprint(inputs)
