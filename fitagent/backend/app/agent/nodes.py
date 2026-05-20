import json
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from app.agent.state import AgentState
from app.agent.prompts import SYSTEM_PROMPT, PLAN_GENERATOR_PROMPT
from app.core.config import settings


def get_llm():
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.7,
        max_tokens=2000
    )

def chat_node(state: AgentState) -> dict:
    """
    Main chat node.
    Handles user questions about their plan.
    """
    llm = get_llm()

    profile = state.get("user_profile", {})
    plan = state.get("current_plan", {})

    system_prompt = SYSTEM_PROMPT.format(
        profile=json.dumps(profile, indent=2),
        plan=json.dumps(plan, indent=2) if plan else "No plan generated yet.",
        goal=profile.get("goal_type", "general fitness")
    )

    messages = [SystemMessage(content=system_prompt)]
    messages.extend(state["messages"])

    response = llm.invoke(messages)

    return {
        "messages": [response],
        "final_response": response.content
    }

def generate_plan_node(state: AgentState) -> dict:
    """
    Generates a personalized fitness plan.
    Called when user first sets up their profile.
    """
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.3,
        max_tokens=4000
    )

    profile = state.get("user_profile", {})

    prompt = PLAN_GENERATOR_PROMPT.format(
        age=profile.get("age"),
        gender=profile.get("gender"),
        height_cm=profile.get("height_cm"),
        current_weight_kg=profile.get("current_weight_kg"),
        goal_weight_kg=profile.get("goal_weight_kg"),
        goal_type=profile.get("goal_type"),
        activity_level=profile.get("activity_level"),
        dietary_preference=profile.get("dietary_preference"),
        dietary_restrictions=profile.get("dietary_restrictions", []),
        available_equipment=profile.get("available_equipment"),
        busy_days=profile.get("busy_days", []),
        health_conditions=profile.get("health_conditions", []),
        workout_days_per_week=profile.get("workout_days_per_week", 4)
    )

    response = llm.invoke([HumanMessage(content=prompt)])

    try:
        plan_data = json.loads(response.content)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        content = response.content
        start = content.find('{')
        end = content.rfind('}') + 1
        if start != -1 and end != 0:
            plan_data = json.loads(content[start:end])
        else:
            plan_data = {"error": "Could not generate plan"}

    return {
        "current_plan": plan_data,
        "final_response": "Plan generated successfully"
    }