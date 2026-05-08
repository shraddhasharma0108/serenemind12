from datetime import datetime, timedelta, timezone
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional
import random
import uuid

from dotenv import load_dotenv
from openai import AsyncOpenAI
from fastapi import APIRouter, Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

SECRET_KEY = os.environ["SECRET_KEY"]
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENAI_MODEL = "gpt-3.5-turbo"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=False)

app = FastAPI()
api_router = APIRouter(prefix="/api")


QUESTION_OPTIONS = [
    {"value": 0, "label": "Never"},
    {"value": 1, "label": "Sometimes"},
    {"value": 2, "label": "Often"},
    {"value": 3, "label": "Almost Always"},
]

DEPRESSION_QUESTIONS = [
    "I feel low or sad for most of the day.",
    "I have lost interest in things I usually enjoy.",
    "My sleep feels disturbed or irregular.",
    "I feel tired even after resting.",
    "I feel anxious or tense frequently.",
    "I find it hard to focus on studies/work.",
    "I feel overwhelmed by stress.",
    "I feel isolated or disconnected from others.",
    "My appetite has changed significantly.",
    "I feel hopeless about my future.",
    "I feel guilty or blame myself often.",
    "I find it difficult to stay motivated.",
]

GENERAL_TIPS = [
    "Take a 5-minute breathing break and notice your breath.",
    "Drink water and stretch gently for 2 minutes.",
    "Write one thing you did well today.",
    "Go for a short walk in natural light.",
    "Try to sleep at a consistent time tonight.",
]

RISK_BASED_CONTENT = {
    "Low Risk": {
        "chat_prompt": "Encourage habits and confidence gently.",
        "meditation": [
            "3-minute mindful breathing to stay centered.",
            "Gratitude body scan before sleep.",
            "Box breathing: 4-4-4-4 for 5 rounds.",
        ],
        "foods": [
            "Banana + nuts snack for steady energy.",
            "Curd with fruits for gut-brain support.",
            "Whole grains and leafy vegetables daily.",
        ],
        "tips": [
            "Keep a light daily routine with breaks.",
            "Stay socially connected with one close friend.",
            "Continue sleep and hydration consistency.",
        ],
    },
    "Moderate Risk": {
        "chat_prompt": "Use warm, validating, and practical coping suggestions.",
        "meditation": [
            "5-minute grounding: name 5 things you can see.",
            "4-7-8 breathing for calming stress spikes.",
            "Progressive muscle relaxation before bed.",
        ],
        "foods": [
            "Omega-3 rich foods: walnuts, flaxseeds, fish.",
            "Complex carbs: oats, millets, brown rice.",
            "Magnesium-rich foods: spinach, pumpkin seeds.",
        ],
        "tips": [
            "Break tasks into tiny 10-minute goals.",
            "Limit doom-scrolling and late-night caffeine.",
            "Reach out to a trusted person this week.",
        ],
    },
    "High Risk": {
        "chat_prompt": "Be highly supportive, safety-aware, and encourage professional help.",
        "meditation": [
            "2-minute slow breathing with hand on chest.",
            "Safe place visualization for emotional regulation.",
            "Very gentle breath counting from 1 to 5.",
        ],
        "foods": [
            "Easy meals: khichdi, soup, fruit, curd.",
            "Frequent small meals to avoid energy crashes.",
            "Stay hydrated with water or lemon water.",
        ],
        "tips": [
            "You deserve support — consider contacting a counselor.",
            "Keep emergency helpline numbers accessible.",
            "Prioritize rest and ask for help from close people.",
        ],
    },
}

INDIA_HELPLINES = [
    {"name": "Tele-MANAS", "number": "14416 / 1-800-891-4416", "available": "24/7"},
    {"name": "iCALL (TISS)", "number": "+91 9152987821", "available": "Mon-Sat, 10 AM - 8 PM"},
    {"name": "AASRA", "number": "+91 22 27546669", "available": "24/7"},
    {"name": "Vandrevala Foundation", "number": "+91 9999666555", "available": "24/7"},
]


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: EmailStr
    password: str = Field(min_length=4, max_length=60)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4, max_length=60)


class UserPublic(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: EmailStr
    created_at: str


class AuthResponse(BaseModel):
    token: str
    user: UserPublic


class DepressionQuestionsResponse(BaseModel):
    questions: List[Dict[str, Any]]
    options: List[Dict[str, Any]]


class DepressionSubmitRequest(BaseModel):
    answers: List[int]


class DepressionResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    answers: List[int]
    total_score: int
    risk_level: str
    created_at: str


class ChatInput(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


class ChatMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    role: str
    text: str
    timestamp: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(email: str) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": email, "exp": expires_at}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
) -> Dict[str, Any]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=401, detail="Authentication required")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired token") from exc

    user = await db.users.find_one({"email": email}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def classify_risk(total_score: int) -> str:
    if total_score <= 12:
        return "Low Risk"
    if total_score <= 24:
        return "Moderate Risk"
    return "High Risk"


def serialize_questions() -> List[Dict[str, Any]]:
    return [{"id": i + 1, "text": text} for i, text in enumerate(DEPRESSION_QUESTIONS)]


async def get_latest_result(user_id: str) -> Optional[Dict[str, Any]]:
    return await db.test_results.find_one(
        {"user_id": user_id},
        {"_id": 0},
        sort=[("created_at", -1)],
    )


def get_content_bundle(risk_level: Optional[str]) -> Dict[str, Any]:
    if not risk_level:
        return {
            "completed_test": False,
            "risk_level": None,
            "tips": random.sample(GENERAL_TIPS, 3),
            "meditation": [
                "Sit comfortably for 3 minutes and observe breathing.",
                "Inhale deeply for 4 counts, exhale for 6 counts.",
                "Relax your shoulders and jaw consciously.",
            ],
            "foods": [
                "Seasonal fruits + nuts",
                "Dahi with banana",
                "Leafy vegetable + dal meal",
            ],
        }

    selected = RISK_BASED_CONTENT.get(risk_level, RISK_BASED_CONTENT["Moderate Risk"])
    return {
        "completed_test": True,
        "risk_level": risk_level,
        "tips": selected["tips"],
        "meditation": selected["meditation"],
        "foods": selected["foods"],
    }


@api_router.get("/")
async def root():
    return {"message": "SereneMind API running"}


@api_router.post("/auth/signup", response_model=AuthResponse)
async def signup(payload: SignupRequest):
    existing = await db.users.find_one({"email": payload.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_doc = {
        "id": str(uuid.uuid4()),
        "name": payload.name.strip(),
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc.copy())

    user_public = {
        "id": user_doc["id"],
        "name": user_doc["name"],
        "email": user_doc["email"],
        "created_at": user_doc["created_at"],
    }
    token = create_access_token(payload.email)
    return {"token": token, "user": user_public}


@api_router.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    user = await db.users.find_one({"email": payload.email}, {"_id": 0})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_public = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }
    token = create_access_token(payload.email)
    return {"token": token, "user": user_public}


@api_router.get("/auth/me", response_model=UserPublic)
async def me(current_user: Dict[str, Any] = Depends(get_current_user)):
    return current_user


@api_router.get("/depression/questions", response_model=DepressionQuestionsResponse)
async def get_depression_questions(user: Dict[str, Any] = Depends(get_current_user)):
    return {"questions": serialize_questions(), "options": QUESTION_OPTIONS}


@api_router.post("/depression/submit", response_model=DepressionResult)
async def submit_test(payload: DepressionSubmitRequest, user: Dict[str, Any] = Depends(get_current_user)):
    if len(payload.answers) != len(DEPRESSION_QUESTIONS):
        raise HTTPException(status_code=400, detail="Please answer all questions")

    if any(ans not in [0, 1, 2, 3] for ans in payload.answers):
        raise HTTPException(status_code=400, detail="Answers must be values between 0 and 3")

    total_score = sum(payload.answers)
    risk_level = classify_risk(total_score)

    response_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "answers": payload.answers,
        "total_score": total_score,
        "risk_level": risk_level,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.test_results.insert_one(response_doc.copy())
    return response_doc


@api_router.get("/depression/latest")
async def latest_test(user: Dict[str, Any] = Depends(get_current_user)):
    latest = await get_latest_result(user["id"])
    if not latest:
        return {"completed": False, "result": None}
    return {"completed": True, "result": latest}


@api_router.get("/content/dashboard")
async def dashboard_content(user: Dict[str, Any] = Depends(get_current_user)):
    latest = await get_latest_result(user["id"])
    risk = latest["risk_level"] if latest else None
    return get_content_bundle(risk)


@api_router.get("/content/meditation")
async def meditation_content(user: Dict[str, Any] = Depends(get_current_user)):
    latest = await get_latest_result(user["id"])
    risk = latest["risk_level"] if latest else None
    content = get_content_bundle(risk)
    return {
        "completed_test": content["completed_test"],
        "risk_level": content["risk_level"],
        "items": content["meditation"],
    }


@api_router.get("/content/foods")
async def food_content(user: Dict[str, Any] = Depends(get_current_user)):
    latest = await get_latest_result(user["id"])
    risk = latest["risk_level"] if latest else None
    content = get_content_bundle(risk)
    return {
        "completed_test": content["completed_test"],
        "risk_level": content["risk_level"],
        "items": content["foods"],
    }


@api_router.get("/helplines")
async def helplines(country: str = "India"):
    return {"country": "India", "items": INDIA_HELPLINES}


@api_router.get("/chat/history", response_model=List[ChatMessage])
async def chat_history(user: Dict[str, Any] = Depends(get_current_user)):
    messages = await db.chat_messages.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("timestamp", 1).to_list(200)
    return messages


@api_router.post("/chat/send")
async def chat_send(payload: ChatInput, user: Dict[str, Any] = Depends(get_current_user)):
    latest = await get_latest_result(user["id"])
    risk_level = latest["risk_level"] if latest else None
    content_bundle = get_content_bundle(risk_level)

    support_mode = "general supportive guidance"
    if risk_level:
        support_mode = RISK_BASED_CONTENT[risk_level]["chat_prompt"]

    system_message = f"""Tu SereneMind hai — ek dost jaisa mental wellness AI jo India ke students ki help karta hai.

Tujhe Hinglish mein baat karni hai — matlab Hindi aur English mix karke, bilkul waise jaise dost baat karte hain.
Warm, caring, aur non-judgmental rehna hai. Kabhi judgement mat karna.

User ka risk level: {risk_level if risk_level else "abhi test nahi diya"}
Support mode: {support_mode}
Helpful tips jo share kar sakta hai: {content_bundle['tips']}

Examples of how to respond:
- "Arre yaar, ye sun ke dil bhar aaya... tu akela nahi hai 💙"
- "Sach mein bahut tough time chal raha hai tere liye, main samajh sakta hun"
- "Chal ek kaam karte hain — abhi bas 5 min ke liye..."
- "Tu itna kuch handle kar raha hai, ye bahut brave hai"

Rules:
- 2-4 lines mein jawab do — zyada lamba mat karo
- Medical diagnosis bilkul mat karo
- Agar user crisis mein lage toh helpline number batao: iCALL: 9152987821
- Emojis thodi si use karo — 💙 🌿 ✨
- Hamesha caring aur warm rehna"""

    # Get last 10 messages for context
    history = await db.chat_messages.find(
        {"user_id": user["id"]}, {"_id": 0}
    ).sort("timestamp", -1).to_list(10)
    history.reverse()

    messages = [{"role": "system", "content": system_message}]
    for msg in history:
        role = "assistant" if msg["role"] == "assistant" else "user"
        messages.append({"role": role, "content": msg["text"]})
    messages.append({"role": "user", "content": payload.message.strip()})

    try:
        response = await openai_client.chat.completions.create(
            model=OPENAI_MODEL,
            messages=messages,
            max_tokens=200,
            temperature=0.8,
        )
        assistant_reply = response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        assistant_reply = "Arre yaar, abhi thodi technical problem aa gayi 😔 Thodi der mein try karo — main yahan hun 💙"

    now_iso = datetime.now(timezone.utc).isoformat()
    user_msg = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "role": "user",
        "text": payload.message.strip(),
        "timestamp": now_iso,
    }
    bot_msg = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "role": "assistant",
        "text": assistant_reply,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_messages.insert_many([user_msg.copy(), bot_msg.copy()])

    return {"reply": assistant_reply, "risk_level": risk_level}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()