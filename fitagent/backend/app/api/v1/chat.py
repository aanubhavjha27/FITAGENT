from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from langchain_core.messages import HumanMessage
from app.core.deps import get_db, get_current_user
from app.core.security import decode_token
from app.models.user import User
from app.models.profile import HealthProfile
from app.models.plan import FitnessPlan
from app.agent.graph import chat_graph, plan_graph
import json

router = APIRouter()

@router.post("/generate-plan")
async def generate_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate fitness plan for user based on their profile."""

    # Get user profile
    profile = db.query(HealthProfile).filter(
        HealthProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Convert profile to dict
    profile_dict = {
        "age": profile.age,
        "gender": profile.gender,
        "height_cm": profile.height_cm,
        "current_weight_kg": profile.current_weight_kg,
        "goal_weight_kg": profile.goal_weight_kg,
        "goal_type": profile.goal_type,
        "activity_level": profile.activity_level,
        "dietary_preference": profile.dietary_preference,
        "dietary_restrictions": profile.dietary_restrictions or [],
        "available_equipment": profile.available_equipment,
        "busy_days": profile.busy_days or [],
        "health_conditions": profile.health_conditions or [],
        "workout_days_per_week": profile.workout_days_per_week,
    }

    # Run plan generation agent
    result = await plan_graph.ainvoke({
        "messages": [],
        "user_id": str(current_user.id),
        "user_profile": profile_dict,
        "current_plan": None,
        "intent": "generate_plan",
        "final_response": None,
        "error": None,
    })

    plan_data = result.get("current_plan", {})

    # Save or update plan in database
    existing_plan = db.query(FitnessPlan).filter(
        FitnessPlan.user_id == current_user.id
    ).first()

    if existing_plan:
        existing_plan.plan_data = plan_data
        db.commit()
        db.refresh(existing_plan)
    else:
        new_plan = FitnessPlan(
            user_id=current_user.id,
            plan_data=plan_data
        )
        db.add(new_plan)
        db.commit()
        db.refresh(new_plan)

    return {"message": "Plan generated", "plan": plan_data}

@router.get("/my-plan")
def get_my_plan(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's current fitness plan."""
    plan = db.query(FitnessPlan).filter(
        FitnessPlan.user_id == current_user.id
    ).first()

    if not plan:
        raise HTTPException(status_code=404, detail="No plan found")

    return {"plan": plan.plan_data}

@router.websocket("/ws/{token}")
async def websocket_chat(
    websocket: WebSocket,
    token: str,
    db: Session = Depends(get_db)
):
    """WebSocket endpoint for real-time AI chat."""
    await websocket.accept()

    try:
        # Verify token
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            await websocket.close()
            return

        # Get user profile
        profile = db.query(HealthProfile).filter(
            HealthProfile.user_id == user_id
        ).first()

        # Get user plan
        plan = db.query(FitnessPlan).filter(
            FitnessPlan.user_id == user_id
        ).first()

        profile_dict = {}
        if profile:
            profile_dict = {
                "age": profile.age,
                "gender": profile.gender,
                "goal_type": profile.goal_type,
                "current_weight_kg": profile.current_weight_kg,
                "goal_weight_kg": profile.goal_weight_kg,
                "dietary_preference": profile.dietary_preference,
                "available_equipment": profile.available_equipment,
            }

        plan_dict = plan.plan_data if plan else None

        # Store conversation history
        conversation_history = []

        # Send welcome message
        await websocket.send_json({
            "type": "message",
            "content": f"Hi! I'm your FitAgent AI coach 💪 I can help you with your workout plan, nutrition, and answer any fitness questions. What would you like to know?"
        })

        # Chat loop
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            user_message = message_data.get("message", "")

            # Send typing indicator
            await websocket.send_json({
                "type": "typing",
                "content": "Thinking..."
            })

            # Add to history
            conversation_history.append(
                HumanMessage(content=user_message)
            )

            # Run chat agent
            result = await chat_graph.ainvoke({
                "messages": conversation_history,
                "user_id": user_id,
                "user_profile": profile_dict,
                "current_plan": plan_dict,
                "intent": "chat",
                "final_response": None,
                "error": None,
            })

            ai_response = result.get("final_response", "Sorry I couldn't process that.")

            # Add AI response to history
            from langchain_core.messages import AIMessage
            conversation_history.append(
                AIMessage(content=ai_response)
            )

            # Keep history manageable
            if len(conversation_history) > 20:
                conversation_history = conversation_history[-20:]

            # Send response
            await websocket.send_json({
                "type": "message",
                "content": ai_response
            })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({
                "type": "error",
                "content": "Something went wrong. Please try again."
            })
        except:
            pass